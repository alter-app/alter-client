import type { ReactNode } from 'react'
import { Docbar } from './common/Docbar'

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
    <div className="w-full bg-white flex justify-center">
      <div
        className={`mobile-layout-container relative w-full mx-auto pb-14 ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
      <div
        className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2"
        style={{ maxWidth }}
      >
        <Docbar />
      </div>
    </div>
  )
}
