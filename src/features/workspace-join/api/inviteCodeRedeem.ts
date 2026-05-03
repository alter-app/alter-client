import axiosInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'

type RedeemInviteData = {
  businessName?: string
  workspaceName?: string
}

/**
 * 초대 코드로 업장 합류. Swagger에 맞춰 경로·요청 바디 키(`inviteCode` 등)만 조정하면 됩니다.
 */
const INVITE_CODE_REDEEM_PATH = '/app/users/me/invitations/redeem-invite-code'

/** 성공 시 표시할 매장 이름(응답에 없으면 기본 문구). */
export async function redeemInviteByCode(trimmedUpperCode: string): Promise<string> {
  const inviteCode = trimmedUpperCode.trim().toUpperCase()
  const { data } = await axiosInstance.post<CommonApiResponse<RedeemInviteData>>(
    INVITE_CODE_REDEEM_PATH,
    { inviteCode }
  )
  const d = data.data
  const name =
    (typeof d?.businessName === 'string' && d.businessName.trim()) ||
    (typeof d?.workspaceName === 'string' && d.workspaceName.trim()) ||
    ''
  return name || '등록된 업장'
}
