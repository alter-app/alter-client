import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'

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

export interface CalendarEvent {
  shiftId: number
  workspaceName: string
  position: string
  status: StatusEnum
  startDateTime: string
  endDateTime: string
  dateKey: string
  startTimeLabel: string
  endTimeLabel: string
  durationHours: number
}

export interface CalendarSummary {
  totalWorkHours: number
  eventCount: number
}

export interface CalendarViewData {
  summary: CalendarSummary
  events: CalendarEvent[]
}
