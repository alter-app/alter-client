import type { ReactNode } from 'react'
import {
  DEFAULT_MOBILE_LAYOUT_MAX_WIDTH,
  MobileLayoutMaxWidthContext,
} from '@/shared/ui/mobileLayoutWidth'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function MobileLayout({
  children,
  className = '',
  maxWidth = DEFAULT_MOBILE_LAYOUT_MAX_WIDTH,
}: MobileLayoutProps) {
  return (
    <MobileLayoutMaxWidthContext.Provider value={maxWidth}>
      <div className="flex w-full justify-center bg-white">
        <div
          className={`mobile-layout-container relative mx-auto w-full ${className}`}
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </MobileLayoutMaxWidthContext.Provider>
  )
}
