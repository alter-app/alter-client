import { cn } from '@/shared/lib/utils'

import type { SubstituteUiStatus } from '@/features/user/substitute/types'

interface SubstituteRequestStatusBadgeProps {
  uiStatus: SubstituteUiStatus
  label: string
}

const BADGE_STYLE_MAP: Record<
  SubstituteUiStatus,
  { containerClassName: string; textClassName: string }
> = {
  pending: {
    containerClassName: 'border border-main bg-main-100',
    textClassName: 'text-main',
  },
  accepted: {
    containerClassName: 'border border-subBlue/30 bg-subBlue/10',
    textClassName: 'text-subBlue',
  },
  cancelled: {
    containerClassName: 'border border-error/30 bg-white',
    textClassName: 'text-error',
  },
}

export function SubstituteRequestStatusBadge({
  uiStatus,
  label,
}: SubstituteRequestStatusBadgeProps) {
  const style = BADGE_STYLE_MAP[uiStatus]

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-1 shadow-[1px_1px_4px_0px_rgba(0,0,0,0.08)]',
        style.containerClassName
      )}
    >
      <span className={cn('typography-bg', style.textClassName)}>{label}</span>
    </span>
  )
}
