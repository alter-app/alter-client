const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 16
const HAS_LETTER = /[A-Za-z]/
const HAS_NUMBER = /\d/
const HAS_SPECIAL = /[!@#$%^&*(),.?":{}|<>]/

export function isPasswordFormatValid(value: string): boolean {
  const trimmed = value.trim()
  if (
    trimmed.length < PASSWORD_MIN_LENGTH ||
    trimmed.length > PASSWORD_MAX_LENGTH
  ) {
    return false
  }
  return (
    HAS_LETTER.test(trimmed) &&
    HAS_NUMBER.test(trimmed) &&
    HAS_SPECIAL.test(trimmed)
  )
}

export const PASSWORD_FORMAT_ERROR_MESSAGE =
  '비밀번호는 8~16자, 영문·숫자·특수문자를 모두 포함해야 합니다.'

export const PASSWORD_MISMATCH_ERROR_MESSAGE = '비밀번호가 일치하지 않습니다.'

export function validatePasswordWithConfirm(
  newPassword: string,
  confirmPassword: string
): string {
  const password = newPassword.trim()
  const confirm = confirmPassword.trim()
  if (!isPasswordFormatValid(password)) {
    return PASSWORD_FORMAT_ERROR_MESSAGE
  }
  if (password !== confirm) {
    return PASSWORD_MISMATCH_ERROR_MESSAGE
  }
  return ''
}
