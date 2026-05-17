import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchWorkspaceWorkers } from '@/features/manager/api/worker'
import { adaptWorkerDto } from '@/features/manager/home/lib/worker'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 50

export function useWorkspaceWorkersViewModel(
  workspaceId: number | null,
  params?: { status?: string; name?: string }
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.managerWorkspace.workers(workspaceId ?? 0, {
      status: params?.status,
      name: params?.name,
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchWorkspaceWorkers({
        workspaceId: workspaceId!,
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
        status: params?.status,
        name: params?.name,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.data.page.cursor ?? undefined,
    enabled: workspaceId !== null,
  })

  const workers = useMemo(
    () => data?.pages.flatMap(page => page.data.data.map(adaptWorkerDto)) ?? [],
    [data]
  )

  const totalCount = data?.pages[0]?.data.page.totalCount ?? 0

  return {
    workers,
    totalCount,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending && workspaceId !== null,
    isError,
  }
}
