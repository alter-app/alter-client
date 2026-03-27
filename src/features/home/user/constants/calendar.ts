export const WEEKDAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
] as const

export const DATE_KEY_FORMAT = 'yyyy-MM-dd'
export const MONTH_LABEL_FORMAT = 'yyyy년 M월'

export const DAILY_TIMELINE_HEIGHT = 322
export const DAILY_TIMELINE_START_HOUR = 1
export const DAILY_TIMELINE_END_HOUR = 8

export const DAILY_STATUS_STYLE_MAP: Record<string, string> = {
  PLANNED: 'bg-main-300/70',
  CONFIRMED: 'bg-main/70',
  CANCELLED: 'bg-bg-dark',
  DELETED: 'bg-bg-dark/80',
}
