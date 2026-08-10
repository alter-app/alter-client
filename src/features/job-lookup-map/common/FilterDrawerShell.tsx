import type { ReactNode } from 'react'
import { Drawer } from 'vaul'

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

type FilterDrawerShellProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  footer?: ReactNode | null
}

export function FilterDrawerShell({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: FilterDrawerShellProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[60] outline-none">
          <div className="mx-auto flex w-full max-w-[428px] -translate-x-1.5 flex-col overflow-hidden rounded-t-[32px] bg-white">
            {open ? (
              <>
                <div className="mx-auto mt-4 h-1 w-[50px] shrink-0 rounded-full bg-line-2" />

                <div className="flex items-center justify-between px-4 pb-3 pt-4">
                  <Drawer.Title className="typography-headline02 text-text-100">
                    {title}
                  </Drawer.Title>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => onOpenChange(false)}
                    className="flex size-8 items-center justify-center text-text-100"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <div>{children}</div>

                {footer ?? null}
              </>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function FilterDrawerApplyFooter({
  onApply,
  disabled = false,
  showReset = false,
  onReset,
  applyLabel = '적용하기',
}: {
  onApply: () => void
  disabled?: boolean
  showReset?: boolean
  onReset?: () => void
  applyLabel?: string
}) {
  if (showReset) {
    return (
      <div className="flex shrink-0 gap-2 border-t border-line-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={onReset}
          className="h-12 shrink-0 rounded-2xl border border-line-2 px-5 typography-body01-semibold text-text-100"
        >
          초기화
        </button>
        <button
          type="button"
          onClick={onApply}
          disabled={disabled}
          className="h-12 flex-1 rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {applyLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="shrink-0 border-t border-line-1 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
      <button
        type="button"
        onClick={onApply}
        disabled={disabled}
        className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        적용하기
      </button>
    </div>
  )
}
