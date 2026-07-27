import { PAYMENT_TYPE_LABEL as SHARED_PAYMENT_TYPE_LABEL } from '@/shared/constants/payment'
import { WORKING_DAYS, WORKING_DAY_LABEL } from '@/shared/constants/workingDays'
import type { CommonApiResponse } from '@/shared/types/common'
import type { JobPostingItem } from '@/shared/ui/manager/OngoingPostingCard'

// ---- API DTOs ----
export interface PostingKeywordDto {
  id: number
  name: string
}

export interface PostingScheduleDto {
  workingDays: string[]
  startTime: string
  endTime: string
  positionsNeeded: number
  position: number
}

export interface PostingWorkspaceDto {
  id: number
  businessName: string
}

export interface PostingDto {
  id: number
  title: string
  payAmount: number
  paymentType: string
  createdAt: string
  keywords: PostingKeywordDto[]
  schedules: PostingScheduleDto[]
  workspace: PostingWorkspaceDto
}

export interface PostingPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type PostingListApiResponse = CommonApiResponse<{
  page: PostingPageDto
  data: PostingDto[]
}>

// ---- Query Params ----
export interface ManagedPostingsQueryParams {
  workspaceId?: number
  status?: string
  cursor?: string
  pageSize: number
}

// ---- Mappers ----
// 서버 응답의 paymentType/workingDays는 string이므로 안전한 폴백을 위해 넓은 타입으로 참조
const PAYMENT_TYPE_LABEL: Record<string, string> = SHARED_PAYMENT_TYPE_LABEL

const WORKING_DAY_KO: Record<string, string> = WORKING_DAY_LABEL

function formatWage(payAmount: number, paymentType: string): string {
  const label = PAYMENT_TYPE_LABEL[paymentType] ?? paymentType
  const amount = payAmount.toLocaleString('ko-KR')
  return `${label} ${amount}원`
}

function formatWorkHours(schedules: PostingScheduleDto[]): string {
  if (schedules.length === 0) return '-'
  const first = schedules[0]
  const base = `${first.startTime} ~ ${first.endTime}`
  return schedules.length > 1 ? `${base} 외 ${schedules.length - 1}개` : base
}

function formatWorkDays(schedules: PostingScheduleDto[]): string {
  if (schedules.length === 0) return '-'
  // 모든 스케줄의 요일을 합산 후 중복 제거 + 요일 순서 정렬
  const daySet = new Set(schedules.flatMap(s => s.workingDays))
  return WORKING_DAYS.filter(d => daySet.has(d))
    .map(d => WORKING_DAY_KO[d] ?? d)
    .join(', ')
}

export function adaptPostingDto(dto: PostingDto): JobPostingItem {
  return {
    id: String(dto.id),
    dDay: '',
    title: dto.title,
    wage: formatWage(dto.payAmount, dto.paymentType),
    workHours: formatWorkHours(dto.schedules),
    workDays: formatWorkDays(dto.schedules),
  }
}
