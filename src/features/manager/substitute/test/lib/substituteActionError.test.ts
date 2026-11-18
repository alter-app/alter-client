import { describe, expect, it } from 'vitest'

import {
  SUBSTITUTE_APPROVE_CONFLICT_MESSAGE,
  getSubstituteActionErrorMessage,
  isSubstituteApproveConflict,
} from '../../lib/substituteActionError'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

describe('대타 승인·거절 오류 문구', () => {
  it('409 B020은 승인 시점 시간 충돌로 안내한다', () => {
    const error = axiosError(409, {
      code: 'B020',
      message: '수락한 근무자가 이미 해당 시간대에 근무 스케줄이 있습니다.',
      data: null,
    })

    expect(isSubstituteApproveConflict(error)).toBe(true)
    expect(getSubstituteActionErrorMessage(error)).toBe(
      SUBSTITUTE_APPROVE_CONFLICT_MESSAGE
    )
  })

  it('404 B020은 존재하지 않는 요청으로 안내한다', () => {
    const error = axiosError(404, { code: 'B020' })

    expect(isSubstituteApproveConflict(error)).toBe(false)
    expect(getSubstituteActionErrorMessage(error)).toBe(
      '존재하지 않는 대타 요청입니다.'
    )
  })

  it('B001·A002는 기존 문구를 유지한다', () => {
    expect(
      getSubstituteActionErrorMessage(axiosError(400, { code: 'B001' }))
    ).toBe('이미 처리되었거나 승인/거절할 수 없는 상태입니다.')
    expect(
      getSubstituteActionErrorMessage(axiosError(403, { code: 'A002' }))
    ).toBe('관리 중인 업장이 아닙니다.')
  })

  it('알 수 없는 오류는 기본 문구를 보여준다', () => {
    expect(getSubstituteActionErrorMessage(new Error('boom'))).toBe(
      '처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
    )
  })
})
