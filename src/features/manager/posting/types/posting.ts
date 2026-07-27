/**
 * 사장님 구인구직 — 매니저 측 공고/지원자 UI 모델
 *
 * 서버 DTO(`@/features/manager/home/types/posting`)와 지원 상태 enum
 * (`@/shared/types/applicationStatus`)을 계승합니다.
 * API 미연동 단계이므로 화면이 소비하는 UI 모델을 이 파일에서 정의합니다.
 */
import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'
import type { PaymentType } from '@/shared/constants/payment'
import type { WorkingDay } from '@/shared/constants/workingDays'
import { WORKING_DAYS, WORKING_DAY_LABEL } from '@/shared/constants/workingDays'

// ---- 요일·급여 (shared 재노출 — 슬라이스 내 호출부 경로 유지) ----
export type { PaymentType, WorkingDay }
export { PAYMENT_TYPES, PAYMENT_TYPE_LABEL } from '@/shared/constants/payment'
export { WORKING_DAYS, WORKING_DAY_LABEL }

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
  schedules: PostingFormSchedule[]
  paymentType: PaymentType
  payAmount: string
  description: string
}

/** 필드별 검증 에러 — 값이 있으면 해당 필드에 에러 표시 */
export interface PostingFormErrors {
  workspaceId?: string
  title?: string
  schedules?: string
  payAmount?: string
}

// ---- 포맷터 ----
export function formatWorkingDays(days: WorkingDay[]): string {
  if (days.length === 0) return '-'
  return WORKING_DAYS.filter(day => days.includes(day))
    .map(day => WORKING_DAY_LABEL[day])
    .join('·')
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}~${endTime}`
}

export { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
