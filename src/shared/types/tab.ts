export type TabKey =
  | 'home'
  | 'my'
  | 'search'
  | 'substitute'
  | 'applicant'
  | 'chat'

export const TAB_TITLE_MAP: Record<TabKey, string> = {
  home: '홈',
  my: 'MY',
  search: '알바 찾기',
  substitute: '대타',
  /** 사장님(MANAGER) 전용 탭 — 현재 Docbar에서는 채팅 탭으로 대체됨 */
  applicant: '지원자',
  chat: '채팅',
}
