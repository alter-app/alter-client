import { cn } from '@/shared/lib/utils'

export type SubstituteStatusBadgeTone =
  | 'pending'
  | 'accepted'
  | 'approved'
  | 'cancelled'

interface SubstituteRequestStatusBadgeProps {
  tone: SubstituteStatusBadgeTone
  label: string
}

const BADGE_STYLE_MAP: Record<
  SubstituteStatusBadgeTone,
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
  approved: {
    containerClassName: 'border border-main bg-main',
    textClassName: 'text-white',
  },
  cancelled: {
    containerClassName: 'border border-error/30 bg-white',
    textClassName: 'text-error',
  },
}

export function SubstituteRequestStatusBadge({
  tone,
  label,
}: SubstituteRequestStatusBadgeProps) {
  const style = BADGE_STYLE_MAP[tone]

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
