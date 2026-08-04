import axios from 'axios'

import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import type { ErrorResponse } from '@/shared/types/common'

export interface ApplyPostingError {
  message: string
  retryable: boolean
}

export function resolveApplyPostingError(error: unknown): ApplyPostingError {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as ErrorResponse | undefined
    const retryable =
      error.response?.status === 429 || response?.code === 'E001'

    if (retryable) {
      return {
        message:
          response?.message ??
          '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
        retryable: true,
      }
    }
  }

  return {
    message: getAxiosErrorMessage(error, '지원에 실패했습니다.'),
    retryable: false,
  }
}
