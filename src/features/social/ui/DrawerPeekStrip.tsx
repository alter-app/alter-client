import { useRef, type PointerEvent } from 'react'

import { DrawerHandleBar } from './DrawerHandleBar'

type DrawerPeekStripProps = {
  show: boolean
  onRequestOpen: () => void
  dragThresholdPx?: number
}

export function DrawerPeekStrip({
  show,
  onRequestOpen,
  dragThresholdPx = 40,
}: DrawerPeekStripProps) {
  const dragRef = useRef<{ pointerId: number; startY: number } | null>(null)

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId)
      return
    const deltaUp = dragRef.current.startY - event.clientY
    if (deltaUp >= dragThresholdPx) {
      onRequestOpen()
      dragRef.current = null
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // noop
      }
    }
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId)
      return
    dragRef.current = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // noop
    }
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="button"
      tabIndex={0}
      aria-label="손잡이를 누른 채 위로 드래그하여 패널 열기"
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onRequestOpen()
        }
      }}
    >
      <div className="mx-auto max-w-lg rounded-t-[12px] border border-b-0 border-line-2 bg-white px-4 pb-0 pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col items-center">
          <DrawerHandleBar size="sm" className="bg-[#dcdcdc]" />
          <div
            className="mt-2.5 h-2 w-full rounded-t-[4px] bg-bg-dark"
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
