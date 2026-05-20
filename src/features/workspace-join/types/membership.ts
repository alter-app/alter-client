import type { CommonApiResponse } from '@/shared/types/common'

export type WorkspaceInvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'

export interface WorkspaceMembershipCursorPageDto {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface MyInvitationItemDto {
  invitationId: number
  businessName: string
  invitedAt: string
  expiresAt: string
  status?: WorkspaceInvitationStatus
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
