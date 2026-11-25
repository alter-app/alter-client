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
  /** 지번 주소 — 기존 업장은 null */
  jibunAddress?: string | null
  /** 상세 주소 — 기존 업장은 null */
  detailAddress?: string | null
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
  /** 지번 주소 — 기존 업장은 null */
  jibunAddress?: string | null
  /** 상세 주소 — 기존 업장은 null */
  detailAddress?: string | null
  reputationSummary: string
}

// ---- API Response Types ----
export type ManagedWorkspacesApiResponse = CommonApiResponse<WorkspaceItemDto[]>
export type WorkspaceDetailApiResponse = CommonApiResponse<WorkspaceDetailDto>
