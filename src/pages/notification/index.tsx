import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { NotificationItem } from '@/shared/ui/notification/NotificationItem'
import { useNotificationViewModel } from '@/features/notification/useNotificationViewModel'
import type { NotificationTab } from '@/features/notification/useNotificationViewModel'
import { ROUTES } from '@/shared/constants/routes'
import SettingIcon from '@/assets/icons/settings.svg?react'

function TabButton({
  label,
  active,
  hasUnread,
  onClick,
}: {
  label: string
  active: boolean
  hasUnread?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`relative h-[46px] flex flex-1 items-center justify-center border-b-2 pt-[11px] pb-[13px] typography-body01-semibold transition-colors ${
        active ? 'border-text-100 text-text-100' : 'border-line-1 text-text-50'
      }`}
      onClick={onClick}
    >
      {label}
      {hasUnread && (
        <span className="ml-1 mb-3 size-2 rounded-full bg-error" aria-hidden />
      )}
    </button>
  )
}

const TAB_LABELS: Record<NotificationTab, string> = {
  substitute: '대타',
  reputation: '평판',
}

export function NotificationPage() {
  const navigate = useNavigate()
  const {
    activeTab,
    setActiveTab,
    currentItems,
    hasUnreadSubstitute,
    hasUnreadReputation,
  } = useNotificationViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar
        variant="detail"
        title="알림"
        rightAction={
          <button
            type="button"
            aria-label="알림 설정"
            className="flex size-6 items-center justify-center text-text-100"
            onClick={() => navigate(ROUTES.NOTIFICATION_SETTINGS)}
          >
            <SettingIcon />
          </button>
        }
      />

      <div className="flex">
        {(['substitute', 'reputation'] as NotificationTab[]).map(tab => (
          <TabButton
            key={tab}
            label={TAB_LABELS[tab]}
            active={activeTab === tab}
            hasUnread={
              tab === 'substitute' ? hasUnreadSubstitute : hasUnreadReputation
            }
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>

      <main className="flex-1">
        {currentItems.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
              알림이 없습니다.
            </p>
          </div>
        ) : (
          <ul>
            {currentItems.map((item, idx) => (
              <li key={idx}>
                <NotificationItem {...item} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
