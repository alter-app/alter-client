import type {
  AppliedStoreData,
  ApplicationStatus,
  FilterType,
  WeekdayLabel,
} from '@/features/user/home/applied-stores/types/appliedStore'
import type { ApplicationApiStatus } from '@/shared/types/applicationStatus'

// ---- API Status ----
// 크로스 롤(유저·매니저) 공용 enum — 정의는 shared로 이동, 기존 소비처를 위해 재노출
export type { ApplicationApiStatus } from '@/shared/types/applicationStatus'

// ---- DTO ----
export interface PostingScheduleDto {
  id: number
  workingDays: string | string[]
  startTime: string
  endTime: string
  position: string
}

export interface PostingDto {
  id: number
  workspace: number
  title: string
  payAmount: number
  paymentType: string
}

export interface ApplicationDto {
  id: number
  postingSchedule: PostingScheduleDto
  posting: PostingDto
  description: string
  status: { value: ApplicationApiStatus; description: string }
  createdAt: string
}

export interface ApplicationPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type ApplicationListApiResponse = {
  page: ApplicationPageDto
  data: ApplicationDto[]
}

// ---- Query Params ----
export interface ApplicationListQueryParams {
  cursor?: string
  pageSize: number
  status?: ApplicationApiStatus[]
}

// ---- FilterType → API Status 매핑 (mapApiStatusToUiStatus와 동일 기준) ----
export const FILTER_TO_API_STATUS: Record<FilterType, ApplicationApiStatus[]> =
  {
    all: [],
    submitted: ['SUBMITTED', 'SHORTLISTED'],
    accepted: ['ACCEPTED'],
    rejected: ['REJECTED'],
    cancelled: ['CANCELLED', 'EXPIRED', 'DELETED'],
  }

// ---- 근무 요일 파싱 ----
const WORKING_DAY_MAP: Record<string, WeekdayLabel> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

export function parseWorkingDays(
  workingDays: string | string[] | null | undefined
): WeekdayLabel[] {
  if (workingDays == null || workingDays === '') return []

  if (Array.isArray(workingDays)) {
    return workingDays
      .map(d => WORKING_DAY_MAP[String(d).trim().toUpperCase()])
      .filter((d): d is WeekdayLabel => d !== undefined)
  }

  if (typeof workingDays !== 'string') return []

  const matches = workingDays.match(/[A-Z]+/g) ?? []
  return matches
    .map(day => WORKING_DAY_MAP[day])
    .filter((d): d is WeekdayLabel => d !== undefined)
}

// ---- 근무 시간 포맷 ----
function calcDurationHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const startMins = sh * 60 + sm
  const endMins = eh * 60 + em
  const diffMins =
    endMins >= startMins ? endMins - startMins : 24 * 60 - startMins + endMins
  const hours = diffMins / 60
  return Number.isInteger(hours) ? hours : Math.round(hours * 10) / 10
}

export function formatTimeRange(startTime: string, endTime: string): string {
  const hours = calcDurationHours(startTime, endTime)
  return `${startTime}~${endTime} (${hours}시간)`
}

// ---- API Status → UI 타입 매핑 ----
function mapApiStatusToUiStatus(
  apiStatus: ApplicationApiStatus
): ApplicationStatus {
  if (apiStatus === 'ACCEPTED') return 'accepted'
  if (apiStatus === 'REJECTED') return 'rejected'
  if (
    apiStatus === 'CANCELLED' ||
    apiStatus === 'EXPIRED' ||
    apiStatus === 'DELETED'
  )
    return 'cancelled'
  return 'submitted'
}

// ---- DTO → UI Model ----
export function adaptApplicationDto(dto: ApplicationDto): AppliedStoreData {
  const { postingSchedule, posting, description, status } = dto
  return {
    id: dto.id,
    storeName: posting.title,
    status: mapApiStatusToUiStatus(status.value),
    applicationDetail: {
      selectedWeekdays: parseWorkingDays(postingSchedule.workingDays),
      timeRangeLabel: formatTimeRange(
        postingSchedule.startTime,
        postingSchedule.endTime
      ),
      selfIntroduction: description,
    },
  }
}
