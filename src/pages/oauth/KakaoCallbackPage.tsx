import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginSocial } from '@/shared/api/auth'
import {
  decodeKakaoOauthState,
  getKakaoOAuthRedirectUriFromCallbackLocation,
  normalizeKakaoOAuthStateParam,
} from '@/shared/lib/socialLogin'
import { ROUTES } from '@/shared/constants/routes'
import useAuthStore from '@/shared/stores/useAuthStore'

/**
 * React 18 Strict Mode는 마운트→언마운트→재마운트하며 `useRef`가 초기화됩니다.
 * 모듈 스코프 Set만으로는 “첫 요청 성공 후 delete → 두 번째 마운트가 같은 code로 재요청” 경합을 막기 어렵습니다.
 * sessionStorage에 pending/done을 동기 기록해 login-social이 인가 code당 1회만 나가게 합니다.
 */
const kakaoTabOauthSessionKey = (code: string) =>
  `alter:kakao:oauth:tab:${code}`

/**
 * 카카오 OAuth 리다이렉트 URI (?code=)
 *
 * - **팝업**: `window.opener`가 있으면 인가 code만 `postMessage`로 넘기고 닫음.
 *   실제 `loginSocial` 호출은 오프너의 `requestFreshKakaoAuthorizationCode` 리스너(로그인 버튼·가입 플로우)에서 1회 수행.
 * - **전체 탭 리다이렉트**: opener 없음 → 이 페이지에서 `loginSocial` 직접 호출.
 *
 * 인가 코드는 1회용이므로 클라이언트에서 `/oauth/token` 교환하지 않음(A010 방지).
 */
export function KakaoCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const hasHydrated = useAuthStore(s => s.hasHydrated)
  const { setAuth } = useAuthStore()
  const [status, setStatus] = useState<'pending' | 'error' | 'close_hint'>(
    'pending'
  )
  const [errorMessage, setErrorMessage] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const oauthError = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    async function complete() {
      if (oauthError) {
        ran.current = true
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
        ran.current = true
        setStatus('error')
        setErrorMessage('인가 코드가 없습니다.')
        return
      }

      const hasOpener =
        typeof window !== 'undefined' &&
        Boolean(window.opener && !window.opener.closed)

      // 팝업 플로우: persist 재수화를 기다리면 postMessage가 늦거나 영원히 안 나가
      // 부모 창에서만 토큰을 쓰므로 여기서는 hasHydrated 불필요
      if (hasOpener) {
        ran.current = true
        try {
          const stateNormalized = normalizeKakaoOAuthStateParam(state)
          const parsedState = decodeKakaoOauthState(
            stateNormalized || state || null
          )
          const targetOrigin =
            parsedState?.openerOrigin ?? window.location.origin
          window.opener.postMessage(
            {
              type: 'alter-kakao-oauth',
              authorizationCode: code,
              state: stateNormalized || state || '',
              redirectUri: getKakaoOAuthRedirectUriFromCallbackLocation(),
            },
            targetOrigin
          )
          window.close()
          window.setTimeout(() => {
            if (!window.closed) {
              setStatus('close_hint')
            }
          }, 400)
        } catch (e) {
          console.error(e)
          setStatus('error')
          setErrorMessage(
            (e as { message?: string }).message ||
              '로그인 처리 중 오류가 발생했습니다.'
          )
        }
        return
      }

      if (!hasHydrated) return

      const sessionKey = kakaoTabOauthSessionKey(code)
      try {
        const phase = sessionStorage.getItem(sessionKey)
        if (phase === 'done') return
        if (phase === 'pending') return
        sessionStorage.setItem(sessionKey, 'pending')
      } catch {
        /* 세션 스토리지 비허용 등 — 락 없이 진행 */
      }

      ran.current = true
      try {
        await loginSocial(
          {
            provider: 'KAKAO',
            authorizationCode: code,
            redirectUri: getKakaoOAuthRedirectUriFromCallbackLocation(),
            platformType: 'WEB',
          },
          setAuth,
          navigate
        )
        try {
          sessionStorage.setItem(sessionKey, 'done')
        } catch {
          /* noop */
        }
      } catch (e) {
        try {
          sessionStorage.removeItem(sessionKey)
        } catch {
          /* noop */
        }
        console.error(e)
        const err = e as { message?: string }
        setStatus('error')
        setErrorMessage(err.message || '로그인 처리 중 오류가 발생했습니다.')
      }
    }

    void complete()
  }, [hasHydrated, searchParams, navigate, setAuth])

  if (status === 'error') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-sm text-neutral-700">{errorMessage}</p>
        <button
          type="button"
          className="rounded-xl bg-main px-6 py-3 font-pretendard font-semibold text-white"
          onClick={() => navigate(ROUTES.AUTH.LOGIN, { replace: true })}
        >
          로그인으로 돌아가기
        </button>
      </div>
    )
  }

  if (status === 'close_hint') {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-sm text-neutral-700">
          로그인은 <strong>카카오 로그인을 연 원래 창</strong>에서 이어집니다.
          이 탭은 닫히지 않았다면 직접 닫아 주세요.
        </p>
        <button
          type="button"
          className="rounded-xl bg-main px-6 py-3 font-pretendard font-semibold text-white"
          onClick={() => window.close()}
        >
          다시 닫기 시도
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
