import axios from 'axios'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { formatPhone } from '@/shared/lib/utils/signupValidation'
import type { InvalidInvitePhoneNumbersPayload } from '@/features/manager/workspace-invite/types/invitation'

function extractInvalidPhoneNumbers(data: unknown): string[] {
  if (!data) return []

  if (Array.isArray(data)) {
    return data.filter(
      (v): v is string => typeof v === 'string' && v.length > 0
    )
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    const payload = data as Exclude<InvalidInvitePhoneNumbersPayload, string[]>
    const fromPhoneNumbers = payload.phoneNumbers
    if (Array.isArray(fromPhoneNumbers)) return fromPhoneNumbers
    const fromInvalid = payload.invalidPhoneNumbers
    if (Array.isArray(fromInvalid)) return fromInvalid
  }

  return []
}

/** 초대 발송 API(8.1) 에러 — 발송 불가 번호 목록(data) 반영 */
export function getInviteSendErrorMessage(
  error: unknown,
  fallback = '초대를 보내지 못했습니다. 번호를 확인해 주세요.'
): string {
  if (axios.isAxiosError(error)) {
    const raw = error.response?.data as
      | {
          code?: string
          message?: string
          data?: unknown
        }
      | undefined

    const invalid = extractInvalidPhoneNumbers(raw?.data)
    const base = getAxiosErrorMessage(error, fallback)

    if (invalid.length > 0) {
      const formatted = invalid
        .map(n => formatPhone(n.replace(/\D/g, '')))
        .join(', ')
      return `${base} 발송할 수 없는 번호: ${formatted}`
    }

    return base
  }

  return getAxiosErrorMessage(error, fallback)
}
