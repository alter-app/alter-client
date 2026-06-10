import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'
import type { WorkerRole } from '@/shared/types/workerRole'

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

/** API enum 래퍼 — `{ value, description }` */
export interface SubstituteEnumValueDto<T extends string = string> {
  value: T
  description: string
}

export interface SubstituteTargetWorkerDto {
  workerId: number
  workerName: string
  profileImageUrl?: string | null
}

/** GET sent/{requestId} — targets[] 항목 */
export interface SubstituteTargetItemApiDto {
  target: SubstituteTargetWorkerDto
  status: SubstituteEnumValueDto | string
  rejectionReason?: string | null
  respondedAt?: string | null
}

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
  profileImageUrl?: string | null
}

export interface SubstituteAcceptedWorkerDto {
  workerId: number
  workerName: string
  profileImageUrl?: string | null
}

/** 어댑터용 정규화된 대상 */
export interface SubstituteTargetDto {
  targetId: number
  workerName: string
  targetName?: string
  profileImageUrl?: string | null
  status: string
  rejectionReason?: string | null
  respondedAt?: string | null
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
  requestType:
    | SubstituteRequestType
    | SubstituteEnumValueDto<SubstituteRequestType>
  status:
    | SubstituteRequestStatus
    | SubstituteEnumValueDto<SubstituteRequestStatus>
    | string
  createdAt: string
  targets?: SubstituteTargetDto[]
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
}

/** GET /app/users/me/substitute-requests/sent/{requestId} — 원본 응답 */
export interface SentSubstituteRequestDetailApiDto {
  id: number
  schedule: SubstituteScheduleDto
  workspace: SubstituteWorkspaceDto
  requester: SubstituteRequesterDto
  requestType:
    | SubstituteEnumValueDto<SubstituteRequestType>
    | SubstituteRequestType
  targets: SubstituteTargetItemApiDto[]
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
  status:
    | SubstituteEnumValueDto<SubstituteRequestStatus>
    | SubstituteRequestStatus
    | string
  requestReason?: string | null
  createdAt: string
  acceptedAt?: string | null
  processedAt?: string | null
}

/** 상세 어댑터 입력 — enum·target 정규화 후 */
export interface SentSubstituteRequestDetailDto {
  id: number
  schedule: SubstituteScheduleDto
  workspace: SubstituteWorkspaceDto
  requester: SubstituteRequesterDto
  requestType: SubstituteRequestType
  targets: SubstituteTargetDto[]
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
  status: string
  requestReason?: string | null
  createdAt: string
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
  CommonApiResponse<SentSubstituteRequestDetailApiDto>

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
  imageUrl?: string | null
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
