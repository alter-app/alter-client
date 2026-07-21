import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchPostings } from '@/features/job-lookup-map/api/posting'
import type { PostingsListFilters } from '@/features/job-lookup-map/lib/postingFilters'
import type { Posting } from '@/features/job-lookup-map/types/posting'

const PAGE_SIZE = 10

export function usePostings(filters?: PostingsListFilters) {
  const listFilters = useMemo(() => filters ?? {}, [filters])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['jobLookupMap', 'postings', PAGE_SIZE, listFilters] as const,
    queryFn: ({ pageParam }) =>
      fetchPostings({
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
        ...listFilters,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor ?? undefined,
  })

  const postings = useMemo(
    () => data?.pages.flatMap((page): Posting[] => page.data ?? []) ?? [],
    [data]
  )

  const totalCount = data?.pages[0]?.page.totalCount ?? 0

  return {
    postings,
    totalCount,
    fetchNextPage,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    isLoading: isPending,
    isFetching,
    isError,
    refetch,
  }
}
