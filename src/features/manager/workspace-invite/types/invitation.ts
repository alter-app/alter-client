import type { CommonApiResponse } from '@/shared/types/common'

/** POST /manager/workspaces/{workspaceId}/invitations */
export interface SendWorkspaceInvitationRequest {
  phoneNumbers: string[]
}

export type SendWorkspaceInvitationApiResponse = CommonApiResponse<
  Record<string, never>
>

/** 초대 실패 사유 코드 */
export type InvitationFailureReason =
  | 'NOT_REGISTERED'
  | 'ACCOUNT_UNAVAILABLE'
  | 'ALREADY_WORKING'
  | 'ALREADY_INVITED'

/** B001 발송 실패 시 data[] 한 건 — 번호별 사유 */
export interface InvitationFailureItem {
  phoneNumber: string
  reason: { value: InvitationFailureReason | string; description: string }
}
