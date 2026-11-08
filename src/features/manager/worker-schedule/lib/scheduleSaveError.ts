import {
  CreatedScheduleNotFoundError,
  ScheduleAssignPendingError,
} from '@/features/manager/worker-schedule/lib/saveGeneralWorkerSchedule'
import { getApiErrorInfo, isApiError } from '@/shared/lib/getApiErrorInfo'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

const SAVE_FAILED = '저장에 실패했습니다.'
const GENERAL_CONFLICT =
  '근무 시간이 올바르지 않거나 같은 시간대에 이미 배정된 근무가 있어요. 시간을 확인해 주세요.'
const RETRY_WITH_OTHER_TIME = '시간을 바꿔 다시 저장해 주세요.'
const ASSIGN_FAILED = `근무자를 배정하지 못했어요. ${RETRY_WITH_OTHER_TIME}`
const FIXED_CONFLICT =
  '겹치는 고정 근무 시간이 있어요. 요일이나 시간을 확인해 주세요.'
const FIXED_INVALID = '근무 시간을 확인해 주세요.'

function generalReason(error: unknown): string {
  if (isApiError(error, 400, 'B001')) {
    return getApiErrorInfo(error).message ?? GENERAL_CONFLICT
  }
  return getAxiosErrorMessage(error, SAVE_FAILED)
}

function withSentenceEnd(text: string): string {
  const trimmed = text.trim()
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function assignPendingMessage(cause: unknown): string {
  const { message } = getApiErrorInfo(cause)
  if (!message) return ASSIGN_FAILED
  return `${withSentenceEnd(message)} ${RETRY_WITH_OTHER_TIME}`
}

export function resolveGeneralScheduleSaveError(error: unknown): string {
  if (error instanceof ScheduleAssignPendingError) {
    return assignPendingMessage(error.cause)
  }
  if (error instanceof CreatedScheduleNotFoundError) {
    return SAVE_FAILED
  }
  return generalReason(error)
}

export function resolveFixedScheduleSaveError(error: unknown): string {
  const { message } = getApiErrorInfo(error)
  if (isApiError(error, 409, 'B020')) {
    return message ?? FIXED_CONFLICT
  }
  if (isApiError(error, 400, 'B001')) {
    return message ?? FIXED_INVALID
  }
  return getAxiosErrorMessage(error, SAVE_FAILED)
}
