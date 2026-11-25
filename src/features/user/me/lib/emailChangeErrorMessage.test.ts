import { describe, expect, it } from 'vitest'

import { getEmailChangeErrorMessage } from './emailChangeErrorMessage'

const FALLBACK = '이메일 등록/변경에 실패했습니다.'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

describe('getEmailChangeErrorMessage', () => {
  it.each([
    [400, 'A004'],
    [409, 'B020'],
    [429, 'E001'],
  ])(
    '%i %s도 서버 message가 있으면 코드별 문구보다 먼저 쓴다',
    (status, code) => {
      expect(
        getEmailChangeErrorMessage(
          axiosError(status, { code, message: '서버가 보낸 안내' }),
          FALLBACK
        )
      ).toBe('서버가 보낸 안내')
    }
  )

  it('message 없는 400 A004는 이미 가입된 이메일 안내를 쓴다', () => {
    expect(
      getEmailChangeErrorMessage(axiosError(400, { code: 'A004' }), FALLBACK)
    ).toBe('이미 가입된 이메일입니다.')
  })

  it('message 없는 409 B020은 스케줄 문구가 아니라 현재 이메일과 같다는 안내를 쓴다', () => {
    expect(
      getEmailChangeErrorMessage(
        axiosError(409, { code: 'B020', message: '' }),
        FALLBACK
      )
    ).toBe('현재 등록된 이메일과 동일합니다.')
  })

  it('message 없는 429 E001은 재요청 대기 안내를 쓴다', () => {
    expect(
      getEmailChangeErrorMessage(axiosError(429, { code: 'E001' }), FALLBACK)
    ).toBe('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
  })

  it('이메일 흐름에 없는 코드는 공통 코드표 문구를 쓴다', () => {
    expect(
      getEmailChangeErrorMessage(axiosError(400, { code: 'B001' }), FALLBACK)
    ).toBe('잘못된 요청입니다.')
  })

  it('응답이 없는 네트워크 오류는 화면 기본 문구를 쓴다', () => {
    expect(
      getEmailChangeErrorMessage(
        { isAxiosError: true, message: 'Network Error' },
        FALLBACK
      )
    ).toBe(FALLBACK)
  })
})
