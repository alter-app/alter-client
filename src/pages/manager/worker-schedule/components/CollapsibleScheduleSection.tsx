import type { ReactNode } from 'react'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import { cn } from '@/shared/lib/utils'

interface CollapsibleScheduleSectionProps {
  title: string
  icon?: ReactNode
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  className?: string
}

export function CollapsibleScheduleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  className,
}: CollapsibleScheduleSectionProps) {
  return (
    <section className={cn('flex flex-col gap-2.5', className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex h-12 w-full items-center rounded-2xl bg-white px-4"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="typography-headline03 text-text-100">{title}</span>
          {icon}
        </div>
        <img
          src={chevronDownIcon}
          alt=""
          aria-hidden="true"
          className={cn('size-6 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen ? children : null}
    </section>
  )
}
