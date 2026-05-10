import { useInfiniteQuery } from '@tanstack/react-query'
import {
  getWorkspaceWorkers,
  adaptWorkerDto,
} from '@/features/user/home/workspace/api/workspaceMembers'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkspaceWorkersViewModel(
  workspaceId: number,
  pageSize = 10
) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: [...queryKeys.workspace.workers(workspaceId), { pageSize }],
    queryFn: ({ pageParam }) =>
      getWorkspaceWorkers(workspaceId, {
        pageSize,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.data.page.cursor ?? undefined,
    enabled: workspaceId > 0,
  })

  const workers =
    data?.pages.flatMap(page => page.data.data.map(adaptWorkerDto)) ?? []

  const totalCount = data?.pages[0]?.data.page.totalCount ?? 0

  return {
    workers,
    totalCount,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
  }
}
