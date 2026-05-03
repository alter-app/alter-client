/**
 * 소셜 로그인 유틸리티 함수
 * 카카오/애플 SDK 연동을 위한 헬퍼 함수
 */

declare global {
  /** index.html 카카오 SDK — `init`·`isInitialized`만 사용 (인가 코드는 OAuth 팝업 플로우) */
  interface KakaoSDK {
    isInitialized: () => boolean
    init: (appKey: string) => void
  }

  interface AppleAuth {
    init: (config: {
      clientId: string
      scope: string
      redirectURI: string
      usePopup: boolean
    }) => void
    signIn: (callback: (response: AppleSignInResponse) => void) => void
  }

  interface AppleSignInResponse {
    authorization?: {
      code: string
      id_token: string
    }
  }

  interface AppleIDSDK {
    auth: AppleAuth
  }

  interface Window {
    Kakao: KakaoSDK
    AppleID: AppleIDSDK
  }
}

export interface SocialLoginResult {
  provider: 'KAKAO' | 'APPLE'
  accessToken?: string
  refreshToken?: string
  authorizationCode?: string
}

/** dev·스테이징 등 alter-app.com 은 HTTPS로 통일 (브라우저가 http로 열려도 authorize redirect_uri 일치) */
function normalizeAlterAppKakaoRedirectToHttps(uri: string): string {
  try {
    const u = new URL(uri)
    if (u.protocol !== 'http:') return uri
    if (!u.hostname.endsWith('alter-app.com')) return uri
    u.protocol = 'https:'
    return u.href.replace(/\/$/, '')
  } catch {
    return uri
  }
}

/**
 * 카카오 로그인·토큰 교환 시 동일해야 함 (카카오 개발자 콘솔 Redirect URI와 일치)
 *
 * `*.alter-app.com` 에서는 **항상 현재 탭 origin**으로 콜백을 만든다.
 * Vite는 `VITE_*`를 빌드 시 박아 넣으므로, Vercel에 env만 추가하고 재배포 전·구버전 번들에는
 * 여전히 http/빈 값이 남을 수 있다. 런타임 분기로 그 경우도 https 콜백과 맞춘다.
 */
export function getKakaoOAuthRedirectUri(): string {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location
    if (hostname.endsWith('alter-app.com')) {
      return normalizeAlterAppKakaoRedirectToHttps(
        `${origin}/oauth/kakao/callback`
      )
    }
  }

  const fromEnv = (
    import.meta.env.VITE_KAKAO_REDIRECT_URI as string | undefined
  )?.trim()
  const base =
    fromEnv ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/oauth/kakao/callback`
      : '')
  return normalizeAlterAppKakaoRedirectToHttps(base)
}

/** KakaoCallbackPage ↔ 오프너(팝업 플로우) postMessage 타입 */
export const KAKAO_OAUTH_MESSAGE_TYPE = 'alter-kakao-oauth'

type KakaoOauthState = {
  nonce: string
  openerOrigin: string
}

/** OAuth 요청 상관관계 검증용 nonce를 생성합니다. */
function createNonce(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** Kakao OAuth state payload를 base64 문자열로 인코딩합니다. */
function encodeKakaoOauthState(payload: KakaoOauthState): string {
  return btoa(JSON.stringify(payload))
}

/** 리다이렉트 URL의 state — 쿼리 파싱 시 base64의 `+`가 공백으로 바뀌는 경우 보정 */
export function normalizeKakaoOAuthStateParam(
  state: string | undefined | null
): string {
  if (state == null || state === '') return ''
  return state.trim().replace(/ /g, '+')
}

/**
 * Kakao OAuth state를 디코딩해 nonce/origin 정보를 복원합니다.
 * 유효하지 않은 값은 null을 반환합니다.
 */
export function decodeKakaoOauthState(
  state?: string | null
): KakaoOauthState | null {
  const normalized = normalizeKakaoOAuthStateParam(state ?? null)
  if (!normalized) return null
  try {
    const decoded = atob(normalized)
    const parsed = JSON.parse(decoded) as Partial<KakaoOauthState>
    if (
      typeof parsed.nonce === 'string' &&
      parsed.nonce &&
      typeof parsed.openerOrigin === 'string' &&
      parsed.openerOrigin
    ) {
      return {
        nonce: parsed.nonce,
        openerOrigin: parsed.openerOrigin,
      }
    }
    return null
  } catch {
    return null
  }
}

function kakaoOAuthStateMatchesRequest(
  sentEncodedState: string,
  receivedState: string | undefined
): boolean {
  if (!receivedState) return false
  const normalizedReceived = normalizeKakaoOAuthStateParam(receivedState)
  if (normalizedReceived === sentEncodedState) return true
  const expected = decodeKakaoOauthState(sentEncodedState)
  const got = decodeKakaoOauthState(normalizedReceived)
  return Boolean(
    expected &&
    got &&
    expected.nonce === got.nonce &&
    expected.openerOrigin === got.openerOrigin
  )
}

/**
 * 카카오 인가 코드만 받습니다 (클라이언트에서 `/oauth/token` 교환 없음 → code 1회 사용, A010 방지).
 * 로그인(`KakaoLoginButton`)·회원가입(소셜 가입 직전) 공통: 팝업 → `/oauth/kakao/callback` → postMessage로 code 반환.
 */
export function requestFreshKakaoAuthorizationCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
    if (!clientId) {
      reject(new Error('카카오 REST API 키가 설정되지 않았습니다.'))
      return
    }

    const redirectUri = getKakaoOAuthRedirectUri()
    const oauthState = encodeKakaoOauthState({
      nonce: createNonce(),
      openerOrigin: window.location.origin,
    })
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      state: oauthState,
    })
    const authUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`

    const timeoutMs = 180_000
    let settled = false
    let popup: Window | null = null

    function cleanup(
      listener: (e: MessageEvent) => void,
      timer: ReturnType<typeof setTimeout>
    ) {
      window.removeEventListener('message', listener)
      clearTimeout(timer)
    }

    function onMessage(event: MessageEvent) {
      if (settled || event.origin !== window.location.origin) return
      // 팝업이 kauth → 동일 오리진 콜백으로 이동한 뒤에는 `event.source === popup`이
      // 브라우저마다 깨지는 경우가 있어, 오리진·state·타입으로만 검증합니다.
      const d = event.data as {
        type?: string
        authorizationCode?: string
        state?: string
      }
      if (
        d?.type !== KAKAO_OAUTH_MESSAGE_TYPE ||
        !d.authorizationCode ||
        !kakaoOAuthStateMatchesRequest(oauthState, d.state)
      ) {
        return
      }
      settled = true
      cleanup(onMessage, timer)
      try {
        popup?.close()
      } catch {
        /* noop */
      }
      resolve(d.authorizationCode)
    }

    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      window.removeEventListener('message', onMessage)
      try {
        popup?.close()
      } catch {
        /* noop */
      }
      reject(new Error('카카오 인증 시간이 초과되었습니다.'))
    }, timeoutMs)

    window.addEventListener('message', onMessage)

    popup = window.open(
      authUrl,
      'kakao_oauth',
      'width=480,height=700,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      settled = true
      cleanup(onMessage, timer)
      reject(
        new Error('팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.')
      )
    }
  })
}

/**
 * 애플 로그인
 * Apple Sign In JavaScript SDK가 로드되어 있어야 합니다.
 *
 * 사용 방법:
 * 1. index.html에 Apple Sign In 스크립트 추가:
 *    <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
 * 2. AppleID.init() 호출 필요
 */
export async function loginWithApple(): Promise<SocialLoginResult> {
  return new Promise((resolve, reject) => {
    if (!window.AppleID) {
      reject(new Error('애플 SDK가 로드되지 않았습니다.'))
      return
    }

    const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID || ''
    const oauthRedirectURI =
      import.meta.env.VITE_OAUTH_REDIRECT_URI ||
      window.location.origin + '/login'

    if (!oauthClientId) {
      reject(new Error('애플 OAuth 클라이언트 ID가 설정되지 않았습니다.'))
      return
    }

    // 애플 로그인 실행
    window.AppleID.auth.init({
      clientId: oauthClientId,
      scope: 'name email',
      redirectURI: oauthRedirectURI,
      usePopup: true,
    })

    window.AppleID.auth.signIn(response => {
      if (response.authorization) {
        resolve({
          provider: 'APPLE',
          authorizationCode: response.authorization.code,
          accessToken: response.authorization.id_token,
        })
      } else {
        reject(new Error('애플 로그인에 실패했습니다.'))
      }
    })
  })
}

/**
 * 카카오 SDK가 로드될 때까지 대기
 */
function waitForKakaoSDK(maxAttempts = 50, interval = 100): Promise<void> {
  return new Promise((resolve, reject) => {
    let attempts = 0

    const checkSDK = () => {
      if (window.Kakao) {
        resolve()
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkSDK, interval)
      } else {
        reject(
          new Error('카카오 SDK 로드를 기다리는 중 타임아웃이 발생했습니다.')
        )
      }
    }

    checkSDK()
  })
}

type KakaoAuthLike = Record<string, unknown> & {
  authorize?: (opts?: KakaoAuthRedirectOptions) => unknown
  login?: (opts?: KakaoAuthRedirectOptions) => unknown
}

type KakaoAuthRedirectOptions = {
  redirectUri?: string
  [key: string]: unknown
}

/** SDK가 붙이는 authorize 요청(ka= 등)에서 redirect_uri가 http로 나가는 경우 보정 */
function patchKakaoSdkAuthRedirectToHttps(): void {
  const kakao = window.Kakao as unknown as { Auth?: KakaoAuthLike }
  const auth = kakao.Auth
  if (!auth) return

  const wrap = (name: 'authorize' | 'login') => {
    const fn = auth[name]
    if (typeof fn !== 'function') return
    if (
      (fn as { __alterKakaoRedirectPatch?: boolean }).__alterKakaoRedirectPatch
    )
      return

    const original = (fn as (opts?: KakaoAuthRedirectOptions) => unknown).bind(
      auth
    )
    const patched = (opts?: KakaoAuthRedirectOptions) => {
      const next: KakaoAuthRedirectOptions = { ...(opts ?? {}) }
      const raw =
        typeof next.redirectUri === 'string' && next.redirectUri.length > 0
          ? next.redirectUri
          : getKakaoOAuthRedirectUri()
      next.redirectUri = normalizeAlterAppKakaoRedirectToHttps(raw)
      return original(next)
    }
    ;(
      patched as { __alterKakaoRedirectPatch?: boolean }
    ).__alterKakaoRedirectPatch = true
    auth[name] = patched as unknown as (typeof auth)[typeof name]
  }

  wrap('authorize')
  wrap('login')
}

/**
 * 카카오 SDK 초기화
 */
export async function initKakaoSDK(appKey: string): Promise<void> {
  try {
    // SDK가 로드될 때까지 대기
    await waitForKakaoSDK()

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(appKey)
    }
    patchKakaoSdkAuthRedirectToHttps()
  } catch (error) {
    console.error('카카오 SDK 초기화 실패:', error)
    throw error
  }
}

/**
 * 애플 SDK 초기화
 */
export function initAppleSDK(config: {
  clientId: string
  scope?: string
  redirectURI?: string
  usePopup?: boolean
}): void {
  if (window.AppleID) {
    window.AppleID.auth.init({
      clientId: config.clientId,
      scope: config.scope || 'name email',
      redirectURI:
        config.redirectURI || window.location.origin + '/apple/callback',
      usePopup: config.usePopup !== false,
    })
  }
}
