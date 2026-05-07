import { useInfiniteQuery } from '@tanstack/react-query'
import {
  adaptWorkspaceListResponse,
  getMyWorkspaces,
} from '@/features/user/home/workspace/api/workspace'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 10

export function useWorkspacesViewModel() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.workspace.list({ pageSize: PAGE_SIZE }),
    queryFn: async ({ pageParam }) => {
      const response = await getMyWorkspaces({
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
      })
      return response
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => {
      const cursor = lastPage.data.page.cursor
      return cursor || undefined
    },
  })

  const workspaces =
    data?.pages.flatMap(page => adaptWorkspaceListResponse(page)) ?? []

  return {
    workspaces,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  }
}
