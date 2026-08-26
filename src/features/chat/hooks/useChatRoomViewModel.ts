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
  chatMessageSignature,
  mergeChatMessages,
  sortMessagesAscending,
} from '@/features/chat/lib/chatTimeline'
import { resolveChatErrorMessage } from '@/features/chat/lib/chatErrorMessage'
import {
  CHAT_ATTACHMENT_MAX_COUNT,
  type ChatAttachment,
  type ChatMessage,
  type ChatRoomContext,
} from '@/features/chat/types/chat'
import { uploadAppFile } from '@/shared/api/appFileUpload'
import { queryKeys } from '@/shared/lib/queryKeys'
import useAuthStore from '@/shared/stores/useAuthStore'
import { showToast } from '@/shared/stores/useToastStore'
import { useUserMe } from '@/features/user/me/hooks/useUserMe'

function createClientId(): string {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useChatRoomViewModel(roomId: number) {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)
  const { user } = useUserMe()

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
    enabled: !isRoomListLoading && !listRoom,
  })
  const room = listRoom ?? detailRoom
  const isGroupRoom = room?.segment === 'group'

  /** 전체 채팅방에는 상대방이 없어 발신자 폴백에 쓰면 안 됩니다 */
  const opponentName = isGroupRoom ? undefined : room?.title

  const messagesQuery = useChatMessagesQuery({
    roomId,
    myId: user.id,
    myScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
    opponentId: room?.opponentId,
    opponentScope: room?.opponentScope,
    opponentName,
  })

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
    if (!Number.isFinite(roomId)) return
    if (lastReadTargetId <= markedReadIdRef.current) return

    markedReadIdRef.current = lastReadTargetId
    markReadMutate({ roomId, lastReadMessageId: lastReadTargetId })
  }, [roomId, lastReadTargetId, markReadMutate])

  const handleIncomingMessage = useCallback(
    (dto: Parameters<typeof adaptChatMessage>[0]) => {
      const message = adaptChatMessage(dto, {
        myId: user.id,
        myScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
        opponentId: room?.opponentId,
        opponentScope: room?.opponentScope,
        opponentName,
      })

      setRoomState(current => {
        if (current.liveMessages.some(existing => existing.id === message.id)) {
          return current
        }
        const echoSignature = chatMessageSignature(message)
        return {
          ...current,
          liveMessages: [...current.liveMessages, message],
          // 내가 보낸 메시지의 echo 가 도착하면 낙관적 항목을 제거합니다
          pendingMessages: message.isMine
            ? current.pendingMessages.filter(
                pending => chatMessageSignature(pending) !== echoSignature
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
      opponentName,
      queryClient,
    ]
  )

  const { connectionState, isConnected, sendMessage } = useChatStomp({
    roomId,
    onMessage: handleIncomingMessage,
  })

  const messages = useMemo<ChatMessage[]>(() => {
    const serverMessages = sortMessagesAscending([
      ...messagesQuery.messages,
      ...liveMessages.filter(
        live => !messagesQuery.messages.some(loaded => loaded.id === live.id)
      ),
    ])
    return mergeChatMessages(serverMessages, pendingMessages)
  }, [messagesQuery.messages, liveMessages, pendingMessages])

  const roomContext = useMemo<ChatRoomContext>(
    () => ({
      id: roomId,
      segment: isGroupRoom ? 'group' : 'personal',
      title: room?.title ?? (isGroupRoom ? '전체 채팅' : '채팅'),
      // 개인 채팅도 서버가 인원수(2)를 주지만 헤더에는 전체 채팅에서만 노출합니다
      memberCount: isGroupRoom ? room?.memberCount : undefined,
    }),
    [roomId, isGroupRoom, room?.title, room?.memberCount]
  )

  const timeline = useMemo(
    () => buildChatTimeline(messages, roomContext.segment),
    [messages, roomContext.segment]
  )

  const handleSend = useCallback(() => {
    const content = draft.trim()
    if (!content) return

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
      status: sendMessage({ content }) ? 'pending' : 'failed',
      messageType: 'NORMAL',
      attachments: [],
    }
    setRoomState(current => ({
      ...current,
      draft: '',
      pendingMessages: [...current.pendingMessages, optimistic],
    }))
  }, [draft, user.id, scope, sendMessage])

  const [isSendingImages, setSendingImages] = useState(false)

  /** 미리보기용 object URL — 방을 떠날 때 한 번에 해제합니다 */
  const previewUrlsRef = useRef<string[]>([])

  useEffect(() => {
    const urls = previewUrlsRef.current
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
      previewUrlsRef.current = []
    }
  }, [roomId])

  /** 재시도 때 다시 업로드할 원본 파일 — 방을 떠나면 함께 비웁니다 */
  const pendingFilesRef = useRef(new Map<string, File[]>())

  useEffect(() => {
    const files = pendingFilesRef.current
    return () => files.clear()
  }, [roomId])

  const setPendingStatus = useCallback(
    (clientId: string, status: ChatMessage['status']) => {
      setRoomState(current => ({
        ...current,
        pendingMessages: current.pendingMessages.map(pending =>
          pending.clientId === clientId ? { ...pending, status } : pending
        ),
      }))
    },
    []
  )

  /** 업로드 → STOMP 전송. 최초 전송과 재시도가 같은 경로를 씁니다 */
  const uploadAndPublish = useCallback(
    async (clientId: string, files: File[], content: string) => {
      setSendingImages(true)
      try {
        const fileIds = await Promise.all(
          files.map(file =>
            uploadAppFile({
              file,
              targetType: 'CHAT_MESSAGE',
              // 채팅 이미지는 비공개 버킷 — 조회 시 presigned URL 로 내려옵니다
              bucketType: 'PRIVATE',
              scope,
            })
          )
        )

        if (!sendMessage({ content: content || undefined, fileIds })) {
          throw new Error('연결이 끊겨 이미지를 보내지 못했습니다.')
        }
      } catch (error) {
        setPendingStatus(clientId, 'failed')
        showToast(
          resolveChatErrorMessage(error, '이미지를 보내지 못했어요.'),
          'error'
        )
      } finally {
        setSendingImages(false)
      }
    },
    [scope, sendMessage, setPendingStatus]
  )

  /**
   * 이미지 전송 — 업로드로 fileId 를 받은 뒤 STOMP 로 보냅니다.
   * 업로드 대기 동안에는 로컬 미리보기를 pending 으로 띄웁니다.
   */
  const sendImages = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      if (files.length > CHAT_ATTACHMENT_MAX_COUNT) {
        showToast(
          `이미지는 한 번에 ${CHAT_ATTACHMENT_MAX_COUNT}장까지 보낼 수 있어요.`,
          'error'
        )
        return
      }

      const clientId = createClientId()
      const previews: ChatAttachment[] = files.map((file, index) => {
        const url = URL.createObjectURL(file)
        previewUrlsRef.current.push(url)
        return { fileId: `${clientId}-${index}`, url }
      })

      // 입력창에 쓰던 글이 있으면 이미지와 한 메시지로 함께 보냅니다
      const content = draft.trim()

      setRoomState(current => ({
        ...current,
        draft: '',
        isAttachmentOpen: false,
        pendingMessages: [
          ...current.pendingMessages,
          {
            id: -Date.now(),
            clientId,
            senderId: user.id ?? -1,
            senderScope: scope === 'MANAGER' ? 'MANAGER' : 'USER',
            senderName: '',
            senderProfileImageUrl: null,
            content,
            createdAt: new Date().toISOString(),
            isMine: true,
            status: 'pending',
            messageType: 'NORMAL',
            attachments: previews,
          },
        ],
      }))

      pendingFilesRef.current.set(clientId, files)
      await uploadAndPublish(clientId, files, content)
    },
    [draft, user.id, scope, uploadAndPublish]
  )

  /**
   * 실패한 메시지 재전송.
   * 이미지 메시지는 업로드부터 다시 합니다 — 앞선 시도에서 fileId 를 받았는지 알 수 없어서
   * 그대로 다시 올리는 편이 안전합니다.
   */
  const retryFailedMessage = useCallback(
    (clientId: string) => {
      const target = pendingMessages.find(
        pending => pending.clientId === clientId
      )
      if (!target || target.status !== 'failed') return

      const files = pendingFilesRef.current.get(clientId)

      if (files?.length) {
        setPendingStatus(clientId, 'pending')
        void uploadAndPublish(clientId, files, target.content)
        return
      }

      setPendingStatus(
        clientId,
        sendMessage({ content: target.content }) ? 'pending' : 'failed'
      )
    },
    [pendingMessages, sendMessage, setPendingStatus, uploadAndPublish]
  )

  return {
    room: roomContext,
    timeline,
    messages,
    isLoading: messagesQuery.isLoading,
    isError: messagesQuery.isError,
    isEmpty: messages.length === 0,
    refetch: messagesQuery.refetch,
    hasOlderMessages: messagesQuery.hasOlderMessages,
    isFetchingOlderMessages: messagesQuery.isFetchingOlderMessages,
    fetchOlderMessages: messagesQuery.fetchOlderMessages,
    draft,
    setDraft,
    handleSend,
    sendImages,
    isSendingImages,
    retryFailedMessage,
    connectionState,
    isConnected,
    isAttachmentOpen,
    toggleAttachment,
  }
}
