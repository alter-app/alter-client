import { useQuery } from '@tanstack/react-query'
import { fetchChatRoomDetail } from '@/features/chat/api/chatRoom'
import { adaptChatRoomDetail } from '@/features/chat/lib/adaptChat'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

interface UseChatRoomDetailQueryOptions {
  roomId: number
  enabled?: boolean
}

/**
 * 목록을 거치지 않고 방에 바로 진입(딥링크·새로고침)했을 때 헤더 제목과 상대 정보를 채웁니다.
 * 목록 캐시에 방이 있으면 호출하지 않습니다.
 */
export function useChatRoomDetailQuery({
  roomId,
  enabled = true,
}: UseChatRoomDetailQueryOptions) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.chat.roomDetail(scope, roomId),
    queryFn: () => fetchChatRoomDetail(scope, roomId),
    select: adaptChatRoomDetail,
    enabled: enabled && isLoggedIn && Boolean(scope) && Number.isFinite(roomId),
  })

  return { room: query.data, isLoading: query.isLoading }
}
