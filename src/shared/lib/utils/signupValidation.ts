// ─── 비밀번호 검증 ─────────────────────────────────────────────────────────────
export const isPasswordValid = (value: string): boolean => {
  const trimmed = value.trim()
  if (trimmed.length < 8) return false
  const hasLetter = /[A-Za-z]/.test(trimmed)
  const hasNumber = /\d/.test(trimmed)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed)
  return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2
}

// ─── 전화번호 포맷 헬퍼 ────────────────────────────────────────────────────────
export const normalizePhone = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 11)

export const formatPhone = (value: string): string => {
  const n = normalizePhone(value)
  if (n.length < 4) return n
  if (n.length < 8) return `${n.slice(0, 3)}-${n.slice(3)}`
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`
}

// ─── 생년월일 포맷 헬퍼 ────────────────────────────────────────────────────────
export const normalizeBirthday = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 8)

// ─── 성별 코드 변환 ────────────────────────────────────────────────────────────
export const getGenderCode = (
  g: '남' | '여' | ''
): 'GENDER_MALE' | 'GENDER_FEMALE' =>
  g === '남' ? 'GENDER_MALE' : 'GENDER_FEMALE'
