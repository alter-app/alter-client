/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom breakpoints
      screens: {
        xs: '360px',
        sm: '480px',
      },
      // Colors
      colors: {
        // 오류
        error: '#dc0000',
        // 배경색
        'bg-light': '#f4f4f4',
        'bg-dark': '#efefef',
        // 텍스트 색상
        text: {
          100: '#232323',
          90: '#5f5f5f',
          70: '#828282',
          50: '#a3a3a3',
        },
        // 라인 색상
        line: {
          1: '#e5e5e5',
          2: '#c3c3c3',
          3: '#232323',
        },
        // Main 색상
        main: {
          DEFAULT: '#07c079',
          900: '#20c686',
          700: '#51d3a1',
          500: '#83dfbc',
          300: '#b5ecd7',
          100: '#e6f9f2',
        },
        // Sub 색상
        sub: {
          DEFAULT: '#0f7745',
          900: '#278558',
        },
        subBlue: '#003BDC',
      },
      // Font Families
      fontFamily: {
        rixyeoljeongdo: [
          'RixYeoljeongdo_Pro',
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'system-ui',
          'sans-serif',
        ],
        pretendard: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'system-ui',
          'sans-serif',
        ],
      },
      // Font Sizes
      fontSize: {
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
      },
      // Line Heights
      lineHeight: {
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
      },
      // Letter Spacing
      letterSpacing: {
        0: '-0.01em', // -1%
        1: '0', // 0%
      },
      // Font Weights
      fontWeight: {
        regular: '400',
        semibold: '600',
      },
    },
  },
  plugins: [],
}
