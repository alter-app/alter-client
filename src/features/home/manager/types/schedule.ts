import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'
import type {
  CalendarEvent,
  CalendarViewData,
} from '@/features/home/common/schedule/types/calendarView'
import {
  toDateKey,
  toTimeLabel,
  getDurationHours,
} from '@/features/home/common/schedule/lib/date'

// ---- Today Schedule DTOs ----
export interface TodayShiftDto {
  shiftId: number
  startDateTime: string
  endDateTime: string
}

export interface TodayWorkerDto {
  workerId: number
  workerName: string
  profileImageUrl: string
  shifts: TodayShiftDto[]
}

export type TodayScheduleApiResponse = CommonApiResponse<TodayWorkerDto[]>

// ---- API DTOs ----
export interface ManagerScheduleWorkspaceDto {
  workspaceId: number
  workspaceName: string
}

export interface ManagerScheduleWorkerDto {
  workerId: number
  workerName: string
}

export interface ManagerScheduleStatusDto {
  value: string
  description: string
}

export interface ManagerScheduleDto {
  shiftId: number
  workspace: ManagerScheduleWorkspaceDto
  assignedWorker: ManagerScheduleWorkerDto
  startDateTime: string
  endDateTime: string
  position: string
  status: ManagerScheduleStatusDto
}

export type ManagerScheduleApiResponse = CommonApiResponse<ManagerScheduleDto[]>

// ---- Query Params ----
export interface ManagerScheduleQueryParams {
  workspaceId: number
  year: number
  month: number
}

// ---- Adapter ----
function adaptManagerScheduleDto(dto: ManagerScheduleDto): CalendarEvent {
  return {
    shiftId: dto.shiftId,
    workspaceName: dto.workspace.workspaceName,
    position: dto.position,
    status: dto.status.value as StatusEnum,
    startDateTime: dto.startDateTime,
    endDateTime: dto.endDateTime,
    dateKey: toDateKey(dto.startDateTime),
    startTimeLabel: toTimeLabel(dto.startDateTime),
    endTimeLabel: toTimeLabel(dto.endDateTime),
    durationHours: getDurationHours(dto.startDateTime, dto.endDateTime),
  }
}

export function adaptManagerScheduleResponse(
  response: ManagerScheduleApiResponse
): CalendarViewData {
  const events = response.data.map(adaptManagerScheduleDto)
  const totalWorkHours = events.reduce((sum, e) => sum + e.durationHours, 0)
  return {
    summary: {
      totalWorkHours,
      eventCount: events.length,
    },
    events,
  }
}
