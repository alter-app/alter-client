import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'

const SUBSTITUTE_ACTION_ERROR_MESSAGES: Record<string, string> = {
  B001: '이미 처리되었거나 승인/거절할 수 없는 상태입니다.',
  A002: '관리 중인 업장이 아닙니다.',
  B020: '존재하지 않는 대타 요청입니다.',
}

const DEFAULT_SUBSTITUTE_ACTION_ERROR_MESSAGE =
  '처리 중 오류가 발생했습니다. 다시 시도해 주세요.'

/**
 * 409 B020은 승인 직전 수락자의 시간 겹침이나 원래 근무 삭제로 승인이 거절된 경우이고(요청은 ACCEPTED로 남는다),
 * 그 밖의 B020은 요청을 찾을 수 없는 경우다.
 */
export function isSubstituteApproveConflict(error: unknown): boolean {
  return isApiError(error, 409, 'B020')
}

/** 409 B020은 원인마다 서버 message가 달라 그대로 보여 주고, message가 비어 있으면 기본 문구를 쓴다. */
export function getSubstituteActionErrorMessage(error: unknown): string {
  if (isSubstituteApproveConflict(error)) {
    return (
      getApiErrorInfo(error).message ?? DEFAULT_SUBSTITUTE_ACTION_ERROR_MESSAGE
    )
  }
  const { code } = getApiErrorInfo(error)
  if (code && SUBSTITUTE_ACTION_ERROR_MESSAGES[code]) {
    return SUBSTITUTE_ACTION_ERROR_MESSAGES[code]
  }
  return DEFAULT_SUBSTITUTE_ACTION_ERROR_MESSAGE
}
