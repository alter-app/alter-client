import type { ReactNode } from 'react'
import { Docbar } from './common/Docbar'

interface MobileLayoutWithDocbarProps {
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function MobileLayoutWithDocbar({
  children,
  className = '',
  maxWidth = '428px',
}: MobileLayoutWithDocbarProps) {
  return (
    <div className="flex w-full justify-center bg-white">
      <div
        className={`mobile-layout-container relative mx-auto w-full pb-14 ${className}`}
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

export type { MobileLayoutWithDocbarProps }
