import type { CommonApiResponse } from '@/shared/types/common'
import type { StatusEnum } from '@/shared/types/enums'

// ---- DTO ----
export interface WorkspaceShiftWorkerDto {
  workerId: number
  workerName: string
}

export interface WorkspaceShiftDto {
  shiftId: number
  assignedWorker: WorkspaceShiftWorkerDto
  startDateTime: string
  endDateTime: string
  position: string
  status: StatusEnum
}

export type WorkspaceScheduleApiResponse = CommonApiResponse<
  WorkspaceShiftDto[]
>

// ---- Query Params ----
export interface WorkspaceScheduleQueryParams {
  year?: number
  month?: number
  day?: number
  fromYear?: number
  fromMonth?: number
  fromDay?: number
  toYear?: number
  toMonth?: number
  toDay?: number
}

// ---- UI Model ----
export interface WorkspaceShiftItem {
  shiftId: number
  workerId: number
  workerName: string
  position: string
  status: StatusEnum
  startDateTime: string
  endDateTime: string
  timeRange: string
  durationHours: number
}

export interface WorkspaceWorkerItem {
  workerId: number
  workerName: string
  nextShiftDateTime: string
  nextShiftTimeRange: string
}
