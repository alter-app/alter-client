/**
 * 소셜 로그인 유틸리티 함수
 * 카카오/애플 SDK 연동을 위한 헬퍼 함수
 */

declare global {
  interface Window {
    Kakao: any
    AppleID: any
  }
}

export interface SocialLoginResult {
  provider: 'KAKAO' | 'APPLE'
  accessToken?: string
  refreshToken?: string
  authorizationCode?: string
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
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('카카오 SDK가 로드되지 않았습니다.'))
      return
    }

    if (!window.Kakao.isInitialized()) {
      reject(new Error('카카오 SDK가 초기화되지 않았습니다.'))
      return
    }

    // 카카오 로그인 실행
    window.Kakao.Auth.login({
      success: (authObj: any) => {
        resolve({
          provider: 'KAKAO',
          accessToken: authObj.access_token,
          refreshToken: authObj.refresh_token,
        })
      },
      fail: () => {
        reject(new Error('카카오 로그인에 실패했습니다.'))
      },
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

    // 애플 로그인 실행
    window.AppleID.auth.init({
      clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
      scope: 'name email',
      redirectURI: window.location.origin + '/apple/callback',
      usePopup: true,
    })

    window.AppleID.auth.signIn((response: any) => {
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
 * 카카오 SDK 초기화
 */
export function initKakaoSDK(appKey: string): void {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(appKey)
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
      redirectURI: config.redirectURI || window.location.origin + '/apple/callback',
      usePopup: config.usePopup !== false,
    })
  }
}

