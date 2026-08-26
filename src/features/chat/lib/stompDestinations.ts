import { getAuthApiBasePath } from '@/shared/lib/authApiPath'
import type { ChatApiScope } from '@/features/chat/api/chatRoom'

/** 구독 — /sub/chat.{roomId} */
export function chatSubscribeDestination(roomId: number): string {
  return `/sub/chat.${roomId}`
}

/** 발행 — /pub/{app|manager}/send.{roomId} */
export function chatPublishDestination(
  scope: ChatApiScope,
  roomId: number
): string {
  return `/pub/${getAuthApiBasePath(scope)}/send.${roomId}`
}
