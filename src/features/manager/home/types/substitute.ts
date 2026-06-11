import type { CommonApiResponse } from '@/shared/types/common'
import type { SubstituteRequestItem } from '@/shared/types/substituteRequest'
import type { WorkerRole } from '@/shared/types/workerRole'
import { SubstituteApiStatus } from '@/shared/types/substituteStatus'

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
  profileImageUrl?: string | null
}

export interface SubstituteStatusDto {
  value: SubstituteApiStatus
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
  apiStatus: SubstituteApiStatus
): SubstituteRequestItem['status'] {
  if (apiStatus === SubstituteApiStatus.APPROVED) return 'accepted'
  if (apiStatus === SubstituteApiStatus.REJECTED_BY_APPROVER) return 'cancelled'
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
    id: dto.id,
    name: dto.requester.workerName,
    role: dto.schedule.position,
    workerRole: mapApiWorkerRole(dto.requester.workerRole),
    imageUrl: dto.requester.profileImageUrl ?? null,
    dateRange: formatDateRange(
      dto.schedule.startDateTime,
      dto.schedule.endDateTime
    ),
    scheduledDate: formatDate(dto.schedule.startDateTime),
    status: mapApiStatusToUiStatus(dto.status.value),
    rawStatus: dto.status.value,
  }
}
