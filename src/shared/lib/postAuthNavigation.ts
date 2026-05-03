import type { NavigateFunction } from 'react-router-dom'

import { ROUTES } from '@/shared/constants/routes'

import { homePathForScope, type AuthScope } from './homePath'

/**
 * 로그인·회원가입 직후 이동 경로.
 * - `from`이 없거나 로그인 페이지면 역할에 맞는 홈으로 보냄
 * - 홈 경로가 저장돼 있으면 역할에 맞는 홈으로 정규화(잘못된 역할 홈으로의 복귀 방지)
 * - 그 외 내부 경로는 그대로 복귀
 */
export function resolvePostAuthPath(
  scope: AuthScope,
  from?: string | null
): string {
  const home = homePathForScope(scope)
  if (!from || from === ROUTES.AUTH.LOGIN) return home
  if (!from.startsWith('/')) return home
  if (from === ROUTES.USER.HOME || from === ROUTES.MANAGER.HOME) return home
  return from
}

/** 로그인·회원가입 직후 `resolvePostAuthPath`로 계산한 경로로 `replace` 이동 */
export function navigatePostAuth(
  scope: AuthScope,
  navigate: NavigateFunction,
  options?: { redirectFrom?: string | null }
): void {
  navigate(resolvePostAuthPath(scope, options?.redirectFrom), {
    replace: true,
  })
}
