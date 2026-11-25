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
  if (typeof field === 'object' && 'value' in field) {
    const value = field.value
    if (typeof value !== 'string') return ''
    const trimmed = value.trim()
    return trimmed !== '' ? trimmed : ''
  }
  if (typeof field === 'string') {
    const trimmed = field.trim()
    return trimmed !== '' ? trimmed : ''
  }
  return ''
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
  return (status ?? '').toUpperCase()
}

export function mapApiStatusToUi(status: string): SubstituteUiStatus {
  const upper = normalizeSubstituteStatus(status)
  if (upper === 'ACCEPTED') {
    return 'accepted'
  }
  if (upper === 'APPROVED') {
    return 'approved'
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
  if (uiStatus === 'accepted') return '수락됨'
  if (uiStatus === 'approved') return '승인됨'
  if (uiStatus === 'rejected') return '거절함'
  if (uiStatus === 'cancelled') {
    if (upper === 'EXPIRED') return '만료됨'
    if (upper === 'REJECTED_BY_TARGET') return '거절됨'
    if (upper === 'REJECTED_BY_APPROVER') return '거절됨'
    return '취소됨'
  }
  return '확인중'
}

interface SubstituteStatusView {
  uiStatus: SubstituteUiStatus
  statusLabel: string
}

function resolveStatusView(rawStatus: string): SubstituteStatusView {
  const uiStatus = mapApiStatusToUi(rawStatus)
  return { uiStatus, statusLabel: statusLabelForApi(rawStatus, uiStatus) }
}

/**
 * 받은 요청의 표시 상태를 본인 대상자 상태(`myTargetStatus`) 우선으로 정한다.
 * 본인 거절은 전체 status와 무관하게 거절함, 다른 사람이 먼저 수락한 요청은 서버 description을 수락됨에 쓰고,
 * 그 밖의 값이거나 `myTargetStatus`가 없으면 전체 status로 폴백한다.
 */
function resolveReceivedStatusView(
  dto: Pick<ReceivedSubstituteRequestDto, 'status' | 'myTargetStatus'>
): SubstituteStatusView {
  const myTargetStatus = normalizeSubstituteStatus(
    unwrapSubstituteEnum(dto.myTargetStatus)
  )
  if (myTargetStatus === 'REJECTED') {
    return {
      uiStatus: 'rejected',
      statusLabel: statusLabelForApi(myTargetStatus, 'rejected'),
    }
  }
  if (myTargetStatus === 'ACCEPTED_BY_OTHERS') {
    const description = dto.myTargetStatus?.description
    if (typeof description === 'string' && description.trim() !== '') {
      return { uiStatus: 'accepted', statusLabel: description.trim() }
    }
  }
  return resolveStatusView(unwrapSubstituteEnum(dto.status))
}

/** 받은 요청은 전체 status가 PENDING이고 본인도 아직 응답하지 않았을(uiStatus `pending`) 때만 수락·거절할 수 있다. */
function canRespondToReceived(
  rawStatus: string,
  uiStatus: SubstituteUiStatus
): boolean {
  return (
    normalizeSubstituteStatus(rawStatus) === 'PENDING' && uiStatus === 'pending'
  )
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

function formatScheduleDateTitle(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'M월 d일', { locale: ko })
}

function formatScheduleTimeRangeLabel(
  startIso: string,
  endIso: string
): string {
  const formatPart = (iso: string) => {
    const date = parseISO(iso)
    if (Number.isNaN(date.getTime())) return '--:--'
    const hour = date.getHours()
    const period = hour < 12 ? '오전' : '오후'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    const minute = format(date, 'mm')
    return `${period} ${hour12}:${minute}`
  }
  return `${formatPart(startIso)} ~ ${formatPart(endIso)}`
}

function formatCreatedAtLabel(iso: string): string {
  const diffMs = Date.now() - parseISO(iso).getTime()
  if (Number.isNaN(diffMs)) return '-'
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  return `${days}일 전`
}

function schedulePositionLabel(position?: string): string {
  const label = position?.trim()
  return label != null && label !== '' ? label : '알바'
}

function buildListItemBase(
  dto: {
    schedule: { startDateTime: string; endDateTime: string; position: string }
    workspace: { workspaceName: string }
    createdAt: string
  },
  fields: Omit<
    UserSubstituteListItem,
    | 'scheduleDateTitle'
    | 'scheduleTimeRangeLabel'
    | 'positionLabel'
    | 'createdAtLabel'
    | 'scheduledDateLabel'
    | 'storeName'
  >
): UserSubstituteListItem {
  return {
    ...fields,
    storeName: dto.workspace.workspaceName?.trim() ?? '매장',
    scheduledDateLabel: formatScheduledDate(dto.schedule.startDateTime),
    scheduleDateTitle: formatScheduleDateTitle(dto.schedule.startDateTime),
    scheduleTimeRangeLabel: formatScheduleTimeRangeLabel(
      dto.schedule.startDateTime,
      dto.schedule.endDateTime
    ),
    positionLabel: schedulePositionLabel(dto.schedule.position),
    createdAtLabel: formatCreatedAtLabel(dto.createdAt),
  }
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
  const { uiStatus, statusLabel } = resolveReceivedStatusView(dto)

  return buildListItemBase(dto, {
    id: dto.id,
    displayName: `${storeName} / ${personName}`,
    role: positionToRole(dto.schedule.position),
    uiStatus,
    statusLabel,
    canRespond: canRespondToReceived(rawStatus, uiStatus),
    imageUrl: dto.requester.profileImageUrl ?? null,
    rawStatus,
    dto,
  })
}

function adaptSentListItem(
  dto: SentSubstituteRequestListItemDto
): UserSubstituteListItem {
  const storeName = dto.workspace.workspaceName?.trim() ?? '매장'
  const requestType = resolveSentRequestType(dto)
  const rawStatus = unwrapSubstituteEnum(dto.status)
  const uiStatus = mapApiStatusToUi(rawStatus)
  const personName = resolveSentPersonName(dto)

  return buildListItemBase(dto, {
    id: dto.id,
    displayName:
      requestType === 'ALL'
        ? `${storeName} · ${personName}`
        : `${storeName} / ${personName}`,
    role: positionToRole(dto.schedule.position),
    uiStatus,
    statusLabel: statusLabelForApi(rawStatus, uiStatus),
    canRespond: false,
    imageUrl: resolveSentPersonImage(dto) ?? null,
    rawStatus,
    dto,
  })
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
  direction: SubstituteRequestDirection,
  statusView: SubstituteStatusView
): UserSubstituteDetailViewModel {
  const storeName = dto.workspace.workspaceName?.trim() ?? '매장'
  const rawStatus = unwrapSubstituteEnum(dto.status)
  const { uiStatus, statusLabel } = statusView
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
    statusLabel,
    canRespond:
      direction === 'RECEIVED' && canRespondToReceived(rawStatus, uiStatus),
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
      'RECEIVED',
      resolveReceivedStatusView(dto)
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
    ...detailFromSchedulePerson(
      dto,
      personName,
      personImage,
      'SENT',
      resolveStatusView(unwrapSubstituteEnum(dto.status))
    ),
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
