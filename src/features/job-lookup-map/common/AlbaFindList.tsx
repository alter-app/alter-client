import type { ReactNode } from 'react'

type AlbaFindListProps = {
  children: ReactNode
  className?: string
}

export function AlbaFindList({ children, className }: AlbaFindListProps) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] ${className ?? ''}`.trim()}
    >
      {children}
    </div>
  )
}
