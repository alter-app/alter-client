import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useChatContactsQuery } from '@/features/chat/hooks/query/useChatContactsQuery'
import { useChatRoomsQuery } from '@/features/chat/hooks/query/useChatRoomsQuery'
import { useCreateChatRoomMutation } from '@/features/chat/hooks/mutation/useCreateChatRoomMutation'
import { resolveChatErrorMessage } from '@/features/chat/lib/chatErrorMessage'
import type { ChatContact } from '@/features/chat/types/chat'
import { chatRoomPath } from '@/shared/constants/routes'
import { showToast } from '@/shared/stores/useToastStore'

interface UseNewChatViewModelOptions {
  enabled: boolean
  onNavigated: () => void
}

export function useNewChatViewModel({
  enabled,
  onNavigated,
}: UseNewChatViewModelOptions) {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const { rooms } = useChatRoomsQuery()
  const { contacts, isLoading, isError, refetch } = useChatContactsQuery({
    enabled,
    existingRooms: rooms,
  })
  const createRoomMutation = useCreateChatRoomMutation()

  const filteredContacts = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    if (!normalized) return contacts
    return contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.workspaceName.toLowerCase().includes(normalized)
    )
  }, [contacts, keyword])

  const selectContact = useCallback(
    async (contact: ChatContact) => {
      // 이미 방이 있으면 새로 만들지 않고 그 방으로 들어갑니다
      if (contact.existingRoomId !== undefined) {
        onNavigated()
        navigate(chatRoomPath(contact.existingRoomId))
        return
      }

      try {
        const created = await createRoomMutation.mutateAsync({
          opponentId: contact.id,
          opponentScope: contact.scope,
        })
        onNavigated()
        navigate(chatRoomPath(created.chatRoomId))
      } catch (error) {
        showToast(
          resolveChatErrorMessage(error, '채팅방을 만들지 못했어요.'),
          'error'
        )
      }
    },
    [createRoomMutation, navigate, onNavigated]
  )

  return {
    keyword,
    setKeyword,
    contacts: filteredContacts,
    isLoading,
    isError,
    refetch,
    isEmpty: !isLoading && !isError && filteredContacts.length === 0,
    hasKeyword: keyword.trim().length > 0,
    isCreating: createRoomMutation.isPending,
    selectContact,
  }
}
