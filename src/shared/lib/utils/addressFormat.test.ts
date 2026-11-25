import { describe, expect, it } from 'vitest'
import {
  formatAddress,
  formatJibunAddress,
} from '@/shared/lib/utils/addressFormat'

describe('addressFormat', () => {
  it('상세 주소가 null 이어도 빈 값·"null" 없이 표시', () => {
    expect(
      formatAddress({
        fullAddress: '서울 강남구 테헤란로 1',
        detailAddress: null,
      })
    ).toBe('서울 강남구 테헤란로 1')
    expect(formatAddress({ fullAddress: '서울', detailAddress: '3층' })).toBe(
      '서울 3층'
    )
    expect(formatJibunAddress({ jibunAddress: null })).toBe('')
  })
})
