import type { CommonApiResponse } from '@/shared/types/common'
import type { ManagerFixedScheduleWorkingDay } from '@/features/manager/home/types/workerFixedSchedule'

export type WorkspaceWorkerScheduleStatus = 'ACTIVATED' | 'DELETED'

export type FixedScheduleRecurrenceType = 'WEEKLY' | 'MONTHLY'

export interface FixedWorkerScheduleDto {
  id: number
  workspaceWorkerId: number
  startDayOfWeek: ManagerFixedScheduleWorkingDay
  startTime: string
  endDayOfWeek: ManagerFixedScheduleWorkingDay
  endTime: string
  status: WorkspaceWorkerScheduleStatus
  recurrenceType?:
    | { value: FixedScheduleRecurrenceType; description?: string }
    | FixedScheduleRecurrenceType
    | null
  weekOfMonth?: number | null
  startDate?: string | null
  endDate?: string | null
}

export type ResponseGetFixedWorkerSchdules = CommonApiResponse<
  FixedWorkerScheduleDto[]
>

/** 반복·기간 필드를 모두 생략하면 등록은 무기한 매주, 수정은 기존 반복·기간 보존이다. */
export type FixedWorkerScheduleRecurrenceInput = {
  recurrenceType: FixedScheduleRecurrenceType
  weekOfMonth: number | null
  startDate: string
  endDate: string | null
}

export type FixedWorkerScheduleSlotInput = {
  startDayOfWeek: ManagerFixedScheduleWorkingDay
  startTime: string
  endDayOfWeek: ManagerFixedScheduleWorkingDay
  endTime: string
} & Partial<FixedWorkerScheduleRecurrenceInput>

export type RequestPostFixedWorkerSchdules = {
  workspaceWorkerId: number
  schedules: FixedWorkerScheduleSlotInput[]
}

export type ResponsePostFixedWorkerSchdules = CommonApiResponse<unknown>

export type ResponseDeleteFixedWorkerSchdules = CommonApiResponse<unknown>

export type RequestPatchFixedWorkerSchdules = FixedWorkerScheduleSlotInput
