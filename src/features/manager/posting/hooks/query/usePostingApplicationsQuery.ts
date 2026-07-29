import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { fetchPostingApplications } from '@/features/manager/posting/api/application'
import { adaptApplicationListItem } from '@/features/manager/posting/types/dto'
import type { ApplicationListItem } from '@/features/manager/posting/types/posting'
import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 10

interface UsePostingApplicationsQueryOptions {
  workspaceId?: number
  status?: ApplicationApiStatus
}

export function usePostingApplicationsQuery({
  workspaceId,
  status,
}: UsePostingApplicationsQueryOptions) {
  const statusFilter = useMemo(() => (status ? [status] : undefined), [status])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.posting.applicationList({
      workspaceId,
      status: statusFilter,
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchPostingApplications({
        pageSize: PAGE_SIZE,
        workspaceId,
        status: statusFilter,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page?.cursor ?? undefined,
  })

  const applications = useMemo<ApplicationListItem[]>(() => {
    const byId = new Map<number, ApplicationListItem>()
    for (const dto of data?.pages.flatMap(page => page.data ?? []) ?? []) {
      const application = adaptApplicationListItem(dto)
      byId.set(application.id, application)
    }
    return [...byId.values()]
  }, [data])

  return {
    applications,
    totalCount: data?.pages[0]?.page?.totalCount ?? applications.length,
    isLoading: isPending,
    isError,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
  }
}
