import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import { NotificationItem } from '@/shared/ui/notification/NotificationItem'
import { useNotificationViewModel } from '@/features/notification/useNotificationViewModel'
import {
  NOTIFICATION_TYPE,
  type NotificationType,
} from '@/features/notification/types/notificationType'
import { ROUTES } from '@/shared/constants/routes'
import SettingIcon from '@/assets/icons/settings.svg?react'
import ChevronDownIcon from '@/assets/icons/home/chevron-down.svg?react'

const TYPE_LABELS: Record<NotificationType, string> = {
  GENERAL: '전체',
  SCHEDULE: '스케줄',
  SUBSTITUTE: '대타',
  REPUTATION: '평판',
  POSTING_APPLICATION: '공고',
  CHAT: '채팅',
  WORKSPACE_INVITATION: '매장 초대',
  JOIN_REQUEST: '참여 요청',
}

const ALL_TYPES = Object.values(NOTIFICATION_TYPE) as NotificationType[]

function NotificationTypeFilter({
  value,
  onChange,
}: {
  value: NotificationType
  onChange: (type: NotificationType) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 rounded-full border border-line-1 px-3 py-1.5 typography-body02-medium text-text-100"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {TYPE_LABELS[value]}
        <ChevronDownIcon
          className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute left-0 top-full z-20 mt-1 min-w-[120px] overflow-hidden rounded-xl border border-line-1 bg-white shadow-md">
          {ALL_TYPES.map(type => (
            <li key={type}>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left typography-body02-regular transition-colors hover:bg-main-100 ${
                  type === value
                    ? 'text-main typography-body02-medium'
                    : 'text-text-100'
                }`}
                onClick={() => {
                  onChange(type)
                  setIsOpen(false)
                }}
              >
                {TYPE_LABELS[type]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function NotificationPage() {
  const navigate = useNavigate()
  const {
    selectedType,
    setSelectedType,
    currentItems,
    markAllRead,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationViewModel()

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white">
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

        <div className="flex items-center justify-between px-4 py-2">
          <NotificationTypeFilter
            value={selectedType}
            onChange={setSelectedType}
          />
          <button
            type="button"
            className="shrink-0 typography-bg text-text-50"
            onClick={markAllRead}
          >
            전체 읽음
          </button>
        </div>
      </div>

      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
              알림을 불러오지 못했습니다.
            </p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="flex justify-center py-16">
            <p className="typography-body02-regular text-text-50">
              알림이 없습니다.
            </p>
          </div>
        ) : (
          <>
            <ul>
              {currentItems.map((item, idx) => (
                <li key={item.id ?? idx}>
                  <NotificationItem {...item} />
                </li>
              ))}
            </ul>
            <div ref={sentinelRef} className="flex justify-center py-4">
              {isFetchingNextPage && <Spinner size={20} />}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
