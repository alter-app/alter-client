import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchFavoritePostings } from '@/features/job-lookup-map/api/posting'
import type { FavoritePostingItem } from '@/features/job-lookup-map/types/posting'

const PAGE_SIZE = 10

export function useScrappedPostings() {
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
    queryKey: ['jobLookupMap', 'favoritePostings', PAGE_SIZE] as const,
    queryFn: ({ pageParam }) =>
      fetchFavoritePostings({
        pageSize: PAGE_SIZE,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor ?? undefined,
  })

  const favorites = useMemo(
    () =>
      data?.pages.flatMap((page): FavoritePostingItem[] => page.data ?? []) ??
      [],
    [data]
  )

  const totalCount = data?.pages[0]?.page.totalCount ?? 0

  return {
    favorites,
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
