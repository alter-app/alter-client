import { describe, expect, it } from 'vitest'
import {
  formatContactDisplay,
  isValidContact,
  pickFieldErrorMessage,
  toContactPayload,
} from '@/features/store-register/lib/contact'

describe('contact', () => {
  it('서버 규칙과 같게 검증한다', () => {
    expect(isValidContact('010-1234-5678')).toBe(true)
    expect(isValidContact('02-123-4567')).toBe(true)
    expect(isValidContact('021234567')).toBe(true)
    expect(isValidContact('12345678')).toBe(false)
    expect(isValidContact('01012')).toBe(false)
    expect(isValidContact('')).toBe(false)
  })
  it('전송값은 숫자만, 앞 0 유지', () => {
    expect(toContactPayload('010-1234-5678')).toBe('01012345678')
  })
  it('하이픈 유무와 관계없이 같은 형식으로 표시한다', () => {
    expect(formatContactDisplay('01012345678')).toBe('010-1234-5678')
    expect(formatContactDisplay('010-1234-5678')).toBe('010-1234-5678')
    expect(formatContactDisplay(null)).toBe('')
  })
  it('contact 필드 오류만 뽑는다', () => {
    expect(
      pickFieldErrorMessage(
        [
          { field: 'contact', message: 'a' },
          { field: 'brn', message: 'b' },
          { field: 'contact', message: 'c' },
        ],
        'contact'
      )
    ).toBe('a\nc')
    expect(pickFieldErrorMessage(null, 'contact')).toBeNull()
  })
})
