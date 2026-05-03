import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fontFamilies, fontSizes, fontWeights } from '@/shared/lib/tokens'
import {
  getKakaoOAuthRedirectUri,
  requestFreshKakaoAuthorizationCode,
} from '@/shared/lib/socialLogin'
import { loginSocial } from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'

import type { AuthNavigateOptions } from '@/shared/api/auth'

interface KakaoLoginButtonProps {
  /** 로그인 성공 후 복귀할 경로 (`location.state.from` 등) */
  redirectFrom?: AuthNavigateOptions['redirectFrom']
}

export function KakaoLoginButton({ redirectFrom }: KakaoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true)

      const authorizationCode = await requestFreshKakaoAuthorizationCode()

      await loginSocial(
        {
          provider: 'KAKAO',
          authorizationCode,
          redirectUri: getKakaoOAuthRedirectUri(),
          platformType: 'WEB',
        },
        setAuth,
        navigate,
        { redirectFrom }
      )
    } catch (error: unknown) {
      console.error('카카오 로그인 실패:', error)
      const apiError = error as {
        data?: { code?: string }
        message?: string
      }

      // B011 에러는 회원가입 페이지로 리다이렉트되므로 alert 표시하지 않음
      if (apiError?.data?.code === 'B011') {
        // 회원가입 페이지로 이동 (이미 navigate에서 처리됨)
        return
      }

      alert(apiError.message || '카카오 로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={isLoading}
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
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? '로그인 중...' : '카카오로 로그인'}
    </button>
  )
}
