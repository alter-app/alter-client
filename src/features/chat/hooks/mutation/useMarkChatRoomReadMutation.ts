import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markChatRoomRead } from '@/features/chat/api/chatRoom'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

export interface MarkChatRoomReadVariables {
  roomId: number
  /** 서버가 last_read 를 이 지점까지 올립니다 */
  lastReadMessageId: number
}

export function useMarkChatRoomReadMutation() {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)

  return useMutation({
    mutationFn: ({ roomId, lastReadMessageId }: MarkChatRoomReadVariables) =>
      markChatRoomRead(scope, roomId, lastReadMessageId),
    onSuccess: () => {
      // 방 진입으로 미읽음이 0이 되므로 목록·Docbar 뱃지를 갱신합니다
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.roomsAll })
    },
  })
}
