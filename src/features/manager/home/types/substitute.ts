import type { CommonApiResponse } from '@/shared/types/common'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'

// ---- API DTOs ----
export interface SubstituteScheduleDto {
  scheduleId: number
  startDateTime: string
  endDateTime: string
  position: string
}

export interface SubstituteRequesterDto {
  workerId: number
  workerName: string
}

export interface SubstituteStatusDto {
  value: string
  description: string
}

export interface SubstituteRequestTypeDto {
  value: string
  description: string
}

export interface SubstituteRequestDto {
  id: number
  schedule: SubstituteScheduleDto
  requester: SubstituteRequesterDto
  requestType: SubstituteRequestTypeDto
  status: SubstituteStatusDto
  createdAt: string
}

export interface SubstitutePageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type SubstituteListApiResponse = CommonApiResponse<{
  page: SubstitutePageDto
  data: SubstituteRequestDto[]
}>

// ---- Query Params ----
export interface SubstituteRequestsQueryParams {
  workspaceId?: number
  status?: string
  cursor?: string
  pageSize: number
}

// ---- Mappers ----
function mapApiStatusToUiStatus(
  apiStatus: string
): SubstituteRequestItem['status'] {
  if (apiStatus === 'ACCEPTED' || apiStatus === 'APPROVED') return 'accepted'
  return 'pending'
}

function formatDateRange(startDateTime: string, endDateTime: string): string {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)
  const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`
  return `${fmt(start)} ↔ ${fmt(end)}`
}

export function adaptSubstituteRequestDto(
  dto: SubstituteRequestDto
): SubstituteRequestItem {
  return {
    id: String(dto.id),
    name: dto.requester.workerName,
    role: dto.schedule.position,
    dateRange: formatDateRange(
      dto.schedule.startDateTime,
      dto.schedule.endDateTime
    ),
    status: mapApiStatusToUiStatus(dto.status.value),
  }
}
