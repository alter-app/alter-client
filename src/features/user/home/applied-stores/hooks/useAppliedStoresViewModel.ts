import { useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import type {
  ApplicationStatus,
  AppliedStoreData,
  FilterType,
} from '@/features/user/home/applied-stores/types/appliedStore'
import {
  FILTER_TO_API_STATUS,
  adaptApplicationDto,
} from '@/features/user/home/applied-stores/types/application'
import { getJobApplications } from '@/features/user/home/applied-stores/api/application'
import { useCancelApplication } from '@/features/user/home/applied-stores/hooks/useCancelApplication'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 20

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'submitted', label: '제출됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

const STATUS_SECTIONS: { key: ApplicationStatus; label: string }[] = [
  { key: 'submitted', label: '제출됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

function getCardStatus(
  status: ApplicationStatus
): 'applied' | 'accepted' | 'rejected' {
  if (status === 'accepted') return 'accepted'
  return status === 'cancelled' ? 'rejected' : 'applied'
}

function getFilterLabel(filter: FilterType): string {
  return FILTER_OPTIONS.find(o => o.key === filter)?.label ?? '전체'
}

export function useAppliedStoresViewModel() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { mutate: cancelApplication, isPending: isCancelling } =
    useCancelApplication()

  const apiStatus = FILTER_TO_API_STATUS[selectedFilter]

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.application.list({
      status: apiStatus.length ? apiStatus : undefined,
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      getJobApplications({
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
        status: apiStatus.length ? apiStatus : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor ?? undefined,
  })

  const stores = useMemo<AppliedStoreData[]>(
    () => data?.pages.flatMap(page => page.data.map(adaptApplicationDto)) ?? [],
    [data]
  )

  const totalCount = data?.pages[0]?.page.totalCount ?? 0

  const grouped = useMemo(
    () =>
      STATUS_SECTIONS.map(section => ({
        ...section,
        stores: stores.filter(s => s.status === section.key),
      })).filter(section => section.stores.length > 0),
    [stores]
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  function toggleDropdown() {
    setIsDropdownOpen(prev => !prev)
  }

  function selectFilter(filter: FilterType) {
    setSelectedFilter(filter)
    setIsDropdownOpen(false)
  }

  return {
    selectedFilter,
    filterLabel: getFilterLabel(selectedFilter),
    isDropdownOpen,
    dropdownRef,
    filterOptions: FILTER_OPTIONS,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
    totalCount,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
    cancelApplication,
    isCancelling,
  }
}
