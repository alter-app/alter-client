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

export interface ScheduleDataDto {
  totalWorkHours: number
  schedules: ScheduleItemDto[]
}

export type ScheduleApiResponse = CommonApiResponse<ScheduleDataDto>
