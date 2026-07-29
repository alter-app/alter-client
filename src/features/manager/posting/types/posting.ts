import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'
import type { PaymentType } from '@/shared/constants/payment'
import type { WorkingDay } from '@/shared/constants/workingDays'
import { WORKING_DAYS, WORKING_DAY_LABEL } from '@/shared/constants/workingDays'

export type { PaymentType, WorkingDay }
export { PAYMENT_TYPES, PAYMENT_TYPE_LABEL } from '@/shared/constants/payment'
export { WORKING_DAYS, WORKING_DAY_LABEL }

export type PostingStatus = 'OPEN' | 'CLOSED' | 'CANCELLED' | 'DELETED'

export type ApplicationStatus = ApplicationApiStatus

export interface PostingSchedule {
  // 신규 추가분은 null
  id: number | null
  workingDays: WorkingDay[]
  startTime: string
  endTime: string
  position: string
  positionsNeeded: number
}

export interface PostingListItem {
  id: number
  workspaceId: number
  workspaceName: string
  businessType: string
  title: string
  paymentType: PaymentType
  payAmount: number
  schedules: PostingSchedule[]
  createdAt: string
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

export type ApplicationSchedule = Pick<
  PostingSchedule,
  'workingDays' | 'startTime' | 'endTime' | 'position'
>

export interface ApplicationListItem {
  id: number
  workspaceId: number
  workspaceName: string
  status: ApplicationStatus
  appliedAt: string
  applicantName: string
  schedule: ApplicationSchedule
}

export interface Application {
  id: number
  workspaceId: number
  workspaceName: string
  status: ApplicationStatus
  appliedAt: string
  applicant: Applicant
  schedule: ApplicationSchedule
  description: string
}

export interface PostingFormSchedule extends PostingSchedule {
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

export interface PostingFormErrors {
  workspaceId?: string
  title?: string
  schedules?: string
  payAmount?: string
  description?: string
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

export { formatRelativeTime } from '@/shared/lib/formatRelativeTime'
