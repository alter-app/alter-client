import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { Toggle } from '@/shared/ui/common/Toggle'
import { useNotificationSettingsViewModel } from '@/features/notification/useNotificationSettingsViewModel'

export function NotificationSettingsPage() {
  const {
    isLoading,
    allEnabled,
    substituteEnabled,
    reputationEnabled,
    handleAllChange,
    setSubstituteEnabled,
    setReputationEnabled,
  } = useNotificationSettingsViewModel()

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-white">
        <Navbar variant="detail" title="알림 설정" />
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar variant="detail" title="알림 설정" />

      <main className="flex flex-col gap-5 px-6 pt-4">
        <section className="flex flex-col gap-6">
          <h2 className="typography-headline03 text-text-100">전체 알림</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="typography-body01-semibold text-text-100">
                전체 알림 켜기
              </span>
              <Toggle
                checked={allEnabled}
                onChange={handleAllChange}
                ariaLabel="전체 알림 켜기"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="typography-body01-regular text-text-100">
                대타 알림 켜기
              </span>
              <Toggle
                checked={substituteEnabled}
                onChange={setSubstituteEnabled}
                disabled={!allEnabled}
                ariaLabel="대타 알림 켜기"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="typography-body01-regular text-text-100">
                평판 알림 켜기
              </span>
              <Toggle
                checked={reputationEnabled}
                onChange={setReputationEnabled}
                disabled={!allEnabled}
                ariaLabel="평판 알림 켜기"
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-line-1" />

        <section className="flex flex-col gap-6">
          <h2 className="typography-headline03 text-text-100">시간 설정</h2>
          <div className="flex items-center justify-between">
            <span className="typography-body01-regular text-text-100">
              방해금지 시간
            </span>
            <span className="typography-body01-regular text-text-100">
              23:00 ~ 08:00
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}
