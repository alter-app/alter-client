import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { WorkspaceImageDto } from '@/features/manager/workspace-image/types/workspaceImage'

interface WorkspaceImageCarouselProps {
  isOpen: boolean
  images: WorkspaceImageDto[]
  onClose: () => void
  onEdit: () => void
}

/**
 * 업장 대표 이미지 캐러셀 — 홈 카드 탭 시 열리는 전체화면 모달.
 * 좌·우 화살표/썸네일로 모든 이미지를 넘겨 보고, 편집 버튼으로 수정 화면에 진입.
 */
export function WorkspaceImageCarousel({
  isOpen,
  images,
  onClose,
  onEdit,
}: WorkspaceImageCarouselProps) {
  const total = images.length
  const [index, setIndex] = useState(0)
  const [wasOpen, setWasOpen] = useState(isOpen)

  const goPrev = useCallback(
    () => setIndex(i => (i - 1 + total) % total),
    [total]
  )
  const goNext = useCallback(() => setIndex(i => (i + 1) % total), [total])

  // 열릴 때 첫 이미지로 초기화 (effect 대신 렌더 중 파생 상태 조정)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    if (isOpen) setIndex(0)
  }

  // 스크롤 잠금 + 키보드 조작
  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, goPrev, goNext])

  if (!isOpen || total === 0) return null

  const active = images[Math.min(index, total - 1)]

  return (
    <div
      className="fixed inset-0 z-[80] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="업장 대표 이미지"
    >
      {/* 뒤 배경 — 메인 이미지 블러 */}
      <img
        src={images[0].url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover blur-sm brightness-50"
      />
      <div className="absolute inset-0 flex flex-col bg-black/80">
        {/* 상단 바 */}
        <div className="flex h-16 items-center justify-between px-[18px]">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-[18px] text-white"
          >
            ✕
          </button>
          <span className="typography-body02-semibold text-white">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 typography-body02-semibold text-text-100"
          >
            <span aria-hidden="true">✎</span> 편집
          </button>
        </div>

        {/* 메인 이미지 */}
        <div className="relative flex flex-1 items-center justify-center px-4">
          <img
            src={active.url}
            alt="업장 이미지"
            className="h-[78%] max-h-full w-full max-w-full rounded-2xl object-cover"
          />
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="이전"
                onClick={goPrev}
                className="absolute left-[26px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-[22px] text-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음"
                onClick={goNext}
                className="absolute right-[26px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-[22px] text-white"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 썸네일 + 점 인디케이터 */}
        <div className="px-[18px] pb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3.5">
            {images.map((image, k) => (
              <button
                key={image.fileId}
                type="button"
                onClick={() => setIndex(k)}
                aria-label={`${k + 1}번째 이미지`}
                className={cn(
                  'relative h-16 w-16 flex-none overflow-hidden rounded-[10px] border-2',
                  k === index ? 'border-main' : 'border-transparent'
                )}
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {k === 0 && (
                  <span className="absolute inset-x-0 bottom-0 bg-main py-0.5 text-center text-[9px] font-bold text-white">
                    메인
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-1.5">
            {images.map((image, k) => (
              <span
                key={image.fileId}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  k === index ? 'w-[18px] bg-white' : 'w-1.5 bg-white/40'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
