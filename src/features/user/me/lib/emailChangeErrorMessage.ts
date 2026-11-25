import {
  EMAIL_ALREADY_REGISTERED_MESSAGE,
  TOO_MANY_REQUESTS_MESSAGE,
} from '@/shared/constants/apiErrorMessages'
import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

const EMAIL_SAME_AS_CURRENT = '현재 등록된 이메일과 동일합니다.'

/**
 * 마이페이지 이메일 인증 코드 발송·검증·등록 실패 문구.
 * 서버 message를 우선 쓰고, 없으면 이메일 흐름의 코드별 문구를 쓴다.
 * 공통 코드표의 409 `B020`("존재하지 않는 스케줄입니다.")이 이메일 화면에 나오지 않게 먼저 걸러낸다.
 */
export function getEmailChangeErrorMessage(
  error: unknown,
  fallback: string
): string {
  const { message } = getApiErrorInfo(error)
  if (message) return message
  if (isApiError(error, 400, 'A004')) return EMAIL_ALREADY_REGISTERED_MESSAGE
  if (isApiError(error, 409, 'B020')) return EMAIL_SAME_AS_CURRENT
  if (isApiError(error, 429, 'E001')) return TOO_MANY_REQUESTS_MESSAGE
  return getAxiosErrorMessage(error, fallback)
}
