import { useInfiniteQuery } from '@tanstack/react-query'
import {
  getWorkspaceManagers,
  adaptManagerDto,
} from '@/features/home/user/workspace/api/workspaceMembers'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useWorkspaceManagersViewModel(
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
    queryKey: [...queryKeys.workspace.managers(workspaceId), { pageSize }],
    queryFn: ({ pageParam }) =>
      getWorkspaceManagers(workspaceId, {
        pageSize,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.data.page.cursor ?? undefined,
    enabled: workspaceId > 0,
  })

  const managers =
    data?.pages.flatMap(page => page.data.data.map(adaptManagerDto)) ?? []

  return {
    managers,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
  }
}