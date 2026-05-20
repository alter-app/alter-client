import type { CommonApiResponse } from '@/shared/types/common'

/** POST /manager/workspaces/{workspaceId}/invitations */
export interface SendWorkspaceInvitationRequest {
  phoneNumbers: string[]
}

export type SendWorkspaceInvitationApiResponse = CommonApiResponse<
  Record<string, never>
>

/** B001 등 발송 실패 시 data에 포함될 수 있는 발송 불가 번호 목록 */
export type InvalidInvitePhoneNumbersPayload =
  | string[]
  | { phoneNumbers?: string[]; invalidPhoneNumbers?: string[] }
