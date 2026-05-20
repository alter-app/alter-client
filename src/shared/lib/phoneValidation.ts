import { normalizePhone } from '@/shared/lib/utils/signupValidation'

/** 가입·초대 등에 쓰는 국내 휴대폰 번호(010, 11자리) 완성 여부 */
export function isCompleteKoreanMobilePhone(value: string): boolean {
  const digits = normalizePhone(value)
  return digits.length === 11 && digits.startsWith('010')
}

/** 초대 발송 API(8.1) — 숫자 10~11자리 (@Size(min=10, max=11)) */
export function isValidInvitePhoneNumber(value: string): boolean {
  const digits = normalizePhone(value)
  return digits.length >= 10 && digits.length <= 11
}

/** API 요청용 숫자만 전화번호 */
export function toApiPhoneNumber(value: string): string {
  return normalizePhone(value)
}
