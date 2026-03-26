import AlterLogo from '@/assets/Alter-logo.png'
import BellIcon from '@/assets/icons/nav/bell.svg'
import MenuIcon from '@/assets/icons/nav/menu.svg'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import { typography } from '@/shared/lib/tokens'
import { useNavigate } from 'react-router-dom'

type NavbarVariant = 'main' | 'detail'

interface NavbarProps {
  variant?: NavbarVariant
  title?: string
  onBackClick?: () => void
}

export function Navbar({
  variant = 'main',
  title = '',
  onBackClick,
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
    <header className="relative flex h-14 w-full items-center border-b border-line-2 bg-white px-4 py-3.5">
      <div className="flex min-w-[84px] items-center">
        {isMain ? (
          <div className="flex items-center gap-2">
            <img src={AlterLogo} alt="Alter logo" className="h-7 w-7" />
            <span className="typography-logo">알터</span>
          </div>
        ) : (
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBackClick}
            className="flex h-6 w-6 items-center justify-center"
          >
            <img src={ChevronLeftIcon} alt="Back" className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        {!isMain && (
          <span
            className="text-text-100 whitespace-nowrap"
            style={{
              fontFamily: typography.body01Semibold.fontFamily,
              fontSize: typography.body01Semibold.fontSize,
              fontWeight: typography.body01Semibold.fontWeight,
              lineHeight: typography.body01Semibold.lineHeight,
              letterSpacing: typography.body01Semibold.letterSpacing,
            }}
          >
            {title}
          </span>
        )}
      </div>

      <div className="ml-auto flex min-w-[84px] items-center justify-end gap-4">
        {isMain && (
          <>
            <button
              type="button"
              aria-label="알림"
              className="flex h-6 w-6 items-center justify-center"
            >
              <img src={BellIcon} alt="Bell" className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="메뉴"
              className="flex h-6 w-6 items-center justify-center"
            >
              <img src={MenuIcon} alt="Menu" className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
