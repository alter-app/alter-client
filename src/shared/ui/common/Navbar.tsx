import { useState } from 'react'
import AlterLogo from '@/assets/Alter-logo.png'
import BellIcon from '@/assets/icons/nav/bell.svg'
import MenuIcon from '@/assets/icons/nav/menu.svg'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import { useNavigate } from 'react-router-dom'
import { HamburgerMenuDrawer } from '@/shared/ui/common/HamburgerMenuDrawer'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const isMain = variant === 'main'

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
      return
    }
    navigate(-1)
  }

  return (
    <>
      <header className="relative flex h-14 w-full items-center border-b border-line-2  px-4 py-3.5">
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
            <span className="text-text-100 whitespace-nowrap typography-headline03">
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
                aria-label="메뉴 열기"
                aria-expanded={menuOpen}
                aria-haspopup="dialog"
                onClick={() => setMenuOpen(true)}
                className="flex h-6 w-6 items-center justify-center"
              >
                <img src={MenuIcon} alt="" aria-hidden className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </header>
      <HamburgerMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
