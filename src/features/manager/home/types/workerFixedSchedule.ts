import type { CommonApiResponse } from '@/shared/types/common'

/** 서버 고정 근무 요일 (공고 스케줄 등과 동일 키) */
export type ManagerFixedScheduleWorkingDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface WorkerFixedScheduleSlotDto {
  workingDay: ManagerFixedScheduleWorkingDay
  /** "HH:mm" 또는 "HH:mm:ss" */
  startTime: string
  endTime: string
}

export type WorkerFixedScheduleApiResponse = CommonApiResponse<
  WorkerFixedScheduleSlotDto[]
>
