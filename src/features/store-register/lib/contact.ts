import type { FieldErrorItem } from '@/shared/types/common'
import { maskContact } from '@/features/store-register/lib/inputMask'

/** 서버 규칙과 동일: 0으로 시작하는 9~11자리 숫자 또는 2~3자리-3~4자리-4자리 */
const CONTACT_PATTERN = /^(?:0[0-9]{8,10}|0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4})$/

export const CONTACT_FORMAT_MESSAGE =
  '연락처는 0으로 시작하는 9~11자리 숫자 또는 2~3자리-3~4자리-4자리 형식이어야 합니다.'

/** 화면 입력(하이픈 포함 가능) → 서버 전송값(숫자만, 문자열) */
export function toContactPayload(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidContact(value: string): boolean {
  return CONTACT_PATTERN.test(toContactPayload(value))
}

/** 하이픈 유무와 관계없이 같은 형식으로 보여 준다. 값이 없으면 빈 문자열. */
export function formatContactDisplay(value: string | null | undefined): string {
  if (!value) return ''
  const digits = toContactPayload(value)
  // 규칙 밖 레거시 값은 가공하지 않고 그대로 보여 준다
  return isValidContact(digits) ? maskContact(digits) : value
}

/** 400 B001 의 data[] 에서 특정 필드 오류 메시지를 모아 반환 */
export function pickFieldErrorMessage(
  data: unknown,
  field: string
): string | null {
  if (!Array.isArray(data)) return null
  const messages = (data as Partial<FieldErrorItem>[])
    .filter(item => item?.field === field && typeof item.message === 'string')
    .map(item => item.message as string)
  return messages.length > 0 ? messages.join('\n') : null
}
