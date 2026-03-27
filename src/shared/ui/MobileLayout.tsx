import type { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function MobileLayout({
  children,
  className = '',
  maxWidth = '428px',
}: MobileLayoutProps) {
  return (
    <div className="flex w-full justify-center bg-white">
      <div
        className={`mobile-layout-container relative mx-auto w-full ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  )
}
