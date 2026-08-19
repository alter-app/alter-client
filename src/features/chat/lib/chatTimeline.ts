import type {
  ChatMessage,
  ChatSegment,
  ChatTimelineEntry,
} from '@/features/chat/types/chat'
import { formatDateDivider, isSameDay } from '@/features/chat/lib/chatTime'

/**
 * 메시지 배열(오래된 → 최신)을 날짜 구분선이 섞인 렌더 목록으로 변환합니다.
 * 전체 채팅에서는 발신자가 바뀌는 첫 메시지에만 이름·아바타를 노출합니다.
 */
export function buildChatTimeline(
  messages: ChatMessage[],
  segment: ChatSegment,
  now: Date = new Date()
): ChatTimelineEntry[] {
  const entries: ChatTimelineEntry[] = []

  messages.forEach((message, index) => {
    const previous = index > 0 ? messages[index - 1] : undefined

    if (!previous || !isSameDay(previous.createdAt, message.createdAt)) {
      entries.push({
        kind: 'date',
        key: `date-${message.createdAt}-${message.id}`,
        label: formatDateDivider(message.createdAt, now),
      })
    }

    const isNewSenderBlock =
      !previous ||
      previous.senderId !== message.senderId ||
      previous.senderScope !== message.senderScope ||
      !isSameDay(previous.createdAt, message.createdAt)

    entries.push({
      kind: 'message',
      key: message.clientId ?? `message-${message.id}`,
      message,
      showSenderMeta:
        segment === 'group' && !message.isMine && isNewSenderBlock,
    })
  })

  return entries
}

/**
 * 낙관적 메시지와 서버 메시지를 합칩니다.
 * 서버 echo 가 도착하면 같은 내용의 pending 메시지를 제거해 중복을 막습니다.
 */
export function mergeChatMessages(
  serverMessages: ChatMessage[],
  pendingMessages: ChatMessage[]
): ChatMessage[] {
  if (pendingMessages.length === 0) return serverMessages

  const serverSignatures = new Set(
    serverMessages
      .filter(message => message.isMine)
      .map(message => message.content)
  )

  const remainingPending = pendingMessages.filter(
    pending =>
      pending.status === 'failed' || !serverSignatures.has(pending.content)
  )

  return [...serverMessages, ...remainingPending]
}

/** 오래된 → 최신 정렬. 동일 시각이면 id 오름차순 */
export function sortMessagesAscending(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort((a, b) => {
    const diff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return diff !== 0 ? diff : a.id - b.id
  })
}
