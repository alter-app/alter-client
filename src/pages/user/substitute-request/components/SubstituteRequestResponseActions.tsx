import type { ReactNode } from 'react'

interface SubstituteRequestResponseActionsProps {
  onAccept: () => void
  onReject: () => void
  disabled?: boolean
}

function ActionIconButton({
  label,
  className,
  onClick,
  disabled,
  children,
}: {
  label: string
  className: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function SubstituteRequestResponseActions({
  onAccept,
  onReject,
  disabled,
}: SubstituteRequestResponseActionsProps) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <ActionIconButton
        label="수락"
        className="bg-main"
        onClick={onAccept}
        disabled={disabled}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8.5L6.5 12L13 4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </ActionIconButton>
      <ActionIconButton
        label="거절"
        className="bg-error"
        onClick={onReject}
        disabled={disabled}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </ActionIconButton>
    </div>
  )
}
