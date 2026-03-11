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
    <>
      <div className="w-full min-h-screen min-h-[100dvh] bg-white flex justify-center">
        <div
          className={`mobile-layout-container w-full mx-auto ${className}`}
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
