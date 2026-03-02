/**
 * 디자인 토큰 타입 정의
 */

// 색상 토큰
export const colors = {
  error: '#dc0000',
  bgLight: '#f4f4f4',
  bgDark: '#efefef',
  text: {
    100: '#232323',
    90: '#5f5f5f',
    70: '#828282',
    50: '#a3a3a3',
  },
  line: {
    1: '#f1f1f1',
    2: '#e5e5e5',
    3: '#232323',
  },
  main: {
    DEFAULT: '#2ce283',
    700: '#6ceba9',
    500: '#96f1c1',
    300: '#c0f7da',
    100: '#eafdf3',
  },
  sub: {
    DEFAULT: '#3a9982',
    900: '#4ea48f',
    700: '#76b8a8',
    500: '#9dccc1',
    300: '#c4e1da',
  },
} as const

// 폰트 패밀리
export const fontFamilies = {
  rixyeoljeongdo: 'RixYeoljeongdo_Pro',
  pretendard: 'Pretendard',
} as const

// 폰트 사이즈
export const fontSizes = {
  0: '11px',
  1: '12px',
  2: '13px',
  3: '14px',
  4: '16px',
  5: '18px',
  6: '20px',
  7: '22px',
  8: '28px',
  9: '32px',
} as const

// 라인 높이
export const lineHeights = {
  0: '140%',
  1: '140%',
  2: '140%',
  3: '140%',
  4: '140%',
  5: '140%',
  6: '140%',
  7: '140%',
  8: '140%',
  9: '140%',
  10: '140%',
  11: '140%',
  12: '100%',
  13: '100%',
  14: '100%',
} as const

// 레터 스페이싱
export const letterSpacing = {
  0: '-0.01em',
  1: '0',
} as const

// 폰트 웨이트
export const fontWeights = {
  regular: 400,
  semibold: 600,
} as const

// 타이포그래피 스타일
export const typography = {
  display: {
    fontFamily: fontFamilies.rixyeoljeongdo,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[9],
    letterSpacing: letterSpacing[0],
  },
  headline01: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[7],
    letterSpacing: letterSpacing[0],
  },
  headline02: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[6],
    letterSpacing: letterSpacing[0],
  },
  headline03: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[5],
    letterSpacing: letterSpacing[0],
  },
  body01Semibold: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[4],
    letterSpacing: letterSpacing[0],
  },
  body01Regular: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[4],
    letterSpacing: letterSpacing[0],
  },
  body02Semibold: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[3],
    letterSpacing: letterSpacing[0],
  },
  body02Regular: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[3],
    letterSpacing: letterSpacing[0],
  },
  body03Semibold: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[2],
    letterSpacing: letterSpacing[0],
  },
  body03Regular: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[2],
    letterSpacing: letterSpacing[0],
  },
  bt: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[3],
    letterSpacing: letterSpacing[0],
  },
  bg: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights[0],
    fontSize: fontSizes[0],
    letterSpacing: letterSpacing[0],
  },
  doc: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[12],
    fontSize: fontSizes[1],
    letterSpacing: letterSpacing[0],
  },
  docNon: {
    fontFamily: fontFamilies.pretendard,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[12],
    fontSize: fontSizes[1],
    letterSpacing: letterSpacing[0],
  },
  logo: {
    fontFamily: fontFamilies.rixyeoljeongdo,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[12],
    fontSize: fontSizes[8],
    letterSpacing: letterSpacing[1],
  },
} as const
