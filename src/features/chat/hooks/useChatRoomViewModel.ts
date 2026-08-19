import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useChatMessagesQuery } from '@/features/chat/hooks/query/useChatMessagesQuery'
import { useChatRoomDetailQuery } from '@/features/chat/hooks/query/useChatRoomDetailQuery'
import { useChatRoomsQuery } from '@/features/chat/hooks/query/useChatRoomsQuery'
import { useMarkChatRoomReadMutation } from '@/features/chat/hooks/mutation/useMarkChatRoomReadMutation'
import { useChatStomp } from '@/features/chat/hooks/useChatStomp'
import { adaptChatMessage } from '@/features/chat/lib/adaptChat'
import {
  buildChatTimeline,
  mergeChatMessages,
  sortMessagesAscending,
} from '@/features/chat/lib/chatTimeline'
import {
  findGroupChatRoomSeed,
  isGroupChatRoomId,
  useGroupChatMockStore,
} from '@/features/chat/mock/groupChatMockStore'
import type {
  ChatConnectionState,
  ChatMessage,
  ChatRoomContext,
} from '@/features/chat/types/chat'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'
import { useUserMe } from '@/features/user/me/hooks/useUserMe'

function createClientId(): string {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useChatRoomViewModel(roomId: number) {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)
  const { user } = useUserMe()

  const isGroupRoom = isGroupChatRoomId(roomId)
  const groupSeed = findGroupChatRoomSeed(roomId)

  /**
   * 방 전환 시 초기화해야 하는 화면 상태를 roomId 와 함께 묶어 둡니다.
   * effect 로 리셋하면 이전 방의 메시지가 한 프레임 노출되므로 렌더 중 조정합니다.
   */
  const [roomState, setRoomState] = useState(() => ({
    roomId,
    draft: '',
    isAttachmentOpen: false,
    pendingMessages: [] as ChatMessage[],
    /** STOMP 로 받은 메시지 — 재조회 전까지 화면에 즉시 반영 */
    liveMessages: [] as ChatMessage[],
  }))

  if (roomState.roomId !== roomId) {
    setRoomState({
      roomId,
      draft: '',
      isAttachmentOpen: false,
      pendingMessages: [],
      liveMessages: [],
    })
  }

  const { draft, isAttachmentOpen, pendingMessages, liveMessages } = roomState

  const setDraft = useCallback((next: string) => {
    setRoomState(current => ({ ...current, draft: next }))
  }, [])

  const toggleAttachment = useCallback(() => {
    setRoomState(current => ({
      ...current,
      isAttachmentOpen: !current.isAttachmentOpen,
    }))
  }, [])

  const { rooms, isLoading: isRoomListLoading } = useChatRoomsQuery()
  const listRoom = useMemo(
    () => rooms.find(candidate => candidate.id === roomId),
    [rooms, roomId]
  )

  // 방이 목록 첫 페이지에 없을 수 있어(딥링크·새로고침) 상세로 폴백합니다
  const { room: detailRoom } = useChatRoomDetailQuery({
    roomId,
    enabled: !isGroupRoom && !isRoomListLoading && !listRoom,
  })
  const room = listRoom ?? detailRoom

  const messagesQuery = useChatMessagesQuery({
    roomId,
    enabled: !isGroupRoom,
    myId: user.id,
    myScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
    opponentId: room?.opponentId,
    opponentScope: room?.opponentScope,
    opponentName: room?.title,
  })

  const groupMessages = useGroupChatMockStore(
    state => state.messagesByRoomId[roomId]
  )
  const sendGroupMessage = useGroupChatMockStore(state => state.sendMessage)
  const markGroupRead = useGroupChatMockStore(state => state.markRead)

  const markReadMutation = useMarkChatRoomReadMutation()
  const markReadMutate = markReadMutation.mutate

  /**
   * 서버가 last_read 를 이 id 까지 올리므로 읽음 처리는 메시지를 받은 뒤에야 보낼 수 있습니다.
   * 낙관적 메시지는 음수 id 라 제외됩니다.
   */
  const lastReadTargetId = useMemo(() => {
    let latest = 0
    for (const message of messagesQuery.messages) {
      if (message.id > latest) latest = message.id
    }
    for (const message of liveMessages) {
      if (message.id > latest) latest = message.id
    }
    return latest
  }, [messagesQuery.messages, liveMessages])

  const markedReadIdRef = useRef(0)

  useEffect(() => {
    markedReadIdRef.current = 0
  }, [roomId])

  // 방을 열어둔 채 새 메시지를 받아도 읽음 상태를 따라 올립니다
  useEffect(() => {
    if (isGroupRoom || !Number.isFinite(roomId)) return
    if (lastReadTargetId <= markedReadIdRef.current) return

    markedReadIdRef.current = lastReadTargetId
    markReadMutate({ roomId, lastReadMessageId: lastReadTargetId })
  }, [roomId, isGroupRoom, lastReadTargetId, markReadMutate])

  const hasMarkedGroupReadRef = useRef(false)

  useEffect(() => {
    hasMarkedGroupReadRef.current = false
  }, [roomId])

  useEffect(() => {
    if (!isGroupRoom || hasMarkedGroupReadRef.current) return
    hasMarkedGroupReadRef.current = true
    markGroupRead(roomId)
  }, [roomId, isGroupRoom, markGroupRead])

  const handleIncomingMessage = useCallback(
    (dto: Parameters<typeof adaptChatMessage>[0]) => {
      const message = adaptChatMessage(dto, {
        myId: user.id,
        myScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
        opponentId: room?.opponentId,
        opponentScope: room?.opponentScope,
        opponentName: room?.title,
      })

      setRoomState(current => {
        if (current.liveMessages.some(existing => existing.id === message.id)) {
          return current
        }
        return {
          ...current,
          liveMessages: [...current.liveMessages, message],
          // 내가 보낸 메시지의 echo 가 도착하면 낙관적 항목을 제거합니다
          pendingMessages: message.isMine
            ? current.pendingMessages.filter(
                pending => pending.content !== message.content
              )
            : current.pendingMessages,
        }
      })
      // 목록의 미리보기·정렬·미읽음을 갱신합니다
      void queryClient.invalidateQueries({ queryKey: queryKeys.chat.roomsAll })
    },
    [
      user.id,
      scope,
      room?.opponentId,
      room?.opponentScope,
      room?.title,
      queryClient,
    ]
  )

  const { connectionState, isConnected, sendMessage } = useChatStomp({
    roomId,
    enabled: !isGroupRoom,
    onMessage: handleIncomingMessage,
  })

  const messages = useMemo<ChatMessage[]>(() => {
    if (isGroupRoom) return groupMessages ?? []

    const serverMessages = sortMessagesAscending([
      ...messagesQuery.messages,
      ...liveMessages.filter(
        live => !messagesQuery.messages.some(loaded => loaded.id === live.id)
      ),
    ])
    return mergeChatMessages(serverMessages, pendingMessages)
  }, [
    isGroupRoom,
    groupMessages,
    messagesQuery.messages,
    liveMessages,
    pendingMessages,
  ])

  const roomContext = useMemo<ChatRoomContext>(() => {
    if (isGroupRoom) {
      return {
        id: roomId,
        segment: 'group',
        title: groupSeed?.workspaceName ?? '전체 채팅',
        memberCount: groupSeed?.memberCount,
      }
    }
    return {
      id: roomId,
      segment: 'personal',
      title: room?.title ?? '채팅',
    }
  }, [isGroupRoom, roomId, groupSeed, room?.title])

  const timeline = useMemo(
    () => buildChatTimeline(messages, roomContext.segment),
    [messages, roomContext.segment]
  )

  const handleSend = useCallback(() => {
    const content = draft.trim()
    if (!content) return

    if (isGroupRoom) {
      setRoomState(current => ({ ...current, draft: '' }))
      sendGroupMessage(roomId, content)
      return
    }

    const optimistic: ChatMessage = {
      id: -Date.now(),
      clientId: createClientId(),
      senderId: user.id ?? -1,
      senderScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
      senderName: '',
      senderProfileImageUrl: null,
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: sendMessage(content) ? 'pending' : 'failed',
      messageType: 'NORMAL',
      attachments: [],
    }
    setRoomState(current => ({
      ...current,
      draft: '',
      pendingMessages: [...current.pendingMessages, optimistic],
    }))
  }, [
    draft,
    isGroupRoom,
    sendGroupMessage,
    roomId,
    user.id,
    scope,
    sendMessage,
  ])

  const retryFailedMessage = useCallback(
    (clientId: string) => {
      setRoomState(current => ({
        ...current,
        pendingMessages: current.pendingMessages.map(pending =>
          pending.clientId === clientId
            ? {
                ...pending,
                status: sendMessage(pending.content) ? 'pending' : 'failed',
              }
            : pending
        ),
      }))
    },
    [sendMessage]
  )

  return {
    room: roomContext,
    timeline,
    messages,
    isLoading: isGroupRoom ? false : messagesQuery.isLoading,
    isError: isGroupRoom ? false : messagesQuery.isError,
    isEmpty: messages.length === 0,
    refetch: messagesQuery.refetch,
    hasOlderMessages: isGroupRoom ? false : messagesQuery.hasOlderMessages,
    isFetchingOlderMessages: isGroupRoom
      ? false
      : messagesQuery.isFetchingOlderMessages,
    fetchOlderMessages: messagesQuery.fetchOlderMessages,
    draft,
    setDraft,
    handleSend,
    retryFailedMessage,
    /** 전체 채팅은 목업이라 항상 연결된 것으로 표시합니다 */
    connectionState: isGroupRoom
      ? ('connected' as ChatConnectionState)
      : connectionState,
    isConnected: isGroupRoom ? true : isConnected,
    isAttachmentOpen,
    toggleAttachment,
  }
}
