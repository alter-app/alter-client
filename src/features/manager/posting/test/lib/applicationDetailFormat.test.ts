import { describe, expect, it } from 'vitest'

import {
  formatApplicantBirthDate,
  formatApplicantPhoneNumber,
  formatCertificateAcquiredMonth,
} from '../../lib/applicationDetailFormat'

describe('지원자 상세 정보 포맷', () => {
  it.each([
    ['1997-03-21', '1997.03.21'],
    ['19970321', '1997.03.21'],
  ])('생년월일 %s를 %s로 표시한다', (value, expected) => {
    expect(formatApplicantBirthDate(value)).toBe(expected)
  })

  it.each([
    ['01012345678', '010-1234-5678'],
    ['010-1234-5678', '010-1234-5678'],
    ['0212345678', '02-1234-5678'],
    ['02-1234-5678', '02-1234-5678'],
  ])('전화번호 %s를 %s로 표시한다', (value, expected) => {
    expect(formatApplicantPhoneNumber(value)).toBe(expected)
  })

  it.each([
    ['2024-07-15', '2024.07'],
    ['202407', '2024.07'],
  ])('자격증 취득일 %s를 %s로 표시한다', (value, expected) => {
    expect(formatCertificateAcquiredMonth(value)).toBe(expected)
  })

  it('지원하지 않는 값은 원본을 유지한다', () => {
    expect(formatApplicantBirthDate('-')).toBe('-')
    expect(formatApplicantPhoneNumber('-')).toBe('-')
    expect(formatCertificateAcquiredMonth('-')).toBe('-')
  })
})
