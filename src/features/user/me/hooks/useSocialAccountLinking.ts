import { useState } from 'react'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  getKakaoOAuthRedirectUri,
  loginWithApple,
  requestFreshKakaoAuthorizationCode,
} from '@/shared/lib/socialLogin'
import type {
  LinkSocialAccountRequest,
  SocialProvider,
} from '@/features/user/me/types/user'
import {
  useLinkSocialAccountMutation,
  useUnlinkSocialAccountMutation,
} from './useUserMeMutations'

const PROVIDER_LABELS: Record<SocialProvider, string> = {
  KAKAO: '카카오',
  APPLE: 'Apple',
}

export function useSocialAccountLinking() {
  const linkSocialAccountMutation = useLinkSocialAccountMutation()
  const unlinkSocialAccountMutation = useUnlinkSocialAccountMutation()
  const [message, setMessage] = useState('')
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null
  )

  const isPending =
    linkSocialAccountMutation.isPending ||
    unlinkSocialAccountMutation.isPending ||
    pendingProvider !== null

  const link = async (provider: SocialProvider) => {
    setMessage('')
    setPendingProvider(provider)
    try {
      let request: LinkSocialAccountRequest

      if (provider === 'KAKAO') {
        const { authorizationCode, redirectUri } =
          await requestFreshKakaoAuthorizationCode(getKakaoOAuthRedirectUri())
        request = {
          provider,
          platformType: 'WEB',
          authorizationCode,
          redirectUri,
        }
      } else {
        const appleResult = await loginWithApple()
        request = {
          provider,
          platformType: 'WEB',
          authorizationCode: appleResult.authorizationCode,
          oauthToken: appleResult.accessToken
            ? {
                accessToken: appleResult.accessToken,
                refreshToken: appleResult.refreshToken,
              }
            : undefined,
        }
      }

      await linkSocialAccountMutation.mutateAsync(request)
      setMessage(`${PROVIDER_LABELS[provider]} 계정이 연동되었습니다.`)
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '소셜 계정 연동에 실패했습니다.'))
    } finally {
      setPendingProvider(null)
    }
  }

  const unlink = async (provider: SocialProvider) => {
    if (
      !window.confirm(`${PROVIDER_LABELS[provider]} 계정 연동을 해제할까요?`)
    ) {
      return
    }
    setMessage('')
    setPendingProvider(provider)
    try {
      await unlinkSocialAccountMutation.mutateAsync(provider)
      setMessage(`${PROVIDER_LABELS[provider]} 계정 연동이 해제되었습니다.`)
    } catch (error) {
      setMessage(
        getAxiosErrorMessage(error, '소셜 계정 연동 해제에 실패했습니다.')
      )
    } finally {
      setPendingProvider(null)
    }
  }

  return {
    pendingProvider,
    message,
    isPending,
    link,
    unlink,
  }
}
