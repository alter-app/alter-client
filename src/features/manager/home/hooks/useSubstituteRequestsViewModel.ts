import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchSubstituteRequests } from '@/features/manager/api/substitute'
import { adaptSubstituteRequestDto } from '@/features/manager/home/types/substitute'
import { resolveManagerApiStatuses } from '@/features/manager/substitute/lib/managerSubstituteListFilters'
import type { SubstituteListStatusFilter } from '@/features/user/substitute/lib/substituteListFilters'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useSubstituteRequestsViewModel(
  workspaceId: number | null,
  params?: { statusFilter?: SubstituteListStatusFilter },
  pageSize = 10
) {
  const statusFilter = params?.statusFilter ?? 'all'
  const apiStatuses = resolveManagerApiStatuses(statusFilter)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.substitute.list({
      workspaceId: workspaceId ?? undefined,
      statusFilter,
      pageSize,
    }),
    queryFn: ({ pageParam }) =>
      fetchSubstituteRequests({
        pageSize,
        workspaceId: workspaceId ?? undefined,
        status: apiStatuses.length > 0 ? apiStatuses : undefined,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage?.data?.page?.cursor ?? undefined,
    enabled: workspaceId !== null,
  })

  const requests = useMemo(() => {
    const all =
      data?.pages.flatMap(
        page => page?.data?.data?.map(adaptSubstituteRequestDto) ?? []
      ) ?? []
    return [...new Map(all.map(r => [r.id, r])).values()]
  }, [data])

  const totalCount = data?.pages?.[0]?.data?.page?.totalCount ?? 0

  return {
    requests,
    totalCount,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending && workspaceId !== null,
    isError,
  }
}
