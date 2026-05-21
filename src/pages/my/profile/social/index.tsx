import { useMemo, useState } from 'react'
import {
  type LinkSocialAccountRequest,
  type SocialProvider,
  useLinkSocialAccountMutation,
  useUnlinkSocialAccountMutation,
  useUserSocialStatus,
} from '@/features/user/me'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  getKakaoOAuthRedirectUri,
  loginWithApple,
  requestFreshKakaoAuthorizationCode,
} from '@/shared/lib/socialLogin'
import { Navbar } from '@/shared/ui/common/Navbar'

const PROVIDERS: Array<{ provider: SocialProvider; label: string }> = [
  { provider: 'KAKAO', label: '카카오' },
  { provider: 'APPLE', label: 'Apple' },
]

function formatLinkedAt(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

export function SocialAccountPage() {
  const { data = [], isLoading, isError } = useUserSocialStatus()
  const linkSocialAccountMutation = useLinkSocialAccountMutation()
  const unlinkSocialAccountMutation = useUnlinkSocialAccountMutation()
  const [message, setMessage] = useState('')
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null
  )

  const statusMap = useMemo(
    () => new Map(data.map(item => [item.provider, item])),
    [data]
  )

  const isPending =
    linkSocialAccountMutation.isPending ||
    unlinkSocialAccountMutation.isPending ||
    pendingProvider !== null

  const handleLink = async (provider: SocialProvider) => {
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
      setMessage(
        `${PROVIDERS.find(item => item.provider === provider)?.label} 계정이 연동되었습니다.`
      )
    } catch (error) {
      setMessage(getAxiosErrorMessage(error, '소셜 계정 연동에 실패했습니다.'))
    } finally {
      setPendingProvider(null)
    }
  }

  const handleUnlink = async (provider: SocialProvider) => {
    const label = PROVIDERS.find(item => item.provider === provider)?.label
    if (!window.confirm(`${label} 계정 연동을 해제할까요?`)) return
    setMessage('')
    setPendingProvider(provider)
    try {
      await unlinkSocialAccountMutation.mutateAsync(provider)
      setMessage(`${label} 계정 연동이 해제되었습니다.`)
    } catch (error) {
      setMessage(
        getAxiosErrorMessage(error, '소셜 계정 연동 해제에 실패했습니다.')
      )
    } finally {
      setPendingProvider(null)
    }
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="소셜 계정 관리" />
      </div>

      <main className="flex flex-1 flex-col px-5 pt-8">
        <p className="text-text-70 typography-body02-regular">
          소셜 계정을 연동하면 해당 계정으로 로그인할 수 있습니다.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {PROVIDERS.map(item => {
            const status = statusMap.get(item.provider)
            const linked = Boolean(status?.linked)
            const pending = pendingProvider === item.provider

            return (
              <div
                key={item.provider}
                className="flex items-center justify-between rounded-2xl border border-line-2 px-4 py-4"
              >
                <div>
                  <p className="text-text-100 typography-body01-regular">
                    {item.label}
                  </p>
                  <p className="mt-1 text-text-50 typography-body03-regular">
                    {linked
                      ? `연동됨 ${formatLinkedAt(status?.linkedAt)}`
                      : '연동되지 않음'}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    linked
                      ? handleUnlink(item.provider)
                      : handleLink(item.provider)
                  }
                  className="h-10 rounded-xl bg-main px-4 text-white disabled:bg-text-50 typography-body02-regular"
                >
                  {pending ? '처리 중' : linked ? '해제' : '연동'}
                </button>
              </div>
            )
          })}
        </div>

        {isLoading && (
          <p className="mt-4 text-text-50 typography-body03-regular">
            연동 상태를 불러오는 중입니다.
          </p>
        )}
        {isError && (
          <p role="alert" className="mt-4 text-error typography-body03-regular">
            연동 상태를 불러오지 못했습니다.
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mt-4 text-text-70 typography-body03-regular"
          >
            {message}
          </p>
        )}
      </main>
    </div>
  )
}
