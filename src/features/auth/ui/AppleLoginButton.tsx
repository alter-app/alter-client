import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fontFamilies,
  fontSizes,
  fontWeights,
} from '@/shared/lib/tokens'
import { loginWithApple } from '@/shared/lib/socialLogin'
import { loginSocial } from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'

export function AppleLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true)

      // 애플 로그인 실행
      const appleResult = await loginWithApple()

      // 서버에 소셜 로그인 요청
      await loginSocial(
        {
          provider: 'APPLE',
          authorizationCode: appleResult.authorizationCode,
          oauthToken: appleResult.accessToken
            ? {
                accessToken: appleResult.accessToken,
                refreshToken: appleResult.refreshToken,
              }
            : undefined,
          platformType: 'WEB',
        },
        setAuth,
        navigate
      )
    } catch (error: unknown) {
      console.error('애플 로그인 실패:', error)
      const apiError = error as {
        data?: { code?: string }
        message?: string
      }

      // B011 에러는 회원가입 페이지로 리다이렉트되므로 alert 표시하지 않음
      if (apiError?.data?.code === 'B011') {
        // 회원가입 페이지로 이동 (이미 navigate에서 처리됨)
        return
      }

      alert(apiError.message || '애플 로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAppleLogin}
      disabled={isLoading}
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
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? '로그인 중...' : 'Apple로 로그인'}
    </button>
  )
}
