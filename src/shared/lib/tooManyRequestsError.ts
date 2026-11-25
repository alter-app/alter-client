import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'

const TOO_MANY_REQUESTS_MESSAGE =
  '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'

/**
 * 요청이 많아 서버가 거절한 경우(429 E001). 거절 원인과 재전송 가능 여부는 API마다 다르니 호출하는 쪽에서 판단한다.
 * 예: 관리자 근무 배정·시간 변경·대타 승인에서는 잠금 대기 초과로 변경이 반영되지 않은 경우다.
 */
export function isTooManyRequestsError(error: unknown): boolean {
  return isApiError(error, 429, 'E001')
}

/** 429 E001 안내 문구. 서버 message가 비어 있으면 서버의 E001 문구를 쓴다. */
export function getTooManyRequestsMessage(error: unknown): string {
  return getApiErrorInfo(error).message ?? TOO_MANY_REQUESTS_MESSAGE
}
