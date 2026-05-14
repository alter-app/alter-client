/** 고정 스케줄 UI·API 매핑에서 공통으로 쓰는 한글 요일 순서 */
export const MANAGER_WEEKDAY_KO_ORDER = [
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
  '일',
] as const

export type ManagerWeekdayKo = (typeof MANAGER_WEEKDAY_KO_ORDER)[number]
