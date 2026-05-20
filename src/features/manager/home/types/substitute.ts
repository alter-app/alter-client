import type { CommonApiResponse } from '@/shared/types/common'
import type { SubstituteRequestItem } from '@/shared/ui/manager/SubstituteApprovalCard'
import type { WorkerRole } from '@/shared/types/workerRole'
import { ManagerSubstituteApiStatus } from '@/shared/types/substituteStatus'

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
  workerRole?: string
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
function mapApiWorkerRole(raw: string | undefined): WorkerRole {
  if (raw === 'MANAGER') return 'manager'
  if (raw === 'OWNER') return 'owner'
  return 'staff'
}

function mapApiStatusToUiStatus(
  apiStatus: string
): SubstituteRequestItem['status'] {
  if (apiStatus === ManagerSubstituteApiStatus.APPROVED) return 'accepted'
  return 'pending'
}

function formatDate(dateTime: string): string {
  const d = new Date(dateTime)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

function formatDateRange(startDateTime: string, endDateTime: string): string {
  return `${formatDate(startDateTime)} ↔ ${formatDate(endDateTime)}`
}

export function adaptSubstituteRequestDto(
  dto: SubstituteRequestDto
): SubstituteRequestItem {
  return {
    id: String(dto.id),
    name: dto.requester.workerName,
    role: dto.schedule.position,
    workerRole: mapApiWorkerRole(dto.requester.workerRole),
    dateRange: formatDateRange(
      dto.schedule.startDateTime,
      dto.schedule.endDateTime
    ),
    scheduledDate: formatDate(dto.schedule.startDateTime),
    status: mapApiStatusToUiStatus(dto.status.value),
    rawStatus: dto.status.value,
  }
}
