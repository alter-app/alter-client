import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'
import type { WorkerRole } from '@/shared/ui/home/WorkerRoleBadge'

export type SubstituteRequestDirection = 'SENT' | 'RECEIVED'

/** API 상태값 */
export type SubstituteRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'APPROVED'
  | 'REJECTED_BY_TARGET'
  | 'REJECTED_BY_APPROVER'
  | 'CANCELLED'
  | 'EXPIRED'

export type SubstituteRequestType = 'ALL' | 'SPECIFIC'

export type SubstituteUiStatus = 'pending' | 'accepted' | 'cancelled'

export interface SubstituteScheduleDto {
  scheduleId: number
  startDateTime: string
  endDateTime: string
  position: string
}

export interface SubstituteWorkspaceDto {
  workspaceId: number
  workspaceName: string
}

export interface SubstituteRequesterDto {
  workerId: number
  workerName: string
}

export interface SubstituteAcceptedWorkerDto {
  workerId: number
  workerName: string
}

export interface SubstituteTargetDto {
  targetId: number
  targetName: string
  status: string
}

export interface ReceivedSubstituteRequestDto {
  id: number
  schedule: SubstituteScheduleDto
  workspace: SubstituteWorkspaceDto
  requester: SubstituteRequesterDto
  requestType: SubstituteRequestType
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
  status: SubstituteRequestStatus | string
  requestReason?: string | null
  createdAt: string
  acceptedAt?: string | null
  processedAt?: string | null
}

export interface SentSubstituteRequestListItemDto {
  id: number
  schedule: SubstituteScheduleDto
  workspace: SubstituteWorkspaceDto
  requestType: SubstituteRequestType
  status: SubstituteRequestStatus | string
  createdAt: string
}

export interface SentSubstituteRequestDetailDto extends SentSubstituteRequestListItemDto {
  requester: SubstituteRequesterDto
  targets: SubstituteTargetDto[]
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
  requestReason?: string | null
  acceptedAt?: string | null
  processedAt?: string | null
}

export interface CursorPageDto {
  cursor: string | null
  pageSize?: number
  totalCount?: number
}

export interface CursorPaginatedPayload<T> {
  page: CursorPageDto
  data: T[]
}

export type ReceivedSubstituteListApiResponse = CommonApiResponse<
  CursorPaginatedPayload<ReceivedSubstituteRequestDto>
>

export type SentSubstituteListApiResponse = CommonApiResponse<
  CursorPaginatedPayload<SentSubstituteRequestListItemDto>
>

export type SentSubstituteDetailApiResponse =
  CommonApiResponse<SentSubstituteRequestDetailDto>

export interface SubstituteListQueryParams {
  status?: string
  cursor?: string
  pageSize?: number
  workspaceId?: number
}

export interface RejectSubstituteRequestBody {
  targetRejectionReason: string
}

export type UserSubstituteListDto =
  | ReceivedSubstituteRequestDto
  | SentSubstituteRequestListItemDto

export interface UserSubstituteListItem {
  id: number
  displayName: string
  role: WorkerRole
  scheduledDateLabel: string
  uiStatus: SubstituteUiStatus
  statusLabel: string
  imageUrl?: string | null
  rawStatus: string
  dto: UserSubstituteListDto
}

export interface UserSubstituteDetailViewModel {
  id: number
  displayName: string
  role: WorkerRole
  dateTitle: string
  totalHoursLabel: string
  startTimeLabel: string
  endTimeLabel: string
  reason: string
  uiStatus: SubstituteUiStatus
  canRespond: boolean
  canCancel: boolean
  rawStatus: string
}

/** 교환 가능 스케줄 — MyScheduleResponseDto (스케줄 항목) */
export interface MyScheduleItemDto {
  shiftId: number
  workspace: { workspaceId: number; workspaceName: string }
  startDateTime: string
  endDateTime: string
  position: string
  status: StatusEnum
}

export type ExchangeableSchedulesApiResponse = CommonApiResponse<
  MyScheduleItemDto[] | { schedules: MyScheduleItemDto[] }
>
