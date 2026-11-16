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

/** 받은 요청에서 조회자 본인의 대상자 상태(`myTargetStatus`) API 값 */
export type SubstituteRequestTargetStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'ACCEPTED_BY_OTHERS'
  | 'APPROVED'
  | 'CANCELLED'
  | 'REJECTED_BY_APPROVER'
  | 'EXPIRED'

/**
 * 알바생 화면의 대타 진행 단계.
 * `accepted`는 대상 알바생이 수락해 사장님 승인을 기다리는 상태(API `ACCEPTED`),
 * `approved`는 사장님 승인까지 끝난 상태(API `APPROVED`)다.
 * `rejected`는 받은 요청에서 본인이 거절한 상태로, 전체 status가 아니라 `myTargetStatus`로만 정해진다.
 */
export type SubstituteUiStatus =
  | 'pending'
  | 'accepted'
  | 'approved'
  | 'rejected'
  | 'cancelled'

/**
 * 매니저 화면은 `ACCEPTED`를 승인 대기(요청됨)로 분류하므로 매니저 필터 타입과 합치지 않는다.
 * `rejected`는 서버 status 필터로 조회할 수 없어 필터에서 제외한다.
 */
export type UserSubstituteListStatusFilter =
  | 'all'
  | Exclude<SubstituteUiStatus, 'rejected'>

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
  requestType:
    | SubstituteRequestType
    | SubstituteEnumValueDto<SubstituteRequestType>
  acceptedWorker?: SubstituteAcceptedWorkerDto | null
  status:
    | SubstituteRequestStatus
    | SubstituteEnumValueDto<SubstituteRequestStatus>
    | string
  /** 조회자 본인의 대상자 상태. 구버전 응답에는 없을 수 있어 전체 `status`로 폴백한다. */
  myTargetStatus?: SubstituteEnumValueDto<SubstituteRequestTargetStatus> | null
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
  status?: string | string[]
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
  storeName: string
  scheduleDateTitle: string
  scheduleTimeRangeLabel: string
  positionLabel: string
  createdAtLabel: string
  role: WorkerRole
  scheduledDateLabel: string
  uiStatus: SubstituteUiStatus
  statusLabel: string
  /** 받은 요청을 지금 수락·거절할 수 있는지. 보낸 요청은 항상 false다. */
  canRespond: boolean
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
  statusLabel: string
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
  MyScheduleItemDto[]
>
