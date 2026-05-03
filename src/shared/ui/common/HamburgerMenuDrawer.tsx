import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import StoreIcon from '@/assets/icons/nav/store.svg'
import UsersIcon from '@/assets/icons/nav/users.svg'
import CalendarIcon from '@/assets/icons/nav/calendar.svg'
import WalletIcon from '@/assets/icons/nav/wallet.svg'
import SwapIcon from '@/assets/icons/nav/swap.svg'
import CloseXIcon from '@/assets/icons/nav/x.svg'
import { cn } from '@/shared/lib/utils'
import useAuthStore from '@/shared/stores/useAuthStore'

export interface HamburgerMenuDrawerProps {
  open: boolean
  onClose: () => void
}

type MenuRow = {
  label: string
  icon: string
  path: string
}

const MANAGER_ITEMS: MenuRow[] = [
  { label: '업장 관리', icon: StoreIcon, path: '/user/workspace' },
  { label: '직원 관리', icon: UsersIcon, path: '/manager/home' },
  { label: '근무 일정 관리', icon: CalendarIcon, path: '/manager/worker-schedule' },
  { label: '급여 관리', icon: WalletIcon, path: '/my' },
]

const USER_ITEMS: MenuRow[] = [
  { label: '내 근무 일정', icon: CalendarIcon, path: '/user/schedule' },
  { label: '급여 확인', icon: WalletIcon, path: '/my' },
  { label: '대타 요청 내역', icon: SwapIcon, path: '/user/home' },
]

function MenuList({
  items,
  accentClass,
  onNavigate,
}: {
  items: MenuRow[]
  accentClass: string
  onNavigate: (path: string) => void
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(row => (
        <li key={row.path + row.label}>
          <button
            type="button"
            onClick={() => onNavigate(row.path)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-text-100 transition-colors',
              'typography-body01-regular active:bg-bg-dark',
              accentClass
            )}
          >
            <img src={row.icon} alt="" className="h-5 w-5 shrink-0" aria-hidden />
            <span className="font-rixyeoljeongdo text-[17px] leading-tight">
              {row.label}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

export function HamburgerMenuDrawer({
  open,
  onClose,
}: HamburgerMenuDrawerProps) {
  const navigate = useNavigate()
  const scope = useAuthStore(s => s.scope)

  useEffect(() => {
    if (!open) {
      return
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') {
    return null
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    onClose()
  }

  const isManager = scope === 'MANAGER'
  const isUser = scope === 'USER' || scope === null

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
        aria-label="메뉴 닫기"
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[320px] flex-col border-l border-line-2 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.08)]"
        role="dialog"
        aria-modal="true"
        aria-label="사이드 메뉴"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line-2 px-4">
          <span className="typography-headline03 text-text-100">메뉴</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg active:bg-bg-dark"
            aria-label="닫기"
          >
            <img
              src={CloseXIcon}
              alt=""
              className="h-6 w-6"
              aria-hidden
            />
          </button>
        </div>

        <div className="scrollbar-hide flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5">
          {isManager && (
            <section aria-labelledby="hamburger-menu-manager-heading">
              <h2
                id="hamburger-menu-manager-heading"
                className="mb-3 font-rixyeoljeongdo text-[14px] tracking-tight text-sub"
              >
                사장님
              </h2>
              <MenuList
                items={MANAGER_ITEMS}
                accentClass="hover:bg-main-100/60"
                onNavigate={handleNavigate}
              />
            </section>
          )}

          {isUser && !isManager && (
            <section aria-labelledby="hamburger-menu-user-heading">
              <h2
                id="hamburger-menu-user-heading"
                className="mb-3 font-rixyeoljeongdo text-[14px] tracking-tight text-main"
              >
                알바생
              </h2>
              <MenuList
                items={USER_ITEMS}
                accentClass="hover:bg-main-100/40"
                onNavigate={handleNavigate}
              />
            </section>
          )}
        </div>
      </aside>
    </div>,
    document.body
  )
}
