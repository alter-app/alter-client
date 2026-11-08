import { describe, expect, it } from 'vitest'

import {
  pendingAfterGeneralSaveError,
  pendingAfterGeneralSaveSuccess,
  pendingAssignKey,
  pendingAssignShiftIdFor,
} from '../../lib/pendingAssignShifts'
import { ScheduleAssignPendingError } from '../../lib/saveGeneralWorkerSchedule'

const A = pendingAssignKey(7, new Date(2026, 10, 20))
const B = pendingAssignKey(7, new Date(2026, 10, 21))
const OTHER_WORKER_A = pendingAssignKey(8, new Date(2026, 10, 20))

const assignFailed = (shiftId: number) =>
  new ScheduleAssignPendingError(shiftId, new Error('B001'))

describe('배정 대기 근무 보관', () => {
  it('키는 근무자와 날짜로 만든다', () => {
    expect(A).toBe('7:2026-11-20')
    expect(OTHER_WORKER_A).toBe('8:2026-11-20')
  })

  it('배정이 실패하면 근무자·날짜별로 생성된 근무를 기억한다', () => {
    const afterA = pendingAfterGeneralSaveError({}, A, assignFailed(30))
    const afterB = pendingAfterGeneralSaveError(afterA, B, assignFailed(31))

    expect(pendingAssignShiftIdFor(afterB, A)).toBe(30)
    expect(pendingAssignShiftIdFor(afterB, B)).toBe(31)
  })

  it('다른 날짜에서 저장에 성공해도 다른 날짜의 배정 대기 근무는 남는다', () => {
    const pending = { [A]: 30, [B]: 31 }

    const next = pendingAfterGeneralSaveSuccess(pending, B, 31)

    expect(pendingAssignShiftIdFor(next, A)).toBe(30)
    expect(pendingAssignShiftIdFor(next, B)).toBeNull()
  })

  it('다른 근무자가 같은 근무를 배정받으면 기존 대기 기록도 지운다', () => {
    const pending = { [A]: 30 }

    const next = pendingAfterGeneralSaveSuccess(pending, OTHER_WORKER_A, 30)

    expect(pendingAssignShiftIdFor(next, A)).toBeNull()
    expect(next).toEqual({})
  })

  it('지울 기록이 없으면 같은 객체를 돌려준다', () => {
    const pending = { [A]: 30 }

    expect(pendingAfterGeneralSaveSuccess(pending, B, 31)).toBe(pending)
  })

  it('다른 근무자의 배정 대기 근무와 섞이지 않는다', () => {
    const pending = pendingAfterGeneralSaveError({}, A, assignFailed(30))

    expect(pendingAssignShiftIdFor(pending, OTHER_WORKER_A)).toBeNull()
  })

  it('404면 근무가 사라진 것이므로 해당 키만 잊는다', () => {
    const notFound = {
      isAxiosError: true,
      response: { status: 404, data: { code: 'B019' } },
    }

    const next = pendingAfterGeneralSaveError({ [A]: 30, [B]: 31 }, A, notFound)

    expect(next).toEqual({ [B]: 31 })
  })

  it('네트워크 오류 등 그 밖의 실패는 기억을 유지한다', () => {
    const pending = { [A]: 30 }

    expect(
      pendingAfterGeneralSaveError(pending, A, new Error('Network Error'))
    ).toBe(pending)
  })

  it('날짜가 없으면 배정 대기 근무가 없다', () => {
    expect(pendingAssignShiftIdFor({ [A]: 30 }, null)).toBeNull()
  })
})
