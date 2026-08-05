import axios from 'axios'

import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { parseErrorResponse } from '@/shared/lib/utils/errorUtils'
import type { ErrorResponse } from '@/shared/types/common'
import type { PostingFormErrors } from '@/features/manager/posting/types/posting'

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

const POSTING_FORM_FIELDS = new Set<keyof PostingFormErrors>([
  'workspaceId',
  'title',
  'schedules',
  'paymentType',
  'payAmount',
  'description',
])

export function resolvePostingFormError(
  error: unknown,
  fallback: string
): { fieldErrors: PostingFormErrors; message: string | null } {
  if (!axios.isAxiosError(error)) {
    return {
      fieldErrors: {},
      message: resolvePostingErrorMessage(error, fallback),
    }
  }

  const { fieldErrors: rawFieldErrors } = parseErrorResponse(
    error.response?.data
  )
  const fieldErrors: PostingFormErrors = {}
  let hasUnknownField = false

  for (const [field, message] of Object.entries(rawFieldErrors)) {
    const rootField = field.split(/[.[\]]/, 1)[0]
    if (POSTING_FORM_FIELDS.has(rootField as keyof PostingFormErrors)) {
      fieldErrors[rootField as keyof PostingFormErrors] = message
    } else {
      hasUnknownField = true
    }
  }

  const hasKnownField = Object.keys(fieldErrors).length > 0
  return {
    fieldErrors,
    message:
      hasKnownField && !hasUnknownField
        ? null
        : resolvePostingErrorMessage(error, fallback),
  }
}
