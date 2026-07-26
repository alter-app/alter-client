import type { ReactNode } from 'react'
import { AlterLogo } from '@/shared/ui/common/AlterLogo'
import BellIcon from '@/assets/icons/nav/bell.svg'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

type NavbarVariant = 'main' | 'detail'

interface NavbarProps {
  variant?: NavbarVariant
  title?: string
  onBackClick?: () => void
  /** 상세 헤더(`variant="detail"`) 우측 영역 — 알림·메뉴 자리에 커스텀 노출 시 사용 */
  rightAction?: ReactNode
  /** 뒤로가기 버튼 노출 — 기본 true. Docbar 탭 진입점처럼 돌아갈 곳이 없는 화면은 false */
  showBack?: boolean
  /** 하단 구분선 — 기본 true */
  showBorder?: boolean
  /** 메인 헤더 알림 뱃지 표시 여부 */
  hasUnread?: boolean
  /** 메인 헤더 알림 버튼 클릭 핸들러 */
  onNotificationClick?: () => void
}

export function Navbar({
  variant = 'main',
  title = '',
  onBackClick,
  rightAction,
  showBack = true,
  showBorder = true,
  hasUnread = false,
  onNotificationClick,
}: NavbarProps) {
  const navigate = useNavigate()
  const isMain = variant === 'main'

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
      return
    }
    navigate(-1)
  }

  return (
    <header
      className={cn(
        'relative flex h-14 w-full items-center px-4 py-3.5',
        showBorder && 'border-b border-line-2'
      )}
    >
      <div className="flex min-w-[84px] items-center">
        {isMain ? (
          <div className="flex items-center gap-2">
            <AlterLogo className="h-7 w-7" alt="알터 로고" />
            <span className="typography-logo">알터</span>
          </div>
        ) : (
          showBack && (
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={handleBackClick}
              className="flex h-6 w-6 items-center justify-center"
            >
              <img src={ChevronLeftIcon} alt="Back" className="h-6 w-6" />
            </button>
          )
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        {!isMain && (
          <span className="text-text-100 whitespace-nowrap typography-headline03">
            {title}
          </span>
        )}
      </div>

      <div className="ml-auto flex min-w-[84px] items-center justify-end gap-4">
        {isMain ? (
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-6 w-6 items-center justify-center"
            onClick={onNotificationClick}
          >
            <img src={BellIcon} alt="Bell" className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-error" />
            )}
          </button>
        ) : (
          rightAction
        )}
      </div>
    </header>
  )
}
