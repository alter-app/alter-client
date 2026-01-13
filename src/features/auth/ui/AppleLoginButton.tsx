import { colors, fontFamilies, fontSizes, fontWeights } from '@/shared/lib/tokens'

export function AppleLoginButton() {
  const handleAppleLogin = () => {
    // TODO: 애플 로그인 구현
    console.log('애플 로그인')
  }

  return (
    <button
      onClick={handleAppleLogin}
      style={{
        width: '100%',
        height: '56px',
        border: 'none',
        background: '#000000',
        color: '#ffffff',
        fontSize: fontSizes[4],
        fontFamily: fontFamilies.pretendard,
        fontWeight: fontWeights.semibold,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      Apple로 로그인
    </button>
  )
}

