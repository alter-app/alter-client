import { useRef, useState, type ReactNode } from 'react'

interface SwipeableRowProps {
  children: ReactNode
  actions: ReactNode
  actionWidth?: number
}

export function SwipeableRow({
  children,
  actions,
  actionWidth = 160,
}: SwipeableRowProps) {
  const [offset, setOffset] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const threshold = actionWidth / 2

  const handlePointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const delta = e.clientX - startXRef.current
    const base = isOpen ? -actionWidth : 0
    setOffset(Math.max(-actionWidth, Math.min(0, base + delta)))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    const delta = e.clientX - startXRef.current
    if (isOpen ? delta > threshold : delta < -threshold) {
      const next = !isOpen
      setIsOpen(next)
      setOffset(next ? -actionWidth : 0)
    } else {
      setOffset(isOpen ? -actionWidth : 0)
    }
  }

  return (
    <div className="relative overflow-hidden bg-bg-dark">
      <div
        className={
          isDragging ? '' : 'transition-transform duration-200 ease-out'
        }
        style={{ transform: `translateX(${offset}px)`, display: 'flex' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="w-full shrink-0">{children}</div>
        <div
          className="flex shrink-0 items-center justify-end gap-[10px] px-6 py-[10px]"
          style={{ width: actionWidth }}
          onPointerDown={e => e.stopPropagation()}
        >
          {actions}
        </div>
      </div>
    </div>
  )
}
