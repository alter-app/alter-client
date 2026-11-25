import { describe, expect, it } from 'vitest'
import { extractInviteFailures } from '@/features/manager/workspace-invite/lib/inviteSendError'

describe('extractInviteFailures', () => {
  it('번호별 사유를 만든다', () => {
    const lines = extractInviteFailures([
      {
        phoneNumber: '01012345678',
        reason: { value: 'ALREADY_WORKING', description: 'x' },
      },
      {
        phoneNumber: '01099998888',
        reason: { value: 'NEW', description: '새 사유' },
      },
    ])
    expect(lines[0]).toEqual({
      phoneNumber: '010-1234-5678',
      message: '이미 근무 중이에요',
    })
    expect(lines[1].message).toBe('새 사유')
  })
  it('이전 문자열 배열 형태는 무시한다', () => {
    expect(extractInviteFailures(['01012345678'])).toEqual([])
  })
})
