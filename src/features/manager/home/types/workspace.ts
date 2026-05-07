import type { CommonApiResponse } from '@/shared/types/common'

// ---- API DTOs ----
export interface WorkspaceStatusDto {
  value: string
  description: string
}

export interface WorkspaceItemDto {
  id: number
  businessName: string
  businessType: string
  fullAddress: string
  createdAt: string
  status: WorkspaceStatusDto
}

export interface WorkspaceDetailDto {
  id: number
  businessName: string
  businessType: string
  contact: string
  description: string
  fullAddress: string
  reputationSummary: string
}

// ---- API Response Types ----
export type ManagedWorkspacesApiResponse = CommonApiResponse<WorkspaceItemDto[]>
export type WorkspaceDetailApiResponse = CommonApiResponse<WorkspaceDetailDto>
