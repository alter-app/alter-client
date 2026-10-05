import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import {
  fetchReceivedSubstituteRequests,
  fetchSentSubstituteRequests,
} from '@/features/user/substitute/api/userSubstituteRequests'
import { adaptUserSubstituteListItem } from '@/features/user/substitute/lib/adaptUserSubstituteRequest'
import {
  USER_SUBSTITUTE_STATUS_ORDER,
  USER_SUBSTITUTE_STATUS_TITLE,
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

function buildSections(
  items: UserSubstituteListItem[],
  statusFilter: SubstituteListFilters['statusFilter']
): SubstituteListSection[] {
  if (statusFilter !== 'all') {
    return [
      {
        key: statusFilter,
        title: USER_SUBSTITUTE_STATUS_TITLE[statusFilter],
        items,
      },
    ].filter(section => section.items.length > 0)
  }

  const grouped = new Map<SubstituteUiStatus, UserSubstituteListItem[]>()
  for (const status of USER_SUBSTITUTE_STATUS_ORDER) {
    grouped.set(status, [])
  }
  for (const item of items) {
    grouped.get(item.uiStatus)?.push(item)
  }
  return USER_SUBSTITUTE_STATUS_ORDER.map(status => ({
    key: status,
    title: USER_SUBSTITUTE_STATUS_TITLE[status],
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
