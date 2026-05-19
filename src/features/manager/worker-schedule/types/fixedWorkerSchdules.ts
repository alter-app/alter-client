import type { CommonApiResponse } from '@/shared/types/common'
import type { ManagerFixedScheduleWorkingDay } from '@/features/manager/home/types/workerFixedSchedule'

export type WorkspaceWorkerScheduleStatus = 'ACTIVATED' | 'DELETED'

export interface FixedWorkerScheduleDto {
  id: number
  workspaceWorkerId: number
  startDayOfWeek: ManagerFixedScheduleWorkingDay
  startTime: string
  endDayOfWeek: ManagerFixedScheduleWorkingDay
  endTime: string
  status: WorkspaceWorkerScheduleStatus
}

export type ResponseGetFixedWorkerSchdules = CommonApiResponse<
  FixedWorkerScheduleDto[]
>

export type FixedWorkerScheduleSlotInput = {
  startDayOfWeek: ManagerFixedScheduleWorkingDay
  startTime: string
  endDayOfWeek: ManagerFixedScheduleWorkingDay
  endTime: string
}

export type RequestPostFixedWorkerSchdules = {
  workspaceWorkerId: number
  schedules: FixedWorkerScheduleSlotInput[]
}

export type ResponsePostFixedWorkerSchdules = CommonApiResponse<unknown>

export type ResponseDeleteFixedWorkerSchdules = CommonApiResponse<unknown>

export type RequestPatchFixedWorkerSchdules = FixedWorkerScheduleSlotInput
