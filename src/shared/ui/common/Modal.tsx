import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  ariaLabel?: string
  variant?: 'center' | 'bottomSheet'
  className?: string
}

const DRAG_CLOSE_THRESHOLD = 80

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  ariaLabel,
  variant = 'bottomSheet',
  className = '',
}: ModalProps) {
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)

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

  const handleDragStart = (e: React.PointerEvent) => {
    startYRef.current = e.clientY
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const delta = e.clientY - startYRef.current
    setDragY(Math.max(0, delta))
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragY > DRAG_CLOSE_THRESHOLD) {
      setDragY(0)
      onClose()
    } else {
      setDragY(0)
    }
  }

  const containerClassName =
    variant === 'bottomSheet'
      ? 'fixed inset-0 z-[90] flex items-end justify-center'
      : 'fixed inset-0 z-[90] flex items-center justify-center px-4'

  const panelClassName =
    variant === 'bottomSheet'
      ? 'relative w-full max-w-[428px] min-h-[40dvh] max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-white px-5 pt-7 pb-[calc(env(safe-area-inset-bottom)+24px)]'
      : 'relative w-full max-w-[358px] max-h-[80dvh] overflow-y-auto rounded-2xl bg-white p-6'

  return (
    <div className={containerClassName} role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        className={`${panelClassName} ${className}`}
        style={
          variant === 'bottomSheet'
            ? {
                transform: `translateY(${dragY}px)`,
                transition: isDragging ? 'none' : 'transform 200ms ease-out',
              }
            : undefined
        }
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={e => e.stopPropagation()}
      >
        {variant === 'bottomSheet' && (
          <div
            className="absolute left-0 right-0 top-0 flex h-7 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
          >
            <div className="h-1 w-10 rounded-full bg-line-2" aria-hidden />
          </div>
        )}
        {title && (
          <h2
            id="modal-title"
            className="typography-headline01 text-text-100 mb-4"
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
