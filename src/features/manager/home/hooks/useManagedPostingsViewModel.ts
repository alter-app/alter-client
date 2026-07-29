import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchManagedPostings } from '@/features/manager/api/posting'
import { adaptPostingDto } from '@/features/manager/home/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'

export function useManagedPostingsViewModel(
  workspaceId: number | null,
  params?: { status?: string },
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
    queryKey: queryKeys.posting.list({
      workspaceId: workspaceId ?? undefined,
      status: params?.status,
      pageSize,
    }),
    queryFn: ({ pageParam }) =>
      fetchManagedPostings({
        pageSize,
        workspaceId: workspaceId ?? undefined,
        status: params?.status,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page?.cursor ?? undefined,
    enabled: workspaceId !== null,
  })

  const postings = useMemo(() => {
    const all =
      data?.pages.flatMap(page => page.data?.map(adaptPostingDto) ?? []) ?? []
    return [...new Map(all.map(p => [p.id, p])).values()]
  }, [data])

  const totalCount = data?.pages[0]?.page?.totalCount ?? 0

  return {
    postings,
    totalCount,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    isLoading: isPending && workspaceId !== null,
    isError,
  }
}
