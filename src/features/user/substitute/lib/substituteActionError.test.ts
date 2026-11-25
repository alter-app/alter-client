import { describe, expect, it } from 'vitest'

import {
  getUserSubstituteActionErrorMessage,
  isUserSubstituteConflictError,
} from './substituteActionError'

const FALLBACK = '요청 처리에 실패했습니다.'

function axiosError(status: number, data: unknown) {
  return {
    isAxiosError: true,
    message: `Request failed with status code ${status}`,
    response: { status, data },
  }
}

describe('알바생 대타 수락·거절·생성 오류 문구', () => {
  it('409 B020 근무 충돌은 서버 message를 그대로 보여준다', () => {
    const error = axiosError(409, {
      code: 'B020',
      message: '해당 시간대에 이미 다른 근무 일정이 있습니다.',
      data: null,
    })

    expect(isUserSubstituteConflictError(error)).toBe(true)
    expect(getUserSubstituteActionErrorMessage(error, FALLBACK)).toBe(
      '해당 시간대에 이미 다른 근무 일정이 있습니다.'
    )
  })

  it('409 B020에 message가 비면 "존재하지 않는 스케줄입니다." 대신 호출부 기본 문구를 보여준다', () => {
    const error = axiosError(409, { code: 'B020', message: '  ' })

    expect(getUserSubstituteActionErrorMessage(error, FALLBACK)).toBe(FALLBACK)
    expect(
      getUserSubstituteActionErrorMessage(error, '대타 요청에 실패했습니다.')
    ).toBe('대타 요청에 실패했습니다.')
  })

  it('400 B001은 서버 message를 그대로 보여주고, 비면 호출부 기본 문구를 보여준다', () => {
    const withMessage = axiosError(400, {
      code: 'B001',
      message: '이미 처리된 대타 요청입니다.',
    })
    const withoutMessage = axiosError(400, { code: 'B001' })

    expect(isUserSubstituteConflictError(withMessage)).toBe(true)
    expect(getUserSubstituteActionErrorMessage(withMessage, FALLBACK)).toBe(
      '이미 처리된 대타 요청입니다.'
    )
    expect(getUserSubstituteActionErrorMessage(withoutMessage, FALLBACK)).toBe(
      FALLBACK
    )
  })

  it('상태가 다른 B020·B001은 충돌이 아니고 기존 getAxiosErrorMessage 결과를 유지한다', () => {
    const notFound = axiosError(404, { code: 'B020' })
    const conflictB001 = axiosError(409, { code: 'B001' })

    expect(isUserSubstituteConflictError(notFound)).toBe(false)
    expect(isUserSubstituteConflictError(conflictB001)).toBe(false)
    expect(getUserSubstituteActionErrorMessage(notFound, FALLBACK)).toBe(
      '존재하지 않는 스케줄입니다.'
    )
    expect(getUserSubstituteActionErrorMessage(conflictB001, FALLBACK)).toBe(
      '잘못된 요청입니다.'
    )
  })

  it('그 밖의 서버 오류는 서버 message를 보여준다', () => {
    const error = axiosError(403, {
      code: 'A002',
      message: '권한이 없습니다.',
    })

    expect(isUserSubstituteConflictError(error)).toBe(false)
    expect(getUserSubstituteActionErrorMessage(error, FALLBACK)).toBe(
      '권한이 없습니다.'
    )
  })

  it('네트워크 오류처럼 문구를 알 수 없으면 호출부 기본 문구를 보여준다', () => {
    const networkError = { isAxiosError: true, message: 'Network Error' }

    expect(getUserSubstituteActionErrorMessage(networkError, FALLBACK)).toBe(
      FALLBACK
    )
    expect(getUserSubstituteActionErrorMessage(undefined, FALLBACK)).toBe(
      FALLBACK
    )
  })
})
