/** 로그인·회원가입·비밀번호 찾기 등에서 쓰는 기본 이메일 형식 검사 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmailFormat(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}
