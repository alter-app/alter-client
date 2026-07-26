import { cn } from '@/shared/lib/utils'
import type { ToastVariant } from '@/shared/stores/useToastStore'

interface ToastProps {
  message: string
  variant?: ToastVariant
  className?: string
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
    </svg>
  )
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16.2h.01" />
    </svg>
  )
}

/** 하단 다크 pill 형태의 스낵바 — ToastViewport를 통해 렌더링됩니다 */
export function Toast({ message, variant = 'success', className }: ToastProps) {
  const Icon = variant === 'success' ? CheckCircleIcon : AlertCircleIcon

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-xl bg-text-100 px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.24)]',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={cn(
          'size-[18px] shrink-0',
          variant === 'success' ? 'text-main' : 'text-error'
        )}
      />
      <span className="typography-body02-semibold text-white">{message}</span>
    </div>
  )
}

export type { ToastProps }
