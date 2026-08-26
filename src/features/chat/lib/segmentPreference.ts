import type { ChatSegment } from '@/features/chat/types/chat'

const STORAGE_KEY = 'alter:chat:last-segment'

/** 채팅 탭 진입 시 개인 채팅이 기본이고, 마지막 선택 세그먼트를 기억합니다 */
export function readLastChatSegment(): ChatSegment {
  if (typeof window === 'undefined') return 'personal'
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'group'
      ? 'group'
      : 'personal'
  } catch {
    return 'personal'
  }
}

export function writeLastChatSegment(segment: ChatSegment): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, segment)
  } catch {
    // 저장 실패는 기본값(개인)으로 동작하면 되므로 무시합니다
  }
}
