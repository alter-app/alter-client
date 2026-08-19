import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createChatRoom } from '@/features/chat/api/chatRoom'
import { toServerScope } from '@/features/chat/lib/adaptChat'
import type { ChatParticipantScope } from '@/features/chat/types/dto'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

export interface CreateChatRoomVariables {
  opponentId: number
  opponentScope: ChatParticipantScope
}

export function useCreateChatRoomMutation() {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)

  return useMutation({
    mutationFn: (variables: CreateChatRoomVariables) =>
      createChatRoom(scope, {
        opponentUserId: variables.opponentId,
        opponentScope: toServerScope(variables.opponentScope),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.all })
    },
  })
}
