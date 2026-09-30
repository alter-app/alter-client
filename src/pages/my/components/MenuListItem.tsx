import type { ComponentType, SVGProps } from 'react'
import ChevronRightIcon from '@/assets/icons/my/chevron-right.svg?react'

interface MenuListItemProps {
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  description?: string
  onClick?: () => void
  isLast?: boolean
  iconClassName?: string
}

export function MenuListItem({
  icon: Icon,
  label,
  description,
  onClick,
  isLast = false,
  iconClassName,
}: MenuListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-light/70 active:bg-bg-dark ${
        isLast ? '' : 'border-b border-line-1'
      }`}
    >
      {Icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-main-100">
          <Icon
            className={`h-5 w-5 shrink-0 [&_*]:!stroke-current ${
              iconClassName ?? 'text-sub'
            }`}
            aria-hidden="true"
          />
        </span>
      )}
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-text-100 typography-body01-semibold">
          {label}
        </span>
        {description && (
          <span className="text-text-70 typography-body03-regular">
            {description}
          </span>
        )}
      </span>
      <ChevronRightIcon
        className="h-5 w-5 shrink-0 text-text-50 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  )
}
