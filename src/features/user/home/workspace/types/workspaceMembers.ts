import type { CommonApiResponse } from '@/shared/types/common'

// ---- DTO ----
export interface WorkspacePositionDto {
  type: string
  description: string
  emoji: string
}

export interface WorkspaceWorkerDto {
  id: number
  user: { id: number; name: string; profileImageUrl?: string | null }
  position: WorkspacePositionDto
  employedAt: string
  nextShiftDateTime: string
}

export interface WorkspaceManagerDto {
  id: number
  manager: { id: number; name: string; profileImageUrl?: string | null }
  position: WorkspacePositionDto
}

export interface WorkspaceMembersPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export type WorkspaceWorkersApiResponse = CommonApiResponse<{
  page: WorkspaceMembersPageDto
  data: WorkspaceWorkerDto[]
}>

export type WorkspaceManagersApiResponse = CommonApiResponse<{
  page: WorkspaceMembersPageDto
  data: WorkspaceManagerDto[]
}>

// ---- Params ----
export interface WorkspaceMembersQueryParams {
  cursor?: string
  pageSize: number
}

// ---- UI Model ----
export interface WorkspaceWorkerItem {
  id: number
  userId: number
  name: string
  profileImageUrl?: string | null
  positionType: string
  positionDescription: string
  positionEmoji: string
  employedAt: string
  nextShiftDateTime: string
}

export interface WorkspaceManagerItem {
  id: number
  managerId: number
  name: string
  profileImageUrl?: string | null
  positionType: string
  positionDescription: string
  positionEmoji: string
}
