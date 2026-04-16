import type { CommonApiResponse } from '@/shared/types/common'

// ---- API DTOs ----
export interface WorkspaceStatusDto {
  value: string
  description: string
}

export interface WorkspaceItemDto {
  id: number
  businessName: string
  fullAddress: string
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

// ---- UI Models ----
export interface ManagerWorkspaceItem {
  id: number
  businessName: string
  fullAddress: string
  status: WorkspaceStatusDto
}

export interface ManagerWorkspaceDetail {
  id: number
  businessName: string
  businessType: string
  contact: string
  description: string
  fullAddress: string
  reputationSummary: string
}

// ---- Adapters ----
export function adaptWorkspaceItemDto(
  dto: WorkspaceItemDto
): ManagerWorkspaceItem {
  return {
    id: dto.id,
    businessName: dto.businessName,
    fullAddress: dto.fullAddress,
    status: dto.status,
  }
}

export function adaptWorkspaceDetailDto(
  dto: WorkspaceDetailDto
): ManagerWorkspaceDetail {
  return {
    id: dto.id,
    businessName: dto.businessName,
    businessType: dto.businessType,
    contact: dto.contact,
    description: dto.description,
    fullAddress: dto.fullAddress,
    reputationSummary: dto.reputationSummary,
  }
}
