import { useCallback, useEffect, useState } from 'react'

export type SubstituteActionType = 'approve' | 'reject'

interface ManagerSubstituteActionModalProps {
  open: boolean
  type: SubstituteActionType
  pending?: boolean
  onClose: () => void
  onSubmit: (comment: string) => void
}

const ACTION_CONFIG: Record<
  SubstituteActionType,
  { title: string; placeholder: string; submitLabel: string }
> = {
  approve: {
    title: '승인 코멘트',
    placeholder: '승인 코멘트를 입력해 주세요.',
    submitLabel: '승인하기',
  },
  reject: {
    title: '거절 사유',
    placeholder: '거절 사유를 입력해 주세요.',
    submitLabel: '거절하기',
  },
}

export function ManagerSubstituteActionModal({
  open,
  type,
  pending,
  onClose,
  onSubmit,
}: ManagerSubstituteActionModalProps) {
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const config = ACTION_CONFIG[type]

  const handleClose = useCallback(() => {
    setComment('')
    setError(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKeyDown)
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
    const trimmed = comment.trim()
    if (trimmed === '') {
      setError('내용을 입력해 주세요.')
      return
    }
    if (trimmed.length > 500) {
      setError('500자 이내로 입력해 주세요.')
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
          <h2 className="typography-headline03 text-text-100">
            {config.title}
          </h2>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={comment}
            onChange={e => {
              setComment(e.target.value)
              setError(null)
            }}
            placeholder={config.placeholder}
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-2xl bg-bg-dark p-4 typography-body02-regular text-text-100 outline-none placeholder:text-text-50"
          />
          {error ? (
            <p className="mt-2 typography-body02-regular text-error">{error}</p>
          ) : null}
        </div>
        <div className="px-5 pb-5">
          <button
            type="button"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-white disabled:opacity-50"
            onClick={handleSubmit}
          >
            {pending ? '처리 중…' : config.submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
