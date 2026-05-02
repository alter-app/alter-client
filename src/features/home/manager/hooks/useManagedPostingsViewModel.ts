import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchManagedPostings } from '@/features/home/manager/api/posting'
import { adaptPostingDto } from '@/features/home/manager/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 10

export function useManagedPostingsViewModel(
  workspaceId: number | null,
  params?: { status?: string }
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
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchManagedPostings({
        pageSize: PAGE_SIZE,
        workspaceId: workspaceId ?? undefined,
        status: params?.status,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.data?.page?.cursor ?? undefined,
    enabled: workspaceId !== null,
  })

  const postings = useMemo(
    () =>
      data?.pages.flatMap(
        page => page.data?.data?.map(adaptPostingDto) ?? []
      ) ?? [],
    [data]
  )

  const totalCount = data?.pages[0]?.data?.page?.totalCount ?? 0

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
