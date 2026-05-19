import type { NavigateFunction } from 'react-router-dom'

/** 등록 라우트가 아님 — `path="*"` catch-all에서 ErrorPage가 렌더됨 */
export const ERROR_PAGE_FALLBACK_PATH = '/error'

export type ErrorPageLocationState = {
  message?: string
  errorCode?: string
}

export function navigateToErrorPage(
  navigate: NavigateFunction,
  state?: ErrorPageLocationState
) {
  navigate(ERROR_PAGE_FALLBACK_PATH, { state, replace: true })
}
