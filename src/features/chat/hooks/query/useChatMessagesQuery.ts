import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchChatMessages } from '@/features/chat/api/chatRoom'
import {
  adaptChatMessage,
  type AdaptChatMessageOptions,
} from '@/features/chat/lib/adaptChat'
import { sortMessagesAscending } from '@/features/chat/lib/chatTimeline'
import type { ChatMessage } from '@/features/chat/types/chat'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

const PAGE_SIZE = 30

interface UseChatMessagesQueryOptions extends AdaptChatMessageOptions {
  roomId: number
  enabled?: boolean
}

export function useChatMessagesQuery({
  roomId,
  enabled = true,
  ...adaptOptions
}: UseChatMessagesQueryOptions) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useInfiniteQuery({
    queryKey: queryKeys.chat.messages(scope, roomId, { pageSize: PAGE_SIZE }),
    queryFn: ({ pageParam }) =>
      fetchChatMessages(scope, roomId, {
        pageSize: PAGE_SIZE,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page?.cursor ?? undefined,
    enabled: enabled && isLoggedIn && Boolean(scope) && Number.isFinite(roomId),
  })

  /** 서버는 최신순 커서 페이지를 주므로 화면 표시용으로 오래된 → 최신으로 정렬합니다 */
  const messages = useMemo<ChatMessage[]>(() => {
    const flattened =
      query.data?.pages.flatMap(page =>
        page.data.map(dto => adaptChatMessage(dto, adaptOptions))
      ) ?? []
    return sortMessagesAscending(flattened)
    // adaptOptions 는 매 렌더 새 객체라 값 기준으로 의존성을 나열합니다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.data,
    adaptOptions.myId,
    adaptOptions.myScope,
    adaptOptions.opponentId,
    adaptOptions.opponentScope,
    adaptOptions.opponentName,
  ])

  return {
    messages,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
    /** 위로 당겨 과거 메시지 추가 로드 */
    hasOlderMessages: query.hasNextPage,
    isFetchingOlderMessages: query.isFetchingNextPage,
    fetchOlderMessages: query.fetchNextPage,
  }
}
