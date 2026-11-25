import type { CommonApiResponse } from '@/shared/types/common'

export type WorkspaceInvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'

/** 응답 status — {value, description} */
export interface WorkspaceInvitationStatusDto {
  value: WorkspaceInvitationStatus | string
  description: string
}

export interface WorkspaceMembershipCursorPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface MyInvitationItemDto {
  invitationId: number
  businessName: string
  invitedAt: string | null
  expiresAt: string | null
  status?: WorkspaceInvitationStatusDto
}

export interface MyInvitationsListDto {
  page: WorkspaceMembershipCursorPageDto
  data: MyInvitationItemDto[]
}

export type MyInvitationsApiResponse = CommonApiResponse<MyInvitationsListDto>

export interface MyInvitationsQueryParams {
  pageSize: number
  cursor?: string
  status?: WorkspaceInvitationStatus
  from?: string
  to?: string
}

export type InvitationActionApiResponse = CommonApiResponse<
  Record<string, never>
>
