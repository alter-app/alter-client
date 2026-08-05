import { resolvePostingStatusBadge } from '@/features/manager/posting/lib/postingStatus'
import type { PostingStatus } from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'

interface ManagerPostingStatusBadgeProps {
  status: PostingStatus
  className?: string
  size?: 'sm' | 'md'
}

export function ManagerPostingStatusBadge({
  status,
  className,
  size = 'sm',
}: ManagerPostingStatusBadgeProps) {
  const style = resolvePostingStatusBadge(status)

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[50px]',
        size === 'md'
          ? 'px-2.5 py-1.5 typography-body03-semibold'
          : 'px-2 py-1 typography-bg',
        style.containerClassName,
        style.textClassName,
        className
      )}
    >
      {style.label}
    </span>
  )
}
