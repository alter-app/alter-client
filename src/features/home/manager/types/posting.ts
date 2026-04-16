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
const PAYMENT_TYPE_LABEL: Record<string, string> = {
  HOURLY: '시급',
  DAILY: '일급',
  MONTHLY: '월급',
  WEEKLY: '주급',
}

const WORKING_DAY_KO: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

function formatWage(payAmount: number, paymentType: string): string {
  const label = PAYMENT_TYPE_LABEL[paymentType] ?? '시급'
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
  const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const daySet = new Set(schedules.flatMap(s => s.workingDays))
  return DAY_ORDER.filter(d => daySet.has(d))
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
