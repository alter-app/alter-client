import { resolvePostingStatusBadge } from '@/features/manager/posting/lib/postingStatus'
import type { PostingStatus } from '@/features/manager/posting/types/posting'
import { cn } from '@/shared/lib/utils'

interface ManagerPostingStatusBadgeProps {
  status: PostingStatus
  className?: string
}

/** 공고 상태 배지 — 모집중 / 모집완료 */
export function ManagerPostingStatusBadge({
  status,
  className,
}: ManagerPostingStatusBadgeProps) {
  const style = resolvePostingStatusBadge(status)

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
