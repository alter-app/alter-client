import { colors, fontFamilies, fontSizes, fontWeights } from '@/shared/lib/tokens'

export function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    // TODO: 카카오 로그인 구현
    console.log('카카오 로그인')
  }

  return (
    <button
      onClick={handleKakaoLogin}
      style={{
        width: '100%',
        height: '56px',
        border: 'none',
        background: '#FEE500',
        color: '#000000',
        fontSize: fontSizes[4],
        fontFamily: fontFamilies.pretendard,
        fontWeight: fontWeights.semibold,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      카카오로 로그인
    </button>
  )
}

