import axios from 'axios'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { formatPhone } from '@/shared/lib/utils/signupValidation'
import type { InvitationFailureItem } from '@/features/manager/workspace-invite/types/invitation'

const REASON_LABEL: Record<string, string> = {
  NOT_REGISTERED: '가입하지 않은 번호예요',
  ACCOUNT_UNAVAILABLE: '초대할 수 없는 계정이에요',
  ALREADY_WORKING: '이미 근무 중이에요',
  ALREADY_INVITED: '이미 초대를 보냈어요',
}

export interface InviteFailureLine {
  phoneNumber: string
  message: string
}

/** data[] → 번호별 사유 목록. 알 수 없는 형태는 무시한다. */
export function extractInviteFailures(data: unknown): InviteFailureLine[] {
  if (!Array.isArray(data)) return []
  return data.flatMap((item): InviteFailureLine[] => {
    if (!item || typeof item !== 'object') return []
    const { phoneNumber, reason } = item as Partial<InvitationFailureItem>
    if (typeof phoneNumber !== 'string' || !phoneNumber) return []
    const value = reason?.value
    const message =
      (value && REASON_LABEL[value]) ||
      reason?.description ||
      '발송할 수 없어요'
    return [
      { phoneNumber: formatPhone(phoneNumber.replace(/\D/g, '')), message },
    ]
  })
}

/** 초대 발송 실패 시 번호별 사유 (없으면 빈 배열) */
export function getInviteFailureLines(error: unknown): InviteFailureLine[] {
  if (!axios.isAxiosError(error)) return []
  return extractInviteFailures(error.response?.data?.data)
}

/** 초대 발송 API 에러 — 번호별 사유가 있으면 줄바꿈으로 이어 붙인다 */
export function getInviteSendErrorMessage(
  error: unknown,
  fallback = '초대를 보내지 못했습니다. 번호를 확인해 주세요.'
): string {
  const base = getAxiosErrorMessage(error, fallback)
  const lines = getInviteFailureLines(error)
  if (lines.length === 0) return base
  return [base, ...lines.map(l => `${l.phoneNumber} · ${l.message}`)].join('\n')
}
