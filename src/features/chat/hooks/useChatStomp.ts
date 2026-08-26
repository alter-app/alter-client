import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { stompConnection } from '@/shared/lib/stompConnection'
import useAuthStore from '@/shared/stores/useAuthStore'
import {
  chatPublishDestination,
  chatSubscribeDestination,
} from '@/features/chat/lib/stompDestinations'
import type { ChatConnectionState } from '@/features/chat/types/chat'
import type {
  ChatMessageDto,
  SendChatMessagePayload,
} from '@/features/chat/types/dto'

/** 이미지 전용 메시지는 content 가 null·누락일 수 있어 id·senderId 로만 판별합니다 */
function parseChatMessage(body: string): ChatMessageDto | null {
  try {
    const parsed: unknown = JSON.parse(body)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'id' in parsed &&
      'senderId' in parsed
    ) {
      return parsed as ChatMessageDto
    }
    return null
  } catch {
    return null
  }
}

interface UseChatStompOptions {
  roomId: number
  enabled?: boolean
  onMessage: (message: ChatMessageDto) => void
}

/**
 * 채팅방 실시간 구독·발행.
 * 연결은 전역 매니저가 관리하고, 이 훅은 방 단위 구독과 상태만 다룹니다.
 */
export function useChatStomp({
  roomId,
  enabled = true,
  onMessage,
}: UseChatStompOptions) {
  const scope = useAuthStore(state => state.scope)
  const status = useSyncExternalStore(
    stompConnection.onStatusChange,
    stompConnection.getStatus
  )

  // 최신 핸들러를 참조해 구독을 매 렌더 재생성하지 않습니다
  const onMessageRef = useRef(onMessage)
  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    if (!enabled || !Number.isFinite(roomId)) return

    stompConnection.acquire()
    const unsubscribeRoom = stompConnection.subscribe(
      chatSubscribeDestination(roomId),
      body => {
        const message = parseChatMessage(body)
        if (message) onMessageRef.current(message)
      }
    )

    return () => {
      unsubscribeRoom()
      stompConnection.release()
    }
  }, [enabled, roomId])

  /** `content` 와 `fileIds` 가 둘 다 비면 서버가 거부하므로 호출부에서 걸러 보냅니다 */
  const sendMessage = useCallback(
    (message: { content?: string; fileIds?: string[] }) => {
      const payload: SendChatMessagePayload = {
        type: 'NORMAL',
        ...(message.content && { content: message.content }),
        ...(message.fileIds?.length && { fileIds: message.fileIds }),
      }
      return stompConnection.publish(
        chatPublishDestination(scope, roomId),
        payload
      )
    },
    [scope, roomId]
  )

  const connectionState: ChatConnectionState = status

  return { connectionState, isConnected: status === 'connected', sendMessage }
}
