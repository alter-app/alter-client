import type { CommonApiResponse } from '@/shared/types/common'

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
  colorCode: string
}

export interface ManagerScheduleStatusDto {
  value: 'ACTIVATED' | 'RESIGNED'
  description: string
}

export interface ManagerScheduleShiftDto {
  shiftId: number
  workspace: ManagerScheduleWorkspaceDto
  assignedWorker?: ManagerScheduleWorkerDto | null
  startDateTime: string
  endDateTime: string
  position: string
  status: ManagerScheduleStatusDto
}

export interface ManagerScheduleDto {
  totalWorkHours: number
  estimatedLaborCost: number
  schedules: ManagerScheduleShiftDto[]
}

export type ManagerScheduleApiResponse = CommonApiResponse<ManagerScheduleDto>

export type ResponseDeleteScheduleWorker = CommonApiResponse<unknown>
export type ResponseDeleteSchedule = CommonApiResponse<unknown>

export type RequestPutScheduleWorker = { workerId: number }
export type ResponsePutScheduleWorker = CommonApiResponse<unknown>

export type RequestPutSchedule = {
  startDateTime: string
  endDateTime: string
  position: string
}
export type ResponsePutSchedule = CommonApiResponse<unknown>

// ---- Query Params ----
export interface ManagerScheduleQueryParams {
  workspaceId: number
  year: number
  month: number
}
