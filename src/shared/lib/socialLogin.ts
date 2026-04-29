/**
 * 소셜 로그인 유틸리티 함수
 * 카카오/애플 SDK 연동을 위한 헬퍼 함수
 */

declare global {
  interface KakaoAuth {
    login: (options: {
      success: (authObj: {
        access_token: string
        refresh_token?: string
      }) => void
      fail?: (err?: unknown) => void
      redirectUri: string
      /**
       * true(기본): 카카오톡 앱(intent) 우선 → 데스크톱 브라우저에서는 스킴 미등록으로 실패할 수 있음
       * false: 브라우저에서 카카오 계정 로그인 페이지만 사용 (로컬/웹 권장)
       */
      throughTalk?: boolean
    }) => void
  }

  interface KakaoSDK {
    Auth: KakaoAuth
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

/** 카카오 로그인·토큰 교환 시 동일해야 함 (카카오 개발자 콘솔 Redirect URI와 일치) */
export function getKakaoOAuthRedirectUri(): string {
  return (
    import.meta.env.VITE_KAKAO_REDIRECT_URI ||
    `${window.location.origin}/oauth/kakao/callback`
  )
}

/** KakaoCallbackPage·로그인 페이지와 동일한 postMessage 타입 */
export const KAKAO_OAUTH_MESSAGE_TYPE = 'alter-kakao-oauth'

type KakaoOauthState = {
  nonce: string
  openerOrigin: string
}

function createNonce(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function encodeKakaoOauthState(payload: KakaoOauthState): string {
  return btoa(JSON.stringify(payload))
}

export function decodeKakaoOauthState(state?: string | null): KakaoOauthState | null {
  if (!state) return null
  try {
    const decoded = atob(state)
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

/**
 * 새 OAuth 인가 코드만 받습니다 (백엔드가 code를 소모하므로 클라이언트에서 토큰 교환하지 않음).
 * 회원가입 완료 직전에 호출해 A010(만료)을 피합니다 — 카카오 동의 팝업이 열립니다.
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
      if (event.source !== popup) return
      const d = event.data as {
        type?: string
        authorizationCode?: string
        state?: string
      }
      if (
        d?.type !== KAKAO_OAUTH_MESSAGE_TYPE ||
        !d.authorizationCode ||
        d.state !== oauthState
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
      'kakao_oauth_signup',
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
 * 카카오 로그인
 * 카카오 JavaScript SDK가 로드되어 있어야 합니다.
 *
 * 사용 방법:
 * 1. index.html에 카카오 SDK 스크립트 추가:
 *    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
 * 2. 카카오 앱 키로 초기화:
 *    Kakao.init('YOUR_KAKAO_APP_KEY')
 */
export async function loginWithKakao(): Promise<SocialLoginResult> {
  // SDK가 로드되고 초기화될 때까지 대기
  await waitForKakaoSDK()

  // 초기화 확인
  if (!window.Kakao.isInitialized()) {
    // 자동으로 초기화 시도
    const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY
    if (kakaoRestApiKey) {
      try {
        await initKakaoSDK(kakaoRestApiKey)
      } catch {
        throw new Error(
          '카카오 SDK 초기화에 실패했습니다. 앱 키를 확인해주세요.'
        )
      }
    } else {
      throw new Error('카카오 REST API 키가 설정되지 않았습니다.')
    }
  }

  const redirectURI = getKakaoOAuthRedirectUri()

  return new Promise((resolve, reject) => {
    // 카카오 로그인 실행
    // throughTalk: false — 앱 intent 스킴 대신 웹 OAuth만 사용 (localhost/데스크톱에서 intent 오류 방지)
    window.Kakao.Auth.login({
      success: authObj => {
        const extra = authObj as Record<string, string | undefined>
        resolve({
          provider: 'KAKAO',
          accessToken: authObj.access_token,
          refreshToken: authObj.refresh_token,
          // WEB 로그인 시 백엔드가 요구하는 OAuth 인가 코드 (SDK/설정에 따라 없을 수 있음)
          authorizationCode: extra.code ?? extra.authorization_code,
        })
      },
      fail: err => {
        if (import.meta.env.DEV && err !== undefined) {
          console.warn('[Kakao.Auth.login] fail:', err)
        }
        reject(new Error('카카오 로그인에 실패했습니다.'))
      },
      redirectUri: redirectURI,
      throughTalk: false,
    })
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
