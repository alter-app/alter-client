import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchChatRooms } from '@/features/chat/api/chatRoom'
import { adaptChatRoomListItem } from '@/features/chat/lib/adaptChat'
import type { ChatRoomListItem } from '@/features/chat/types/chat'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

const PAGE_SIZE = 20

export function useChatRoomsQuery() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useInfiniteQuery({
    queryKey: queryKeys.chat.rooms(scope, {
      chatScope: 'personal',
      pageSize: PAGE_SIZE,
    }),
    queryFn: ({ pageParam }) =>
      fetchChatRooms(scope, { pageSize: PAGE_SIZE, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page?.cursor ?? undefined,
    enabled: isLoggedIn && Boolean(scope),
  })

  const rooms = useMemo<ChatRoomListItem[]>(
    () =>
      query.data?.pages.flatMap(page => page.data.map(adaptChatRoomListItem)) ??
      [],
    [query.data]
  )

  const totalCount = query.data?.pages[0]?.page?.totalCount ?? rooms.length

  return {
    rooms,
    totalCount,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  }
}
