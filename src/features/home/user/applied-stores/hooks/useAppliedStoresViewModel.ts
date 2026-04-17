import { useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import type {
  ApplicationStatus,
  AppliedStoreData,
  FilterType,
} from '@/features/home/user/applied-stores/types/appliedStore'
import {
  FILTER_TO_API_STATUS,
  adaptApplicationDto,
} from '@/features/home/user/applied-stores/types/application'
import { getJobApplications } from '@/features/home/user/applied-stores/api/application'
import { useCancelApplication } from '@/features/home/user/applied-stores/hooks/useCancelApplication'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 20

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: 'completed', label: '지원 완료' },
  { key: 'viewed', label: '열람' },
  { key: 'not_viewed', label: '미열람' },
  { key: 'cancelled', label: '지원 취소' },
]

const STATUS_SECTIONS: { key: ApplicationStatus; label: string }[] = [
  { key: 'submitted', label: '제출됨' },
  { key: 'accepted', label: '수락됨' },
  { key: 'cancelled', label: '취소됨' },
]

function getCardStatus(status: ApplicationStatus): 'applied' | 'rejected' {
  return status === 'cancelled' ? 'rejected' : 'applied'
}

function getFilterLabel(filter: FilterType): string {
  if (filter === 'all') return '전체'
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
    () =>
      data?.pages.flatMap(page => page.data.map(adaptApplicationDto)) ??
      [],
    [data]
  )

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
    filterLabel: getFilterLabel(selectedFilter),
    isDropdownOpen,
    dropdownRef,
    filterOptions: FILTER_OPTIONS,
    grouped,
    toggleDropdown,
    selectFilter,
    getCardStatus,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
    cancelApplication,
    isCancelling,
  }
}
