import axios from 'axios'

import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import type { ErrorResponse } from '@/shared/types/common'

const POSTING_ERROR_MESSAGES: Record<string, string> = {
  B007: '존재하지 않는 공고예요.',
  B012: '지원 정보를 찾을 수 없어요.',
  B017: '이미 처리된 지원서예요.',
  B018: '이미 근무 중인 사용자예요.',
  B019: '수정할 근무일정을 찾을 수 없어요.',
  B020: '상태를 변경할 수 없는 공고예요.',
}

export function resolvePostingErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const code = (error.response?.data as ErrorResponse | undefined)?.code
    if (code && POSTING_ERROR_MESSAGES[code]) {
      return POSTING_ERROR_MESSAGES[code]
    }
  }
  return getAxiosErrorMessage(error, fallback)
}
