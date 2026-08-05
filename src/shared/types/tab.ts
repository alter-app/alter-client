export type TabKey = 'home' | 'my' | 'search' | 'substitute' | 'applicant'

export const TAB_TITLE_MAP: Record<TabKey, string> = {
  home: '홈',
  my: 'MY',
  search: '알바 찾기',
  substitute: '대타',
  /** 사장님(MANAGER) 전용 탭 */
  applicant: '지원자',
}
