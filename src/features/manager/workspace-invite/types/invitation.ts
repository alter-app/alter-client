import type { CommonApiResponse } from '@/shared/types/common'
import type { WorkspaceInvitationStatus } from '@/features/workspace-join/types/membership'

export interface WorkspaceInvitationCursorPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface ManagerInvitationItemDto {
  invitationId: number
  phoneNumber: string
  inviteeName?: string | null
  status: WorkspaceInvitationStatus
  invitedAt: string
  expiresAt?: string
}

export interface ManagerInvitationsListDto {
  page: WorkspaceInvitationCursorPageDto
  data: ManagerInvitationItemDto[]
}

export type ManagerInvitationsApiResponse =
  CommonApiResponse<ManagerInvitationsListDto>

export interface ManagerInvitationsQueryParams {
  pageSize: number
  cursor?: string
  status?: WorkspaceInvitationStatus
}

export interface SendWorkspaceInvitationRequest {
  phoneNumber: string
}

export type SendWorkspaceInvitationApiResponse = CommonApiResponse<
  Record<string, never>
>
