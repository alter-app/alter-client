export type ApplicationStatus =
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'cancelled'

export type FilterType = 'all' | ApplicationStatus

export const WEEKDAY_LABELS = [
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
  '일',
] as const

export type WeekdayLabel = (typeof WEEKDAY_LABELS)[number]

/** 지원서에 기재된 내용 (조회 전용) */
export interface AppliedApplicationDetail {
  selectedWeekdays: WeekdayLabel[]
  timeRangeLabel: string
  selfIntroduction: string
}

export interface AppliedStoreData {
  id: number
  storeName: string
  status: ApplicationStatus
  thumbnailUrl?: string
  applicationDetail?: AppliedApplicationDetail
}
