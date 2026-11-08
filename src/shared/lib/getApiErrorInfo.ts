import axios from 'axios'

import type { ErrorResponse } from '@/shared/types/common'

export interface ApiErrorInfo {
  status?: number
  code?: string
  message?: string
}

/**
 * axios 오류에서 HTTP 상태·서버 오류 코드·서버 메시지를 꺼낸다.
 * 분기는 `status`와 `code`로 하고, `message`는 안내 문구로만 쓴다(경로마다 문구가 다르다).
 * axios 오류가 아니면 빈 객체를 돌려준다.
 */
export function getApiErrorInfo(error: unknown): ApiErrorInfo {
  if (!axios.isAxiosError(error)) return {}
  const data = error.response?.data as ErrorResponse | null | undefined
  const message =
    typeof data?.message === 'string' && data.message.trim() !== ''
      ? data.message
      : undefined
  return {
    status: error.response?.status,
    code: typeof data?.code === 'string' ? data.code : undefined,
    message,
  }
}

export function isApiError(
  error: unknown,
  status: number,
  code: string
): boolean {
  const info = getApiErrorInfo(error)
  return info.status === status && info.code === code
}
