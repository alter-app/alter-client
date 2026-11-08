import { format } from 'date-fns'

import { ScheduleAssignPendingError } from '@/features/manager/worker-schedule/lib/saveGeneralWorkerSchedule'
import { getApiErrorInfo } from '@/shared/lib/getApiErrorInfo'

/**
 * 근무는 생성됐지만 근무자 배정이 실패한 근무 ID를 `근무자:날짜` 키로 보관한다.
 * 재저장 시 새 근무를 만들지 않고 이 근무에 배정해야 중복 생성을 막을 수 있다.
 */
export type PendingAssignShifts = Readonly<Record<string, number>>

export function pendingAssignKey(workerId: number, date: Date): string {
  return `${workerId}:${format(date, 'yyyy-MM-dd')}`
}

export function pendingAssignShiftIdFor(
  pending: PendingAssignShifts,
  key: string | null
): number | null {
  return key === null ? null : (pending[key] ?? null)
}

function withoutKey(
  pending: PendingAssignShifts,
  key: string
): PendingAssignShifts {
  if (!(key in pending)) return pending
  const next = { ...pending }
  delete next[key]
  return next
}

/**
 * 저장한 키와, 방금 배정된 근무를 가리키는 다른 키를 함께 지운다.
 * 다른 근무자의 저장이 같은 미배정 근무를 가져간 경우 그 기록을 남기면,
 * 원래 근무자 재저장 시 다른 근무자의 근무를 수정·재배정하게 된다.
 */
export function pendingAfterGeneralSaveSuccess(
  pending: PendingAssignShifts,
  key: string,
  savedShiftId: number
): PendingAssignShifts {
  const remaining = Object.entries(pending).filter(
    ([pendingKey, shiftId]) => pendingKey !== key && shiftId !== savedShiftId
  )
  return remaining.length === Object.keys(pending).length
    ? pending
    : Object.fromEntries(remaining)
}

/** 배정 실패면 생성된 근무를 기억하고, 404면 근무가 사라진 것이므로 잊는다. 그 밖의 실패는 그대로 둔다. */
export function pendingAfterGeneralSaveError(
  pending: PendingAssignShifts,
  key: string,
  error: unknown
): PendingAssignShifts {
  if (error instanceof ScheduleAssignPendingError) {
    return { ...pending, [key]: error.shiftId }
  }
  if (getApiErrorInfo(error).status === 404) {
    return withoutKey(pending, key)
  }
  return pending
}
