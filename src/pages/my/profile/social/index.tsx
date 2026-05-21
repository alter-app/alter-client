import { useMemo } from 'react'
import {
  type SocialProvider,
  useSocialAccountLinking,
  useUserSocialStatus,
} from '@/features/user/me'
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
  const socialLinking = useSocialAccountLinking()

  const statusMap = useMemo(
    () => new Map(data.map(item => [item.provider, item])),
    [data]
  )

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
            const pending = socialLinking.pendingProvider === item.provider

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
                  disabled={socialLinking.isPending}
                  onClick={() =>
                    linked
                      ? void socialLinking.unlink(item.provider)
                      : void socialLinking.link(item.provider)
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
        {socialLinking.message && (
          <p
            role="status"
            className="mt-4 text-text-70 typography-body03-regular"
          >
            {socialLinking.message}
          </p>
        )}
      </main>
    </div>
  )
}
