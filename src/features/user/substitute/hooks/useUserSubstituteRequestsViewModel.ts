import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  fetchReceivedSubstituteRequests,
  fetchSentSubstituteRequests,
} from '@/features/user/substitute/api/userSubstituteRequests'
import { adaptUserSubstituteListItem } from '@/features/user/substitute/lib/adaptUserSubstituteRequest'
import {
  resolveApiStatuses,
  type SubstituteListFilters,
} from '@/features/user/substitute/lib/substituteListFilters'
import type {
  ReceivedSubstituteListApiResponse,
  SentSubstituteListApiResponse,
  SubstituteRequestDirection,
  SubstituteUiStatus,
  UserSubstituteListItem,
} from '@/features/user/substitute/types'

type SubstituteListPage =
  | ReceivedSubstituteListApiResponse
  | SentSubstituteListApiResponse
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_LIMIT = 20

export type SubstituteListSection = {
  key: SubstituteUiStatus
  title: string
  items: UserSubstituteListItem[]
}

const SECTION_ORDER: SubstituteUiStatus[] = ['pending', 'accepted', 'cancelled']

const SECTION_TITLE: Record<SubstituteUiStatus, string> = {
  pending: '요청됨',
  accepted: '수락됨',
  cancelled: '취소됨',
}

function buildSections(
  items: UserSubstituteListItem[],
  statusFilter: SubstituteListFilters['statusFilter']
): SubstituteListSection[] {
  if (statusFilter !== 'all') {
    return [
      {
        key: statusFilter,
        title: SECTION_TITLE[statusFilter],
        items,
      },
    ].filter(section => section.items.length > 0)
  }

  const grouped = new Map<SubstituteUiStatus, UserSubstituteListItem[]>()
  for (const status of SECTION_ORDER) {
    grouped.set(status, [])
  }
  for (const item of items) {
    grouped.get(item.uiStatus)?.push(item)
  }
  return SECTION_ORDER.map(status => ({
    key: status,
    title: SECTION_TITLE[status],
    items: grouped.get(status) ?? [],
  })).filter(section => section.items.length > 0)
}

export function useUserSubstituteRequestsViewModel(
  direction: SubstituteRequestDirection,
  filters: SubstituteListFilters = { statusFilter: 'all' }
) {
  const { statusFilter } = filters
  const apiStatuses = resolveApiStatuses(statusFilter)

  const { data, isPending, isError, refetch } = useInfiniteQuery<
    SubstituteListPage,
    Error,
    { pages: SubstituteListPage[]; pageParams: (string | undefined)[] },
    ReturnType<typeof queryKeys.userSubstitute.list>,
    string | undefined
  >({
    queryKey: queryKeys.userSubstitute.list({
      direction,
      pageSize: PAGE_LIMIT,
      statusFilter,
    }),
    queryFn: ({ pageParam }) => {
      const params = {
        pageSize: PAGE_LIMIT,
        cursor: pageParam as string | undefined,
        ...(apiStatuses.length > 0 && { status: apiStatuses }),
      }
      return direction === 'RECEIVED'
        ? fetchReceivedSubstituteRequests(params)
        : fetchSentSubstituteRequests(params)
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage?.data?.page?.cursor || undefined,
  })

  const items = useMemo(
    () =>
      data?.pages.flatMap(
        page =>
          page.data.data.map(dto =>
            adaptUserSubstituteListItem(dto, direction)
          ) ?? []
      ) ?? [],
    [data, direction]
  )

  const sections = useMemo(
    () => buildSections(items, statusFilter),
    [items, statusFilter]
  )

  const totalCount = data?.pages?.[0]?.data?.page?.totalCount ?? 0

  return {
    items,
    sections,
    totalCount,
    isLoading: isPending,
    isError,
    refetch,
  }
}
