import { create } from 'zustand'

/**
 * Docbar 채팅 탭 뱃지용 미읽음 합계.
 * 채팅 목록 쿼리·STOMP 수신이 스코프별 합계를 기록하고, Docbar는 총합만 읽습니다.
 * (shared/ui 인 Docbar 가 features 를 직접 참조하지 않도록 스토어로 분리)
 */
export type ChatUnreadScope = 'personal' | 'group'

interface ChatUnreadState {
  countByScope: Record<ChatUnreadScope, number>
  setUnreadCount: (scope: ChatUnreadScope, count: number) => void
  reset: () => void
}

export const useChatUnreadStore = create<ChatUnreadState>(set => ({
  countByScope: { personal: 0, group: 0 },
  setUnreadCount: (scope, count) =>
    set(state =>
      state.countByScope[scope] === count
        ? state
        : {
            countByScope: {
              ...state.countByScope,
              [scope]: Math.max(0, count),
            },
          }
    ),
  reset: () => set({ countByScope: { personal: 0, group: 0 } }),
}))

export function selectTotalChatUnread(state: ChatUnreadState): number {
  return state.countByScope.personal + state.countByScope.group
}

export default useChatUnreadStore
