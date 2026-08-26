import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchChatContacts } from '@/features/chat/api/chatContacts'
import type { ChatContact, ChatRoomListItem } from '@/features/chat/types/chat'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'

interface UseChatContactsQueryOptions {
  enabled?: boolean
  /** 이미 방이 있는 상대에 '대화중'을 표시하기 위한 기존 방 목록 */
  existingRooms?: ChatRoomListItem[]
}

export function useChatContactsQuery({
  enabled = true,
  existingRooms = [],
}: UseChatContactsQueryOptions = {}) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const scope = useAuthStore(state => state.scope)

  const query = useQuery({
    queryKey: queryKeys.chat.contacts(scope),
    queryFn: () => fetchChatContacts(scope),
    enabled: enabled && isLoggedIn && Boolean(scope),
    staleTime: 60_000,
  })

  const roomIdByParticipant = useMemo(() => {
    const map = new Map<string, number>()
    existingRooms.forEach(room => {
      if (room.opponentId !== undefined && room.opponentScope) {
        map.set(`${room.opponentScope}:${room.opponentId}`, room.id)
      }
    })
    return map
  }, [existingRooms])

  const contacts = useMemo<ChatContact[]>(
    () =>
      (query.data ?? []).map(contact => ({
        ...contact,
        existingRoomId: roomIdByParticipant.get(contact.key),
      })),
    [query.data, roomIdByParticipant]
  )

  return {
    contacts,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
  }
}
