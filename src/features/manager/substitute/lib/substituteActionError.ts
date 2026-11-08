import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'

const SUBSTITUTE_ACTION_ERROR_MESSAGES: Record<string, string> = {
  B001: '이미 처리되었거나 승인/거절할 수 없는 상태입니다.',
  A002: '관리 중인 업장이 아닙니다.',
  B020: '존재하지 않는 대타 요청입니다.',
}

export const SUBSTITUTE_APPROVE_CONFLICT_MESSAGE =
  '승인하지 못했어요. 수락한 근무자에게 같은 시간대 근무가 생겨 요청은 수락 상태로 남아 있어요.'

/** 409 B020은 승인 직전 시간 충돌이고, 그 밖의 B020은 요청을 찾을 수 없는 경우다. */
export function isSubstituteApproveConflict(error: unknown): boolean {
  return isApiError(error, 409, 'B020')
}

export function getSubstituteActionErrorMessage(error: unknown): string {
  if (isSubstituteApproveConflict(error)) {
    return SUBSTITUTE_APPROVE_CONFLICT_MESSAGE
  }
  const { code } = getApiErrorInfo(error)
  if (code && SUBSTITUTE_ACTION_ERROR_MESSAGES[code]) {
    return SUBSTITUTE_ACTION_ERROR_MESSAGES[code]
  }
  return '처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
}
