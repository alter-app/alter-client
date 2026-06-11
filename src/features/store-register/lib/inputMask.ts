/** 사업자등록번호 마스킹 — 000-00-00000 (숫자 10자리) */
export function maskBrn(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const parts: string[] = []
  parts.push(digits.slice(0, 3))
  if (digits.length > 3) parts.push(digits.slice(3, 5))
  if (digits.length > 5) parts.push(digits.slice(5, 10))
  return parts.filter(Boolean).join('-')
}

/** 연락처 마스킹 — 숫자만, 하이픈 포함 최대 13자 (휴대폰·유선 공용) */
export function maskContact(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits

  // 02 지역번호(서울) 처리
  if (digits.startsWith('02')) {
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    if (digits.length <= 9)
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
  }

  // 휴대폰·일반 지역번호(3자리)
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 10)
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}
