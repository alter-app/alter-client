import { CHAT_MESSAGE_MAX_LENGTH } from '@/features/chat/types/chat'

/** 상한을 넘긴 입력은 잘라내 붙여넣기로도 1000자를 넘지 않게 합니다 */
export function clampMessageDraft(value: string): string {
  return value.length > CHAT_MESSAGE_MAX_LENGTH
    ? value.slice(0, CHAT_MESSAGE_MAX_LENGTH)
    : value
}

/** 공백만 입력한 경우 전송 비활성 */
export function canSendMessage(draft: string): boolean {
  const trimmed = draft.trim()
  return trimmed.length > 0 && trimmed.length <= CHAT_MESSAGE_MAX_LENGTH
}

export function isMessageDraftAtLimit(draft: string): boolean {
  return draft.length >= CHAT_MESSAGE_MAX_LENGTH
}
