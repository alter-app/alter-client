import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrGetChatRoom } from '@/features/social/api/chatroom'
import type { CreateChatRoomRequestDto } from '@/features/social/types/chatroom'

export function useCreateOrGetChatRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateChatRoomRequestDto) =>
      createOrGetChatRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms', 'list'] })
    },
  })
}
