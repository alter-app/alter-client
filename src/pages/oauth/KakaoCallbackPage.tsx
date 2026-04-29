import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginSocial } from '@/shared/api/auth'
import { getKakaoOAuthRedirectUri } from '@/shared/lib/socialLogin'
import useAuthStore from '@/shared/stores/useAuthStore'

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'

/**
 * 카카오 OAuth 리다이렉트 URI (브라우저 주소창에 ?code= 로 돌아옴)
 * — 인가 코드를 액세스 토큰으로 교환한 뒤 서버 로그인 또는 부모 창(postMessage)으로 전달
 */
export function KakaoCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [status, setStatus] = useState<'pending' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const code = searchParams.get('code')
    const oauthError = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    async function complete() {
      if (oauthError) {
        setStatus('error')
        setErrorMessage(
          errorDescription
            ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
            : oauthError === 'access_denied'
              ? '카카오 로그인이 취소되었습니다.'
              : '카카오 로그인에 실패했습니다.'
        )
        return
      }

      if (!code) {
        setStatus('error')
        setErrorMessage('인가 코드가 없습니다.')
        return
      }

      const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
      if (!clientId) {
        setStatus('error')
        setErrorMessage('카카오 REST API 키(VITE_KAKAO_REST_API_KEY)가 없습니다.')
        return
      }

      const redirectUri = getKakaoOAuthRedirectUri()

      try {
        const body = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
        })

        const res = await fetch(KAKAO_TOKEN_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          body,
        })

        const raw = await res.text()
        if (!res.ok) {
          console.error('Kakao /oauth/token:', res.status, raw)
          setStatus('error')
          setErrorMessage('카카오 토큰 발급에 실패했습니다.')
          return
        }

        let data: { access_token?: string; refresh_token?: string }
        try {
          data = JSON.parse(raw) as typeof data
        } catch {
          setStatus('error')
          setErrorMessage('카카오 응답을 처리할 수 없습니다.')
          return
        }

        const accessToken = data.access_token
        if (!accessToken) {
          setStatus('error')
          setErrorMessage('액세스 토큰을 받지 못했습니다.')
          return
        }

        const refreshToken = data.refresh_token

        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: 'alter-kakao-oauth',
              accessToken,
              refreshToken,
            },
            window.location.origin
          )
          window.close()
          return
        }

        await loginSocial(
          {
            provider: 'KAKAO',
            oauthToken: {
              accessToken,
              refreshToken,
            },
            platformType: 'WEB',
          },
          setAuth,
          navigate
        )
      } catch (e) {
        console.error(e)
        setStatus('error')
        setErrorMessage('로그인 처리 중 오류가 발생했습니다.')
      }
    }

    void complete()
  }, [searchParams, navigate, setAuth])

  if (status === 'error') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-sm text-neutral-700">{errorMessage}</p>
        <button
          type="button"
          className="rounded-xl bg-main px-6 py-3 font-pretendard font-semibold text-white"
          onClick={() => navigate('/login', { replace: true })}
        >
          로그인으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <p className="text-center text-sm text-neutral-600">로그인 처리 중...</p>
    </div>
  )
}
