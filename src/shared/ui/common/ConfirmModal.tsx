import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  isPending?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel,
  isPending = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[318px] overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-8">
          <h2
            id="confirm-modal-title"
            className="typography-headline03 text-text-100"
          >
            {title}
          </h2>
          {description && (
            <p className="typography-body02-regular text-center text-text-70">
              {description}
            </p>
          )}
        </div>
        <div className="flex border-t border-line-1">
          {cancelLabel && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex h-14 flex-1 items-center justify-center typography-body01-semibold text-text-70"
              >
                {cancelLabel}
              </button>
              <div className="w-px bg-line-1" />
            </>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex h-14 flex-1 items-center justify-center typography-body01-semibold text-error disabled:opacity-50"
          >
            {isPending ? '처리 중…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
