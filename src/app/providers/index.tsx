import { useEffect, type ReactNode } from 'react'
import { initKakaoSDK, initAppleSDK } from '@/shared/lib/socialLogin'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    // 카카오 SDK 초기화
    const kakaoAppKey = import.meta.env.VITE_KAKAO_APP_KEY
    if (kakaoAppKey && window.Kakao) {
      initKakaoSDK(kakaoAppKey)
    }

    // 애플 SDK 초기화
    const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID
    if (appleClientId && window.AppleID) {
      initAppleSDK({
        clientId: appleClientId,
        scope: 'name email',
        redirectURI: window.location.origin + '/apple/callback',
        usePopup: true,
      })
    }
  }, [])

  return <>{children}</>
}

