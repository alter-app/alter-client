import { describe, expect, it } from 'vitest'

import { resolveApplyPostingError } from '../../lib/applyPostingError'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

describe('공고 지원 오류', () => {
  it.each([
    '이미 지원한 공고입니다.',
    '모집이 종료된 공고입니다.',
    '삭제된 근무일정입니다.',
  ])('서버 메시지 %s를 표시한다', message => {
    expect(
      resolveApplyPostingError(axiosError(400, { code: 'B001', message }))
    ).toEqual({ message, retryable: false })
  })

  it('근무 중인 업장 지원 거부를 명확히 안내한다', () => {
    expect(
      resolveApplyPostingError(
        axiosError(400, { code: 'B018', message: '잘못된 요청입니다.' })
      )
    ).toEqual({
      message: '이미 근무 중인 업장에는 지원할 수 없어요.',
      retryable: false,
      blocked: true,
    })
  })

  it('HTTP 429를 재시도 가능한 오류로 분류한다', () => {
    expect(
      resolveApplyPostingError(
        axiosError(429, {
          code: 'E001',
          message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        })
      )
    ).toEqual({
      message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      retryable: true,
    })
  })

  it('E001 코드를 재시도 가능한 오류로 분류한다', () => {
    expect(
      resolveApplyPostingError(
        axiosError(400, {
          code: 'E001',
          message: '잠시 후 다시 시도해 주세요.',
        })
      ).retryable
    ).toBe(true)
  })
})
