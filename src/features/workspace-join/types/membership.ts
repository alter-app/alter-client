import type { CommonApiResponse } from '@/shared/types/common'

export type WorkspaceJoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

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

export interface MyJoinRequestItemDto {
  joinRequestId: number
  businessName: string
  status: WorkspaceJoinRequestStatus
  requestedAt: string
}

export interface MyJoinRequestsListDto {
  page: WorkspaceMembershipCursorPageDto
  data: MyJoinRequestItemDto[]
}

export type MyJoinRequestsApiResponse =
  CommonApiResponse<MyJoinRequestsListDto>

export interface MyJoinRequestsQueryParams {
  pageSize: number
  cursor?: string
  status?: WorkspaceJoinRequestStatus
  from?: string
  to?: string
}

export interface MyInvitationItemDto {
  invitationId: number
  businessName: string
  invitedAt: string
  expiresAt: string
  /** 목록 조회 시 응답에 포함되는 경우만 */
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

export type InvitationActionApiResponse = CommonApiResponse<Record<
  string,
  never
>>
