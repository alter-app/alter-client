import type { CommonApiResponse } from '@/shared/types/common'
import type { StoreWorkerRole } from '@/features/manager/home/types/storeWorkerRole'

// ---- API DTOs ----
export interface WorkerUserDto {
  id: number
  name: string
  contact: string
  gender: string
  profileImageUrl?: string | null
}

export interface WorkerStatusDto {
  value: string
  description: string
}

export interface WorkerPositionDto {
  type: string
  description: string
  emoji: string
}

export interface WorkerDto {
  id: number
  user: WorkerUserDto
  status: WorkerStatusDto
  position: WorkerPositionDto
  colorCode: string
  employedAt: string
  resignedAt: string | null
  nextShiftDateTime: string | null
}

export interface WorkerPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type WorkersApiResponse = CommonApiResponse<{
  page: WorkerPageDto
  data: WorkerDto[]
}>

// ---- Query Params ----
export interface WorkspaceWorkersQueryParams {
  workspaceId: number
  cursor?: string
  pageSize: number
  status?: string
  name?: string
}

// ---- UI Model ----
export interface ManagerWorkerItem {
  id: number
  name: string
  role: StoreWorkerRole
  /** 스케줄 생성·수정 API `position` 필드 */
  position: string
  /** `PATCH …/workers/{id}/color` */
  colorCode: string
  nextWorkDate: string
  profileImageUrl?: string
}
