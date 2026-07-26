import { cn } from '@/shared/lib/utils'

interface SkeletonProps {
  className?: string
}

/** 로딩 플레이스홀더 블록 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-bg-dark', className)}
      aria-hidden="true"
    />
  )
}

export type { SkeletonProps }
