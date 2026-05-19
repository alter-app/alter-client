import { useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'

const DEFAULT_ITEM_HEIGHT = 52
const DEFAULT_VISIBLE = 5

export interface WheelPickerProps {
  items: readonly string[]
  selectedIndex: number
  onChange: (index: number) => void
  itemHeight?: number
  visibleCount?: number
  className?: string
  'aria-label'?: string
}

export function WheelPicker({
  items,
  selectedIndex,
  onChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleCount = DEFAULT_VISIBLE,
  className,
  'aria-label': ariaLabel,
}: WheelPickerProps) {
  const center = Math.floor(visibleCount / 2)
  const [dragDelta, setDragDelta] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)

  const baseTranslate = (center - selectedIndex) * itemHeight
  const rawTranslate = baseTranslate + dragDelta
  const minTranslate = (center - (items.length - 1)) * itemHeight
  const maxTranslate = center * itemHeight
  const currentTranslate = Math.max(
    minTranslate,
    Math.min(maxTranslate, rawTranslate)
  )

  /** 드래그 중에는 중앙 슬롯에 온 항목을 선택 스타일로 표시 */
  const highlightedIndex = Math.max(
    0,
    Math.min(
      items.length - 1,
      Math.round(selectedIndex - dragDelta / itemHeight)
    )
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    startY.current = e.clientY
    setDragDelta(0)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setDragDelta(e.clientY - startY.current)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    const totalDelta = e.clientY - startY.current
    const rawIndex = selectedIndex - totalDelta / itemHeight
    const snapped = Math.round(
      Math.max(0, Math.min(items.length - 1, rawIndex))
    )
    setDragDelta(0)
    onChange(snapped)
  }

  return (
    <div
      data-vaul-no-drag
      className={cn(
        'relative touch-none select-none overflow-hidden',
        className
      )}
      style={{ height: itemHeight * visibleCount }}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-2xl bg-bg-dark"
        style={{ top: center * itemHeight, height: itemHeight }}
      />
      <div
        className="relative z-[15] will-change-transform"
        style={{
          transform: `translateY(${currentTranslate}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className={cn(
              'flex items-center justify-center px-2.5 typography-headline01',
              i === highlightedIndex
                ? 'relative z-30 text-text-100'
                : 'text-text-50'
            )}
            style={{ height: itemHeight }}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white to-white/30"
        style={{ height: center * itemHeight }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white to-white/30"
        style={{ height: center * itemHeight }}
      />
    </div>
  )
}
