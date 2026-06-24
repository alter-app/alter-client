import { useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { initKakaoSDK, initAppleSDK } from '@/shared/lib/socialLogin'

const queryClient = new QueryClient()

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const initializeSDKs = async () => {
      // 카카오 SDK 초기화
      const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY
      if (kakaoRestApiKey) {
        try {
          await initKakaoSDK(kakaoRestApiKey)
          console.log('카카오 SDK 초기화 완료')
        } catch (error) {
          console.error('카카오 SDK 초기화 실패:', error)
        }
      } else {
        console.warn('VITE_KAKAO_REST_API_KEY가 설정되지 않았습니다.')
      }

      // 애플 SDK 초기화
      const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID
      const oauthRedirectURI =
        import.meta.env.VITE_OAUTH_REDIRECT_URI ||
        window.location.origin + '/login'

      if (oauthClientId) {
        // 애플 SDK 로드 대기
        const waitForAppleSDK = () => {
          if (window.AppleID) {
            initAppleSDK({
              clientId: oauthClientId,
              scope: 'name email',
              redirectURI: oauthRedirectURI,
              usePopup: true,
            })
            console.log('애플 SDK 초기화 완료')
          } else {
            setTimeout(waitForAppleSDK, 100)
          }
        }
        waitForAppleSDK()
      } else {
        console.warn('VITE_OAUTH_CLIENT_ID가 설정되지 않았습니다.')
      }
    }

    initializeSDKs()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV ? (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      ) : null}
    </QueryClientProvider>
  )
}
