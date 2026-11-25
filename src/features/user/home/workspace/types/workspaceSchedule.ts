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

/**
 * GET /app/schedules/workspaces/{id} 기본 응답의 data 객체
 * - schedules: 본인에게 배정된 확정 근무만 (assignedWorker는 항상 본인)
 * - 본인 근무가 없는 달은 빈 배열·0시간·0원
 */
export interface WorkspaceScheduleDataDto {
  totalWorkHours: number
  estimatedSalary: number
  schedules: WorkspaceShiftDto[]
}

/** 구버전/부분 형태 호환 포함 */
export type WorkspaceScheduleDataPayload =
  | WorkspaceScheduleDataDto
  | WorkspaceShiftDto[]
  | {
      totalWorkHours?: number
      estimatedSalary?: number
      schedules?: WorkspaceShiftDto[]
      shifts?: WorkspaceShiftDto[]
    }

export type WorkspaceScheduleApiResponse =
  CommonApiResponse<WorkspaceScheduleDataPayload>

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
