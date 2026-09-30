import type { CommonApiResponse } from '@/shared/types/common'

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

export interface WorkspaceListQueryParams {
  cursor?: string
  pageSize: number
}
