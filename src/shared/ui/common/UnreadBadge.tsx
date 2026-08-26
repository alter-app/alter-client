import { cn } from '@/shared/lib/utils'
import { formatUnreadCount } from '@/shared/lib/unreadCount'

interface UnreadBadgeProps {
  count: number
  /** 'md': 채팅 목록 행 · 'sm': Docbar·세그먼트 라벨 옆 */
  size?: 'md' | 'sm'
  className?: string
}

export function UnreadBadge({
  count,
  size = 'md',
  className,
}: UnreadBadgeProps) {
  if (count <= 0) return null

  const label = formatUnreadCount(count)

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-main text-white tabular-nums',
        size === 'md'
          ? 'h-5 min-w-5 px-1.5 typography-body03-semibold'
          : 'h-4 min-w-4 px-1 text-[11px] font-semibold leading-none',
        className
      )}
      aria-label={`읽지 않은 메시지 ${label}개`}
    >
      {label}
    </span>
  )
}

export type { UnreadBadgeProps }
