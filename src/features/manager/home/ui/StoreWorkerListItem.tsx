import { useState } from 'react'
import MoreVerticalIcon from '@/assets/icons/home/more-vertical.svg'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { ActionMenu, type ActionMenuItem } from '@/shared/ui/common/ActionMenu'
import type { StoreWorkerRole } from '@/features/manager/home/types/storeWorkerRole'

interface StoreWorkerListItemProps {
  name: string
  role: StoreWorkerRole
  nextWorkDate: string
  profileImageUrl?: string
  menuItems?: ActionMenuItem[]
  className?: string
}

export function StoreWorkerListItem({
  name,
  role,
  nextWorkDate,
  profileImageUrl,
  menuItems,
  className = '',
}: StoreWorkerListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div
      className={`relative flex h-[60px] items-center justify-between rounded-lg bg-white px-3 py-1 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="h-[38px] w-[38px] overflow-hidden rounded-full bg-bg-dark">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="typography-body01-semibold text-text-100">{name}</p>
            <WorkerRoleBadge role={role} />
          </div>
          <p className="flex items-center gap-2 typography-doc text-text-70">
            <span>다음 근무 예정일</span>
            <span>{nextWorkDate}</span>
          </p>
        </div>
      </div>

      {menuItems && menuItems.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex h-7 w-7 items-center justify-center"
            aria-label="더보기"
          >
            <img src={MoreVerticalIcon} alt="더보기" className="h-7 w-7" />
          </button>
          <ActionMenu
            items={menuItems}
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            className="right-0 top-full mt-1"
          />
        </>
      )}
    </div>
  )
}

export type { StoreWorkerListItemProps }
