import { describe, expect, it } from 'vitest'

import {
  getTooManyRequestsMessage,
  isTooManyRequestsError,
} from './tooManyRequestsError'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

describe('요청 과다(429 E001) 판별', () => {
  it('429 E001이면 요청 과다로 본다', () => {
    expect(isTooManyRequestsError(axiosError(429, { code: 'E001' }))).toBe(true)
  })

  it('상태나 코드 중 하나만 맞으면 요청 과다가 아니다', () => {
    expect(isTooManyRequestsError(axiosError(429, { code: 'B001' }))).toBe(
      false
    )
    expect(isTooManyRequestsError(axiosError(400, { code: 'E001' }))).toBe(
      false
    )
    expect(isTooManyRequestsError(new Error('Network Error'))).toBe(false)
  })

  it('서버 message를 그대로 보여준다', () => {
    expect(
      getTooManyRequestsMessage(
        axiosError(429, {
          code: 'E001',
          message: '요청이 많아요. 다시 시도해 주세요.',
        })
      )
    ).toBe('요청이 많아요. 다시 시도해 주세요.')
  })

  it('서버 message가 비어 있으면 서버의 E001 문구를 보여준다', () => {
    expect(
      getTooManyRequestsMessage(axiosError(429, { code: 'E001', message: '' }))
    ).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
  })
})
