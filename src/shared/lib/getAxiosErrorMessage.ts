import axios from 'axios'
import type { ErrorResponse } from '@/shared/types/common'

const FALLBACK_CODES: Record<string, string> = {
  INVALID_FILE: '유효하지 않은 파일입니다.',
  FILE_NOT_FOUND: '존재하지 않는 파일입니다.',
  FILE_ALREADY_ATTACHED: '이미 연결된 파일입니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
}

export function getAxiosErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const raw = error.response?.data as Partial<ErrorResponse> | undefined
    const code = raw?.code
    if (code && FALLBACK_CODES[code]) {
      return FALLBACK_CODES[code]
    }
    if (typeof raw?.message === 'string' && raw.message) return raw.message
    if (
      typeof error.message === 'string' &&
      error.message !== 'Network Error'
    ) {
      return error.message
    }
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
