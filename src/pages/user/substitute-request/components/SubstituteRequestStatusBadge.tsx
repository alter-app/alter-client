import { cn } from '@/shared/lib/utils'

import type { SubstituteUiStatus } from '@/features/user/substitute/types'

interface SubstituteRequestStatusBadgeProps {
  uiStatus: SubstituteUiStatus
  label: string
}

export function SubstituteRequestStatusBadge({
  uiStatus,
  label,
}: SubstituteRequestStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-bg-light px-2 py-1 typography-bg',
        uiStatus === 'accepted' && 'text-main',
        uiStatus === 'cancelled' && 'text-error',
        uiStatus === 'pending' && 'text-text-50'
      )}
    >
      {label}
    </span>
  )
}
