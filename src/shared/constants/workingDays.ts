/** 서버 요일 enum 순서 — 표시 정렬 기준으로도 사용합니다 */
export const WORKING_DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

export type WorkingDay = (typeof WORKING_DAYS)[number]

export const WORKING_DAY_LABEL: Record<WorkingDay, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}
