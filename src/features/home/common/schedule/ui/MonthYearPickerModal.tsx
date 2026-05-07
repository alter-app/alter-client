import { useRef, useState } from 'react'
import { cn } from '@/shared/lib/utils'

const ITEM_HEIGHT = 44
const VISIBLE = 5
const CENTER = Math.floor(VISIBLE / 2)

const MONTH_ITEMS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`)

interface DrumPickerProps {
  items: string[]
  selectedIndex: number
  onChange: (index: number) => void
}

function DrumPicker({ items, selectedIndex, onChange }: DrumPickerProps) {
  const [dragDelta, setDragDelta] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef(0)

  const baseTranslate = (CENTER - selectedIndex) * ITEM_HEIGHT
  const rawTranslate = baseTranslate + dragDelta
  const minTranslate = (CENTER - (items.length - 1)) * ITEM_HEIGHT
  const maxTranslate = CENTER * ITEM_HEIGHT
  const currentTranslate = Math.max(
    minTranslate,
    Math.min(maxTranslate, rawTranslate)
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
    const rawIndex = selectedIndex - totalDelta / ITEM_HEIGHT
    const snapped = Math.round(
      Math.max(0, Math.min(items.length - 1, rawIndex))
    )
    setDragDelta(0)
    onChange(snapped)
  }

  return (
    <div
      className="relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ height: ITEM_HEIGHT * VISIBLE }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-lg bg-gray-100 opacity-40"
        style={{ top: CENTER * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      <div
        className="will-change-transform"
        style={{
          transform: `translateY(${currentTranslate}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {items.map((item, i) => (
          <div
            key={item}
            className={cn(
              'flex items-center justify-center typography-body01-regular',
              i === selectedIndex
                ? 'text-text-100 font-semibold'
                : 'text-text-40'
            )}
            style={{ height: ITEM_HEIGHT }}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-white to-transparent"
        style={{ height: CENTER * ITEM_HEIGHT }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white to-transparent"
        style={{ height: CENTER * ITEM_HEIGHT }}
      />
    </div>
  )
}

interface MonthYearPickerModalProps {
  isOpen: boolean
  yearItems: string[]
  yearIndex: number
  monthIndex: number
  onYearIndexChange: (index: number) => void
  onMonthIndexChange: (index: number) => void
  onConfirm: () => void
  onClose: () => void
}

export function MonthYearPickerModal({
  isOpen,
  yearItems,
  yearIndex,
  monthIndex,
  onYearIndexChange,
  onMonthIndexChange,
  onConfirm,
  onClose,
}: MonthYearPickerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="날짜 선택"
        className="relative w-[280px] rounded-2xl bg-white px-6 pb-5 pt-6"
      >
        <p className="typography-body01-semibold text-text-90 mb-4 text-center">
          날짜 선택
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <DrumPicker
              items={yearItems}
              selectedIndex={yearIndex}
              onChange={onYearIndexChange}
            />
          </div>
          <div className="flex-1">
            <DrumPicker
              items={MONTH_ITEMS}
              selectedIndex={monthIndex}
              onChange={onMonthIndexChange}
            />
          </div>
        </div>
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-main py-3 typography-body01-semibold text-white"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  )
}
