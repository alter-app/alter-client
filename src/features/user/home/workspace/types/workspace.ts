import type { CommonApiResponse } from '@/shared/types/common'

// DTO
export interface WorkspaceItemDto {
  workspaceId: number
  businessName: string
  employedAt: string
  nextShiftDateTime?: string | null
}

export interface WorkspacePageDto {
  cursor: string
  pageSize: number
  totalCount: number
}

export interface WorkspaceListDto {
  page: WorkspacePageDto
  data: WorkspaceItemDto[]
}

export type WorkspaceListApiResponse = CommonApiResponse<WorkspaceListDto>

// UI Model
export interface WorkspaceItem {
  workspaceId: number
  businessName: string
  employedAt: string
  nextShiftDateTime: string | null
}

export interface WorkspaceListQueryParams {
  cursor?: string
  pageSize: number
}
