import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchSubstituteRequests } from '@/features/home/manager/api/substitute'
import { adaptSubstituteRequestDto } from '@/features/home/manager/types/substitute'
import { queryKeys } from '@/shared/lib/queryKeys'

const PAGE_SIZE = 10

export function useSubstituteRequestsViewModel(
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
    queryKey: queryKeys.substitute.list({
      workspaceId: workspaceId ?? undefined,
      status: params?.status,
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchSubstituteRequests({
        pageSize: PAGE_SIZE,
        workspaceId: workspaceId ?? undefined,
        status: params?.status,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.data.page?.cursor ?? undefined,
    enabled: workspaceId !== null,
  })

  const requests = useMemo(
    () =>
      data?.pages.flatMap(
        page => page.data.data?.map(adaptSubstituteRequestDto) ?? []
      ) ?? [],
    [data]
  )

  const totalCount = data?.pages[0]?.data.page?.totalCount ?? 0

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
