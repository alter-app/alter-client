import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

import type { WorkerRole } from '@/shared/types/workerRole'

import type {
  ReceivedSubstituteRequestDto,
  SentSubstituteRequestDetailApiDto,
  SentSubstituteRequestDetailDto,
  SentSubstituteRequestListItemDto,
  SubstituteEnumValueDto,
  SubstituteRequestDirection,
  SubstituteRequestType,
  SubstituteTargetDto,
  SubstituteUiStatus,
  UserSubstituteDetailViewModel,
  UserSubstituteListDto,
  UserSubstituteListItem,
} from '@/features/user/substitute/types'

export function unwrapSubstituteEnum<T extends string>(
  field: SubstituteEnumValueDto<T> | T | string | null | undefined
): string {
  if (field == null) return ''
  if (typeof field === 'object' && 'value' in field) return field.value
  return String(field)
}

/** GET sent/{requestId} 응답 → 어댑터용 DTO */
export function normalizeSentSubstituteDetailDto(
  api: SentSubstituteRequestDetailApiDto
): SentSubstituteRequestDetailDto {
  return {
    id: api.id,
    schedule: api.schedule,
    workspace: api.workspace,
    requester: api.requester,
    requestType: unwrapSubstituteEnum(api.requestType) as SubstituteRequestType,
    targets: (api.targets ?? []).map(item => ({
      targetId: item.target.workerId,
      workerName: item.target.workerName,
      targetName: item.target.workerName,
      profileImageUrl: item.target.profileImageUrl ?? null,
      status: unwrapSubstituteEnum(item.status),
      rejectionReason: item.rejectionReason,
      respondedAt: item.respondedAt,
    })),
    acceptedWorker: api.acceptedWorker ?? null,
    status: unwrapSubstituteEnum(api.status),
    requestReason: api.requestReason,
    createdAt: api.createdAt,
    acceptedAt: api.acceptedAt,
    processedAt: api.processedAt,
  }
}

export function normalizeSubstituteStatus(status: string): string {
  return status.toUpperCase()
}

export function mapApiStatusToUi(status: string): SubstituteUiStatus {
  const upper = normalizeSubstituteStatus(status)
  if (upper === 'APPROVED' || upper === 'ACCEPTED') {
    return 'accepted'
  }
  if (
    upper === 'CANCELLED' ||
    upper === 'REJECTED_BY_TARGET' ||
    upper === 'REJECTED_BY_APPROVER' ||
    upper === 'EXPIRED'
  ) {
    return 'cancelled'
  }
  return 'pending'
}

export function statusLabelForApi(
  apiStatus: string,
  uiStatus: SubstituteUiStatus
): string {
  const upper = normalizeSubstituteStatus(apiStatus)
  if (uiStatus === 'accepted') {
    if (upper === 'ACCEPTED') return '수락됨'
    if (upper === 'APPROVED') return '수락됨'
    return '수락됨'
  }
  if (uiStatus === 'cancelled') {
    if (upper === 'EXPIRED') return '만료됨'
    if (upper === 'CANCELLED') return '취소됨'
    if (upper === 'REJECTED_BY_TARGET') return '거절됨'
    if (upper === 'REJECTED_BY_APPROVER') return '거절됨'
    return '취소됨'
  }
  return '확인중'
}

function positionToRole(position?: string): WorkerRole {
  const p = position?.toLowerCase() ?? ''
  if (p.includes('manager') || p.includes('매니저')) return 'manager'
  if (p.includes('owner') || p.includes('사장')) return 'owner'
  return 'staff'
}

function formatScheduledDate(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'yyyy. M. d.')
}

function formatDetailDateTitle(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'M월 d일 EEEE', { locale: ko })
}

function formatTime(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return '00'
  return format(date, 'HH')
}

export function formatDetailMinutes(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return '00'
  return format(date, 'mm')
}

function totalHoursLabel(startIso: string, endIso: string): string {
  const start = parseISO(startIso)
  const end = parseISO(endIso)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '총 00시간'
  }
  const hours = Math.max(
    0,
    (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  )
  const rounded = Math.round(hours * 10) / 10
  const display = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1)
  return `총 ${display}시간`
}

function resolveTargetWorkerName(
  target?: SubstituteTargetDto | null
): string | null {
  if (target == null) return null
  const name = target.workerName?.trim() || target.targetName?.trim()
  return name != null && name !== '' ? name : null
}

function resolveSentPersonName(dto: {
  requestType:
    | SubstituteRequestType
    | SubstituteEnumValueDto<SubstituteRequestType>
  targets?: SubstituteTargetDto[]
  acceptedWorker?: { workerName?: string } | null
}): string {
  const requestType = unwrapSubstituteEnum(
    dto.requestType
  ) as SubstituteRequestType
  const accepted = dto.acceptedWorker?.workerName?.trim()
  if (accepted) return accepted
  const targetName = resolveTargetWorkerName(dto.targets?.[0])
  if (targetName) return targetName
  return requestType === 'ALL' ? '전체 공개' : '대상'
}

/** resolveSentPersonName과 동일 우선순위(수락자 → 첫 대상자)로 이미지를 해석 */
function resolveSentPersonImage(dto: {
  targets?: SubstituteTargetDto[]
  acceptedWorker?: {
    workerName?: string
    profileImageUrl?: string | null
  } | null
}): string | null {
  const accepted = dto.acceptedWorker
  if (accepted) {
    return accepted.profileImageUrl ?? null
  }
  const firstTarget = dto.targets?.[0]
  if (resolveTargetWorkerName(firstTarget)) {
    return firstTarget?.profileImageUrl ?? null
  }
  return null
}

function resolveSentRequestType(
  dto: Pick<SentSubstituteRequestListItemDto, 'requestType'>
): SubstituteRequestType {
  return unwrapSubstituteEnum(dto.requestType) as SubstituteRequestType
}

function adaptReceivedListItem(
  dto: ReceivedSubstituteRequestDto
): UserSubstituteListItem {
  const storeName = dto.workspace.workspaceName?.trim() ?? '매장'
  const personName = dto.requester.workerName?.trim() ?? '이름'
  const rawStatus = unwrapSubstituteEnum(dto.status)
  const uiStatus = mapApiStatusToUi(rawStatus)

  return {
    id: dto.id,
    displayName: `${storeName} / ${personName}`,
    role: positionToRole(dto.schedule.position),
    scheduledDateLabel: formatScheduledDate(dto.schedule.startDateTime),
    uiStatus,
    statusLabel: statusLabelForApi(rawStatus, uiStatus),
    imageUrl: dto.requester.profileImageUrl ?? null,
    rawStatus,
    dto,
  }
}

function adaptSentListItem(
  dto: SentSubstituteRequestListItemDto
): UserSubstituteListItem {
  const storeName = dto.workspace.workspaceName?.trim() ?? '매장'
  const requestType = resolveSentRequestType(dto)
  const rawStatus = unwrapSubstituteEnum(dto.status)
  const uiStatus = mapApiStatusToUi(rawStatus)
  const personName = resolveSentPersonName(dto)

  return {
    id: dto.id,
    displayName:
      requestType === 'ALL'
        ? `${storeName} · ${personName}`
        : `${storeName} / ${personName}`,
    role: positionToRole(dto.schedule.position),
    scheduledDateLabel: formatScheduledDate(dto.schedule.startDateTime),
    uiStatus,
    statusLabel: statusLabelForApi(rawStatus, uiStatus),
    imageUrl: resolveSentPersonImage(dto) ?? null,
    rawStatus,
    dto,
  }
}

export function adaptUserSubstituteListItem(
  dto: UserSubstituteListDto,
  direction: SubstituteRequestDirection
): UserSubstituteListItem {
  if (direction === 'RECEIVED') {
    return adaptReceivedListItem(dto as ReceivedSubstituteRequestDto)
  }
  return adaptSentListItem(dto as SentSubstituteRequestListItemDto)
}

function detailFromSchedulePerson(
  dto: {
    schedule: { startDateTime: string; endDateTime: string; position: string }
    workspace: { workspaceName: string }
    status: SubstituteEnumValueDto | string
    requestReason?: string | null
  },
  personName: string,
  personImage: string | null,
  direction: SubstituteRequestDirection
): UserSubstituteDetailViewModel {
  const storeName = dto.workspace.workspaceName?.trim() ?? '매장'
  const rawStatus = unwrapSubstituteEnum(dto.status)
  const uiStatus = mapApiStatusToUi(rawStatus)
  const upper = normalizeSubstituteStatus(rawStatus)

  return {
    id: 0,
    displayName: `${storeName} / ${personName}`,
    role: positionToRole(dto.schedule.position),
    imageUrl: personImage,
    dateTitle: formatDetailDateTitle(dto.schedule.startDateTime),
    totalHoursLabel: totalHoursLabel(
      dto.schedule.startDateTime,
      dto.schedule.endDateTime
    ),
    startTimeLabel: formatTime(dto.schedule.startDateTime),
    endTimeLabel: formatTime(dto.schedule.endDateTime),
    reason:
      dto.requestReason?.trim() || '대타요청 사유가 작성 되어있는 곳입니다.',
    uiStatus,
    canRespond: direction === 'RECEIVED' && upper === 'PENDING',
    canCancel:
      direction === 'SENT' && (upper === 'PENDING' || upper === 'ACCEPTED'),
    rawStatus,
  }
}

export function adaptReceivedSubstituteDetail(
  dto: ReceivedSubstituteRequestDto
): UserSubstituteDetailViewModel {
  return {
    ...detailFromSchedulePerson(
      dto,
      dto.requester.workerName?.trim() ?? '이름',
      dto.requester.profileImageUrl ?? null,
      'RECEIVED'
    ),
    id: dto.id,
  }
}

export function adaptSentSubstituteDetail(
  dto: SentSubstituteRequestDetailDto
): UserSubstituteDetailViewModel {
  const personName = resolveSentPersonName(dto)
  const personImage = resolveSentPersonImage(dto)

  return {
    ...detailFromSchedulePerson(dto, personName, personImage, 'SENT'),
    id: dto.id,
  }
}

/** @deprecated use adaptReceivedSubstituteDetail or adaptSentSubstituteDetail */
export function adaptUserSubstituteDetail(
  dto: ReceivedSubstituteRequestDto | SentSubstituteRequestDetailDto,
  direction: SubstituteRequestDirection
): UserSubstituteDetailViewModel {
  if (direction === 'SENT') {
    return adaptSentSubstituteDetail(dto as SentSubstituteRequestDetailDto)
  }
  return adaptReceivedSubstituteDetail(dto as ReceivedSubstituteRequestDto)
}
