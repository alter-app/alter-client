import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

export const USER_SUBSTITUTE_RESPOND_ERROR_FALLBACK =
  '요청 처리에 실패했습니다.'
export const USER_SUBSTITUTE_CREATE_ERROR_FALLBACK = '대타 요청에 실패했습니다.'

/**
 * 409 B020은 다른 업장을 포함한 근무 시간 충돌, 400 B001은 일반 충돌·잘못된 시간·처리할 수 없는 상태다.
 * 둘 다 화면에 보이던 상태가 낡았을 수 있다는 뜻이라 호출부는 관련 목록을 다시 조회한다.
 */
export function isUserSubstituteConflictError(error: unknown): boolean {
  return isApiError(error, 409, 'B020') || isApiError(error, 400, 'B001')
}

/**
 * 충돌 오류는 원인마다 서버 message가 달라 그대로 쓰고, message가 비면 `fallback`을 쓴다.
 * `getAxiosErrorMessage`의 B020 기본 문구("존재하지 않는 스케줄입니다.")는 충돌과 맞지 않아 충돌에는 쓰지 않는다.
 * 그 밖의 오류는 `getAxiosErrorMessage` 결과를 그대로 따른다.
 */
export function getUserSubstituteActionErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isUserSubstituteConflictError(error)) {
    return getApiErrorInfo(error).message ?? fallback
  }
  return getAxiosErrorMessage(error, fallback)
}
