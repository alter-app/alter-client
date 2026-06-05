import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { NotificationToggleRow } from '@/pages/notification/settings/components/NotificationToggleRow'
import { useNotificationSettingsViewModel } from '@/features/notification/useNotificationSettingsViewModel'

export function NotificationSettingsPage() {
  const {
    isLoading,
    allEnabled,
    nightEnabled,
    substituteEnabled,
    reputationEnabled,
    handleAllChange,
    handleNightChange,
    handleSubstituteChange,
    handleReputationChange,
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
            <NotificationToggleRow
              label="전체 알림 켜기"
              checked={allEnabled}
              onChange={handleAllChange}
              labelVariant="semibold"
            />
            <NotificationToggleRow
              label="대타 알림 켜기"
              checked={substituteEnabled}
              onChange={handleSubstituteChange}
              disabled={!allEnabled}
            />
            <NotificationToggleRow
              label="평판 알림 켜기"
              checked={reputationEnabled}
              onChange={handleReputationChange}
              disabled={!allEnabled}
            />
          </div>
        </section>

        <div className="h-px bg-line-1" />

        <section className="flex flex-col gap-6">
          <h2 className="typography-headline03 text-text-100">시간 설정</h2>
          <NotificationToggleRow
            label="야간 알림 켜기"
            checked={nightEnabled}
            onChange={handleNightChange}
            disabled={!allEnabled}
            description="23:00 ~ 08:00"
          />
        </section>
      </main>
    </div>
  )
}
