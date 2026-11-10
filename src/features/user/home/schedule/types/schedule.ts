import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'

// CalendarEvent, CalendarSummary, CalendarViewData는 common으로 이동 — 하위 호환 re-export
export type {
  CalendarEvent,
  CalendarSummary,
  CalendarViewData,
} from '@/features/home/common/schedule/types/calendarView'

export type HomeCalendarMode = 'monthly' | 'weekly' | 'daily'

export interface WorkspaceInfo {
  workspaceId: number
  workspaceName: string
}

export interface ScheduleItemDto {
  shiftId: number
  workspace: WorkspaceInfo
  startDateTime: string
  endDateTime: string
  position: string
  status: StatusEnum
}

export interface WorkspaceSummaryDto {
  workspace: WorkspaceInfo
  totalWorkHours: number
  estimatedSalary: number
}

/**
 * GET /app/schedules/self 응답 data
 * - 월 조회(year, month): estimatedSalary·workspaceSummaries(업장 ID 오름차순) 포함
 * - 일 조회(day 포함): 그날 근무시간만 내리고 estimatedSalary·workspaceSummaries는 null
 */
export interface ScheduleDataDto {
  totalWorkHours: number
  estimatedSalary?: number | null
  workspaceSummaries?: WorkspaceSummaryDto[] | null
  schedules: ScheduleItemDto[]
}

export interface MonthlyIncomeWorkspaceItem {
  workspaceId: number
  workspaceName: string
  totalWorkHours: number
  estimatedSalary: number
}

export interface MonthlyIncome {
  totalWorkHours: number
  estimatedSalary: number
  workspaces: MonthlyIncomeWorkspaceItem[]
}

export type ScheduleApiResponse = CommonApiResponse<ScheduleDataDto>
