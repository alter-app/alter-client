import { useEffect } from 'react'
import {
  WEEKDAY_LABELS,
  type AppliedApplicationDetail,
} from '@/features/home/user/types/appliedStore'

interface AppliedStoreDetailModalProps {
  isOpen: boolean
  onClose: () => void
  storeName: string
  detail: AppliedApplicationDetail
  showCancelButton: boolean
  onCancel?: () => void
}

export function AppliedStoreDetailModal({
  isOpen,
  onClose,
  storeName,
  detail,
  showCancelButton,
  onCancel,
}: AppliedStoreDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const selectedSet = new Set(detail.selectedWeekdays)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-[318px] overflow-hidden rounded-2xl bg-white shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="applied-store-detail-title"
      >
        <h2
          id="applied-store-detail-title"
          className="px-5 pt-5 text-center typography-body01-semibold text-text-100"
        >
          {storeName}
        </h2>

        <div className="px-5 pt-6">
          <p className="mb-2 typography-body03-regular text-text-70">요일</p>
          <div className="flex h-[50px] items-center rounded-2xl bg-bg-dark px-1 py-[5px]">
            {WEEKDAY_LABELS.map(day => {
              const selected = selectedSet.has(day)
              return (
                <div
                  key={day}
                  className="flex min-w-0 flex-1 items-center justify-center"
                >
                  {selected ? (
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-main-900 typography-body03-semibold text-text-100">
                      {day}
                    </span>
                  ) : (
                    <span className="typography-body03-regular text-text-50">
                      {day}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-5 pt-4">
          <p className="mb-2 typography-body03-regular text-text-70">시간</p>
          <div className="flex h-[50px] items-center rounded-2xl bg-bg-dark px-[17px]">
            <p className="typography-body03-semibold text-text-100">
              {detail.timeRangeLabel}
            </p>
          </div>
        </div>

        <div className="px-5 pt-4">
          <p className="mb-2 typography-body03-regular text-text-70">
            자기소개
          </p>
          <div className="min-h-[70px] rounded-2xl bg-bg-dark px-[14px] py-4">
            <p className="whitespace-pre-wrap typography-body03-regular text-text-100">
              {detail.selfIntroduction}
            </p>
          </div>
        </div>

        {showCancelButton && (
          <div className="px-5 pb-5 pt-6">
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
              onClick={() => onCancel?.()}
            >
              지원 취소
            </button>
          </div>
        )}

        {!showCancelButton && <div className="h-5" />}
      </div>
    </div>
  )
}

export type { AppliedStoreDetailModalProps }
