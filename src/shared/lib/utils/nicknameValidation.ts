export const NICKNAME_GUIDE_MESSAGE =
  '닉네임은 2–10자의 완성형 한글, 영문, 숫자만 사용할 수 있습니다.'

export const isNicknameFormatValid = (value: string): boolean =>
  value.length >= 2 && value.length <= 10 && !/[^가-힣a-zA-Z0-9]/.test(value)
