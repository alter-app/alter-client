import axios from 'axios'

import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import type { ErrorResponse } from '@/shared/types/common'

const CHAT_ERROR_MESSAGES: Record<string, string> = {
  B030: '채팅방을 찾을 수 없어요.',
  B031: '이 채팅방에 참여할 수 없어요.',
  B032: '메시지를 보낼 수 없는 채팅방이에요.',
}

export function resolveChatErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const code = (error.response?.data as ErrorResponse | undefined)?.code
    if (code && CHAT_ERROR_MESSAGES[code]) {
      return CHAT_ERROR_MESSAGES[code]
    }
  }
  return getAxiosErrorMessage(error, fallback)
}
