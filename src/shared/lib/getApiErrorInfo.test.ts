import { describe, expect, it } from 'vitest'

import { getApiErrorInfo, isApiError } from './getApiErrorInfo'

function axiosError(status: number | undefined, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: status === undefined ? undefined : { status, data },
  }
}

describe('getApiErrorInfo', () => {
  it('HTTP 상태·코드·메시지를 꺼낸다', () => {
    expect(
      getApiErrorInfo(
        axiosError(409, {
          timestamp: '2026-10-14T12:00:00',
          code: 'B020',
          message: '수락한 근무자가 이미 해당 시간대에 근무 스케줄이 있습니다.',
          data: null,
        })
      )
    ).toEqual({
      status: 409,
      code: 'B020',
      message: '수락한 근무자가 이미 해당 시간대에 근무 스케줄이 있습니다.',
    })
  })

  it('빈 메시지는 없는 것으로 본다', () => {
    expect(
      getApiErrorInfo(axiosError(400, { code: 'B001', message: ' ' }))
    ).toEqual({ status: 400, code: 'B001', message: undefined })
  })

  it('응답이 없는 네트워크 오류는 상태·코드가 없다', () => {
    expect(getApiErrorInfo(axiosError(undefined, undefined))).toEqual({
      status: undefined,
      code: undefined,
      message: undefined,
    })
  })

  it('axios 오류가 아니면 빈 객체를 돌려준다', () => {
    expect(getApiErrorInfo(new Error('boom'))).toEqual({})
    expect(getApiErrorInfo(null)).toEqual({})
  })
})

describe('isApiError', () => {
  it('상태와 코드가 모두 같을 때만 참이다', () => {
    const conflict = axiosError(409, { code: 'B020' })
    expect(isApiError(conflict, 409, 'B020')).toBe(true)
    expect(isApiError(conflict, 404, 'B020')).toBe(false)
    expect(isApiError(axiosError(404, { code: 'B020' }), 409, 'B020')).toBe(
      false
    )
  })
})
