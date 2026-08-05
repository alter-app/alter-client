import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { fetchManagerPostings } from '@/features/manager/posting/api/posting'
import { adaptPostingListItem } from '@/features/manager/posting/types/dto'
import type {
  PostingListItem,
  PostingStatus,
} from '@/features/manager/posting/types/posting'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 10

interface UseManagerPostingsQueryOptions {
  workspaceId?: number
  status?: PostingStatus
}

export function useManagerPostingsQuery({
  workspaceId,
  status,
}: UseManagerPostingsQueryOptions) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.posting.list({
      workspaceId,
      status,
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchManagerPostings({
        pageSize: PAGE_SIZE,
        workspaceId,
        status,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page?.cursor ?? undefined,
  })

  const postings = useMemo<PostingListItem[]>(() => {
    const byId = new Map<number, PostingListItem>()
    for (const dto of data?.pages.flatMap(page => page.data ?? []) ?? []) {
      const posting = adaptPostingListItem(dto)
      byId.set(posting.id, posting)
    }
    return [...byId.values()]
  }, [data])

  return {
    postings,
    totalCount: data?.pages[0]?.page?.totalCount ?? postings.length,
    isLoading: isPending,
    isError,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    fetchNextPage,
  }
}
