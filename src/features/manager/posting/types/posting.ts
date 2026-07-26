/**
 * 사장님 구인구직 — 매니저 측 공고/지원자 UI 모델
 *
 * 서버 DTO(`@/features/manager/home/types/posting`)와 지원 상태 enum
 * (`@/features/user/home/applied-stores/types/application`)을 계승합니다.
 * API 미연동 단계이므로 화면이 소비하는 UI 모델을 이 파일에서 정의합니다.
 */
import type { ApplicationApiStatus } from '@/features/user/home/applied-stores/types/application'

// ---- 요일 ----
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

// ---- 급여 ----
export const PAYMENT_TYPES = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'] as const
export type PaymentType = (typeof PAYMENT_TYPES)[number]

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  HOURLY: '시급',
  DAILY: '일급',
  WEEKLY: '주급',
  MONTHLY: '월급',
}

// ---- 공고 상태 ----
/** OPEN=모집중, CLOSED=모집완료 */
export type PostingStatus = 'OPEN' | 'CLOSED'

// ---- 지원 상태 ----
/** 서버 enum을 그대로 사용 (SUBMITTED/SHORTLISTED/ACCEPTED/REJECTED/CANCELLED/EXPIRED/DELETED) */
export type ApplicationStatus = ApplicationApiStatus

// ---- UI 모델 ----
export interface PostingSchedule {
  /** 기존 일정은 서버 id, 신규 추가분은 null */
  id: number | null
  workingDays: WorkingDay[]
  startTime: string
  endTime: string
  position: string
  positionsNeeded: number
}

export interface Workspace {
  id: number
  businessName: string
  businessType: string
}

export interface Posting {
  id: number
  workspaceId: number
  workspaceName: string
  businessType: string
  title: string
  description: string
  keywords: string[]
  paymentType: PaymentType
  payAmount: number
  status: PostingStatus
  schedules: PostingSchedule[]
  applicantCount: number
  createdAt: string
}

export interface Certificate {
  name: string
  issuer: string
  acquiredAt: string
}

export interface Applicant {
  name: string
  phoneNumber: string
  birthDate: string
  gender: '남성' | '여성'
  email: string
  certificates: Certificate[]
}

export interface Application {
  id: number
  postingId: number
  workspaceId: number
  workspaceName: string
  status: ApplicationStatus
  /** 지원 시각 (ISO) — 목록에서 '2시간 전' 형태로 표시 */
  appliedAt: string
  applicant: Applicant
  /** 지원한 근무일정 */
  schedule: Pick<
    PostingSchedule,
    'workingDays' | 'startTime' | 'endTime' | 'position'
  >
  /** 지원 메시지 */
  description: string
}

// ---- 폼 모델 ----
export interface PostingFormSchedule extends PostingSchedule {
  /** 폼 내부에서 일정 카드를 구분하기 위한 로컬 키 */
  key: string
}

export interface PostingFormValues {
  workspaceId: number | null
  title: string
  keywords: string[]
  schedules: PostingFormSchedule[]
  paymentType: PaymentType
  payAmount: string
  description: string
}

/** 필드별 검증 에러 — 값이 있으면 해당 필드에 에러 표시 */
export interface PostingFormErrors {
  workspaceId?: string
  title?: string
  keywords?: string
  schedules?: string
  payAmount?: string
}

/** 공고당 선택 가능한 최대 키워드 수 */
export const MAX_KEYWORDS = 3

// ---- 포맷터 ----
export function formatPay(paymentType: PaymentType, payAmount: number): string {
  return `${PAYMENT_TYPE_LABEL[paymentType]} ${payAmount.toLocaleString('ko-KR')}원`
}

export function formatWorkingDays(days: WorkingDay[]): string {
  if (days.length === 0) return '-'
  return WORKING_DAYS.filter(day => days.includes(day))
    .map(day => WORKING_DAY_LABEL[day])
    .join('·')
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}~${endTime}`
}

/** 지원 시각을 '방금 전 / N시간 전 / 어제 / N일 전' 형태로 변환 */
export function formatRelativeTime(isoDate: string, now = new Date()): string {
  const target = new Date(isoDate)
  const diffMs = now.getTime() - target.getTime()
  if (Number.isNaN(diffMs)) return ''

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  if (diffMinutes < 1) return '방금 전'
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return '어제'
  return `${diffDays}일 전`
}
