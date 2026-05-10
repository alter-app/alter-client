export const WEEKDAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
] as const

export const WEEKDAY_LABELS_MONDAY_FIRST = [
  ...WEEKDAY_LABELS.slice(1),
  WEEKDAY_LABELS[0],
] as const
