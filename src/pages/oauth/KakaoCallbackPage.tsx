import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginSocial } from '@/shared/api/auth'
import {
  decodeKakaoOauthState,
  getKakaoOAuthRedirectUri,
} from '@/shared/lib/socialLogin'
import useAuthStore from '@/shared/stores/useAuthStore'

/**
 * 카카오 OAuth 리다이렉트 URI (?code=)
 *
 * 인가 코드는 카카오에서 1회만 유효합니다. 브라우저에서 먼저 /oauth/token 으로
 * 교환하면 서버가 같은 코드로 검증할 때 A010(만료)이 납니다.
 * → 클라이언트에서는 교환하지 않고 code만 백엔드(login-social / signup-social)로 넘깁니다.
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
    const state = searchParams.get('state')
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

      try {
        if (window.opener && !window.opener.closed) {
          const parsedState = decodeKakaoOauthState(state)
          const targetOrigin = parsedState?.openerOrigin ?? window.location.origin
          window.opener.postMessage(
            {
              type: 'alter-kakao-oauth',
              authorizationCode: code,
              state,
            },
            targetOrigin
          )
          window.close()
          return
        }

        await loginSocial(
          {
            provider: 'KAKAO',
            authorizationCode: code,
            redirectUri: getKakaoOAuthRedirectUri(),
            platformType: 'WEB',
          },
          setAuth,
          navigate
        )
      } catch (e) {
        console.error(e)
        const err = e as { message?: string }
        setStatus('error')
        setErrorMessage(err.message || '로그인 처리 중 오류가 발생했습니다.')
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
