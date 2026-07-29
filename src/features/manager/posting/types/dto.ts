import type { PaymentType } from '@/shared/constants/payment'
import type { WorkingDay } from '@/shared/constants/workingDays'
import { toTimeOfDay } from '@/shared/lib/toTimeOfDay'
import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'
import type {
  Applicant,
  Application,
  ApplicationListItem,
  Certificate,
  Posting,
  PostingListItem,
  PostingSchedule,
  PostingStatus,
} from '@/features/manager/posting/types/posting'

export interface DescribedEnumDto<T extends string> {
  value: T
  description: string
}

export interface PostingScheduleDto {
  id: number
  workingDays: WorkingDay[]
  startTime: string
  endTime: string
  positionsNeeded: number
  positionsAvailable: number
  position?: string
}

export interface ManagerPostingListWorkspaceDto {
  id: number
  businessName?: string
  businessType?: string
  businessTypeDetail?: string
}

export interface ManagerPostingListItemDto {
  id: number
  title: string
  payAmount: number
  paymentType: PaymentType
  createdAt: string
  schedules: PostingScheduleDto[]
  workspace: ManagerPostingListWorkspaceDto
}

export interface ManagerPostingDetailWorkspaceDto {
  id: number
  name?: string
  businessType?: string
  businessTypeDetail?: string
  fullAddress?: string
}

export interface ManagerPostingDetailDto {
  id: number
  workspace: ManagerPostingDetailWorkspaceDto
  title: string
  description?: string
  payAmount: number
  paymentType: PaymentType
  status: DescribedEnumDto<PostingStatus>
  createdAt: string
  updatedAt: string
  schedules: PostingScheduleDto[]
}

export interface PostingApplicationWorkspaceDto {
  id: number
  name?: string
}

export interface PostingApplicationScheduleDto {
  id: number
  workingDays: WorkingDay[]
  startTime: string
  endTime: string
  position?: string
}

export interface PostingApplicationListItemDto {
  id: number
  workspace: PostingApplicationWorkspaceDto
  schedule: PostingApplicationScheduleDto
  status: DescribedEnumDto<ApplicationApiStatus>
  applicant: { name?: string }
  createdAt: string
}

export interface PostingApplicantCertificateDto {
  id: number
  certificateName?: string
  publisherName?: string
  issuedAt?: string
  expiresAt?: string
}

export interface PostingApplicantDetailDto {
  id: number
  name?: string
  email?: string
  contact?: string
  birthday?: string
  gender?: 'GENDER_MALE' | 'GENDER_FEMALE'
  userCertificates?: PostingApplicantCertificateDto[]
}

export interface PostingApplicationDetailDto {
  id: number
  workspace: PostingApplicationWorkspaceDto
  schedule: PostingApplicationScheduleDto
  description?: string
  status: DescribedEnumDto<ApplicationApiStatus>
  applicant: PostingApplicantDetailDto
  createdAt: string
}

export interface CreatePostingScheduleRequestDto {
  workingDays: WorkingDay[]
  startTime: string
  endTime: string
  positionsNeeded: number
  position?: string
}

export interface CreatePostingRequestDto {
  workspaceId: number
  title: string
  description: string
  payAmount: number
  paymentType: PaymentType
  schedules: CreatePostingScheduleRequestDto[]
}

export interface UpdatePostingScheduleRequestDto extends CreatePostingScheduleRequestDto {
  id: number
}

export interface UpdatePostingRequestDto {
  title: string
  description: string
  payAmount: number
  paymentType: PaymentType
  createSchedules: CreatePostingScheduleRequestDto[]
  updateSchedules: UpdatePostingScheduleRequestDto[]
  deleteScheduleIds: number[]
}

function resolveBusinessType(workspace: {
  businessType?: string
  businessTypeDetail?: string
}): string {
  return workspace.businessTypeDetail?.trim() || workspace.businessType || ''
}

function toPostingSchedule(dto: PostingScheduleDto): PostingSchedule {
  return {
    id: dto.id ?? null,
    workingDays: dto.workingDays ?? [],
    startTime: toTimeOfDay(dto.startTime),
    endTime: toTimeOfDay(dto.endTime),
    position: dto.position ?? '',
    positionsNeeded: dto.positionsNeeded ?? 1,
  }
}

export function adaptPostingListItem(
  dto: ManagerPostingListItemDto
): PostingListItem {
  return {
    id: dto.id,
    workspaceId: dto.workspace?.id ?? 0,
    workspaceName: dto.workspace?.businessName ?? '',
    businessType: resolveBusinessType(dto.workspace ?? {}),
    title: dto.title,
    paymentType: dto.paymentType,
    payAmount: dto.payAmount,
    schedules: (dto.schedules ?? []).map(toPostingSchedule),
    createdAt: dto.createdAt,
  }
}

export function adaptPostingDetail(dto: ManagerPostingDetailDto): Posting {
  return {
    id: dto.id,
    workspaceId: dto.workspace?.id ?? 0,
    workspaceName: dto.workspace?.name ?? '',
    businessType: resolveBusinessType(dto.workspace ?? {}),
    title: dto.title,
    description: dto.description ?? '',
    paymentType: dto.paymentType,
    payAmount: dto.payAmount,
    status: dto.status?.value ?? 'OPEN',
    schedules: (dto.schedules ?? []).map(toPostingSchedule),
    createdAt: dto.createdAt,
  }
}

function toApplicationSchedule(dto: PostingApplicationScheduleDto) {
  return {
    workingDays: dto?.workingDays ?? [],
    startTime: toTimeOfDay(dto?.startTime),
    endTime: toTimeOfDay(dto?.endTime),
    position: dto?.position ?? '',
  }
}

export function adaptApplicationListItem(
  dto: PostingApplicationListItemDto
): ApplicationListItem {
  return {
    id: dto.id,
    workspaceId: dto.workspace?.id ?? 0,
    workspaceName: dto.workspace?.name ?? '',
    status: dto.status?.value ?? 'SUBMITTED',
    appliedAt: dto.createdAt,
    applicantName: dto.applicant?.name ?? '',
    schedule: toApplicationSchedule(dto.schedule),
  }
}

function toCertificate(dto: PostingApplicantCertificateDto): Certificate {
  return {
    name: dto.certificateName ?? '',
    issuer: dto.publisherName ?? '',
    acquiredAt: dto.issuedAt ?? '',
  }
}

function adaptApplicant(dto: PostingApplicantDetailDto): Applicant {
  return {
    name: dto?.name ?? '',
    phoneNumber: dto?.contact ?? '-',
    birthDate: dto?.birthday ?? '-',
    gender: dto?.gender === 'GENDER_FEMALE' ? '여성' : '남성',
    email: dto?.email ?? '-',
    certificates: (dto?.userCertificates ?? []).map(toCertificate),
  }
}

export function adaptApplicationDetail(
  dto: PostingApplicationDetailDto
): Application {
  return {
    id: dto.id,
    workspaceId: dto.workspace?.id ?? 0,
    workspaceName: dto.workspace?.name ?? '',
    status: dto.status?.value ?? 'SUBMITTED',
    appliedAt: dto.createdAt,
    applicant: adaptApplicant(dto.applicant),
    schedule: toApplicationSchedule(dto.schedule),
    description: dto.description ?? '',
  }
}
