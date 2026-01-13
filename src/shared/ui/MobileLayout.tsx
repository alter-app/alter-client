import { ReactNode } from 'react'

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
      <style>{`
        @supports (padding: max(0px)) {
          .mobile-layout-container {
            padding-left: max(20px, env(safe-area-inset-left));
            padding-right: max(20px, env(safe-area-inset-right));
            padding-top: max(24px, env(safe-area-inset-top));
            padding-bottom: max(24px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
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

