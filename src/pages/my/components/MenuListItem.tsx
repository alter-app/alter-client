import type { ComponentType, SVGProps } from 'react'
import ChevronRightIcon from '@/assets/icons/my/chevron-right.svg?react'

interface MenuListItemProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  onClick?: () => void
  isLast?: boolean
}

export function MenuListItem({
  icon: Icon,
  label,
  onClick,
  isLast = false,
}: MenuListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center gap-2.5 pl-[18px] pr-4 ${
        isLast ? '' : 'border-b border-line-2'
      }`}
    >
      {Icon && (
        <Icon
          className="h-5 w-5 shrink-0 text-text-100 [&_*]:!stroke-current"
          aria-hidden="true"
        />
      )}
      <span className="flex-1 text-left text-text-100 typography-body01-regular">
        {label}
      </span>
      <ChevronRightIcon
        className="h-5 w-5 shrink-0 text-text-100"
        aria-hidden="true"
      />
    </button>
  )
}
