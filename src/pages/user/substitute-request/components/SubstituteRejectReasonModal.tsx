import { useCallback, useEffect, useState } from 'react'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'

interface SubstituteRejectReasonModalProps {
  open: boolean
  pending?: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export function SubstituteRejectReasonModal({
  open,
  pending,
  onClose,
  onSubmit,
}: SubstituteRejectReasonModalProps) {
  const [reason, setReason] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    setReason('')
    setLocalError(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      handleClose()
    }
    if (open) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, handleClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const handleSubmit = () => {
    const trimmed = reason.trim()
    if (trimmed === '') {
      setLocalError('거절 사유를 입력해 주세요.')
      return
    }
    if (trimmed.length > 500) {
      setLocalError('거절 사유는 500자 이내로 입력해 주세요.')
      return
    }
    onSubmit(trimmed)
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={handleClose}
      />
      <div
        className="relative w-full max-w-[318px] overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex h-14 items-center justify-center px-4">
          <button
            type="button"
            aria-label="뒤로"
            className="absolute left-4 flex size-6 items-center justify-center"
            onClick={handleClose}
          >
            <img src={ChevronLeftIcon} alt="" className="size-6 rotate-90" />
          </button>
          <h2 className="typography-headline03 text-text-100">거절 사유</h2>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={reason}
            onChange={e => {
              setReason(e.target.value)
              setLocalError(null)
            }}
            placeholder="거절 사유를 입력해 주세요."
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-2xl bg-bg-dark p-4 typography-body02-regular text-text-100 outline-none placeholder:text-text-50"
          />
          {localError ? (
            <p className="mt-2 typography-body02-regular text-error">
              {localError}
            </p>
          ) : null}
        </div>
        <div className="px-5 pb-5">
          <button
            type="button"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-white disabled:opacity-50"
            onClick={handleSubmit}
          >
            {pending ? '처리 중…' : '거절하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
