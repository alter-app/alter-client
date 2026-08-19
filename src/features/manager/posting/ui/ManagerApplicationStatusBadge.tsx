import { resolveApplicationStatusBadge } from '@/features/manager/posting/lib/applicationStatus'
import type { ApplicationStatus } from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'

interface ManagerApplicationStatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function ManagerApplicationStatusBadge({
  status,
  className,
}: ManagerApplicationStatusBadgeProps) {
  const style = resolveApplicationStatusBadge(status)

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[50px] px-2 py-1 typography-bg',
        style.containerClassName,
        style.textClassName,
        className
      )}
    >
      {style.label}
    </span>
  )
}
