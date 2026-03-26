import { useRef, useState, type PointerEventHandler } from 'react'

interface SocialProfileProps {
  name: string
  message: string
  timeAgo: string
  unread?: boolean
}

interface SocialActionProps {
  onRead?: () => void
  onDelete?: () => void
}

interface SwipeableSocialItemProps extends SocialProfileProps {
  onRead?: () => void
  onDelete?: () => void
}

const ACTION_WIDTH = 160
const OPEN_THRESHOLD = ACTION_WIDTH * 0.45

export function SocialList({
  name,
  message,
  timeAgo,
  unread = false,
}: SocialProfileProps) {
  return (
    <div className="flex items-center gap-3 border-b border-line-1 py-3">
      <div className="h-12 w-12 shrink-0 rounded-full bg-[#efefef]" />

      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between ">
          <div className="typography-body01-semibold text-text-100">{name}</div>
          <div className="typography-body03-regular text-text-70">
            {timeAgo}
          </div>
        </div>

        <div className="flex justify-between">
          <div className=" typography-body02-semibold text-text-100">
            {message}
          </div>
          <div
            className={`h-3 w-3 rounded-full ${unread ? 'bg-error' : 'bg-transparent'}`}
          />
        </div>
      </div>
    </div>
  )
}

export function SwipeableSocialItem({
  name,
  message,
  timeAgo,
  unread = false,
  onRead,
  onDelete,
}: SwipeableSocialItemProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const startTranslateXRef = useRef(0)

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = event => {
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startTranslateXRef.current = translateX
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = event => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return

    const deltaX = event.clientX - startXRef.current
    const nextTranslateX = Math.min(
      0,
      Math.max(-ACTION_WIDTH, startTranslateXRef.current + deltaX)
    )
    setTranslateX(nextTranslateX)
  }

  const finishDrag = (pointerId: number) => {
    if (pointerIdRef.current !== pointerId) return

    pointerIdRef.current = null
    setIsDragging(false)
    setTranslateX(prev => (Math.abs(prev) > OPEN_THRESHOLD ? -ACTION_WIDTH : 0))
  }

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = event => {
    finishDrag(event.pointerId)
  }

  const handlePointerCancel: PointerEventHandler<HTMLDivElement> = event => {
    finishDrag(event.pointerId)
  }

  return (
    <div className="relative  overflow-hidden">
      <div className="absolute right-0 top-0 h-full flex items-center">
        <SocialAction onRead={onRead} onDelete={onDelete} />
      </div>

      <div
        className="bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        style={{
          touchAction: 'pan-y',
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <div className="px-4">
          <SocialList
            name={name}
            message={message}
            timeAgo={timeAgo}
            unread={unread}
          />
        </div>
      </div>
    </div>
  )
}

export function SocialAction({ onRead, onDelete }: SocialActionProps) {
  return (
    <div className="flex h-[64px] w-[160px] shrink-0 overflow-hidden rounded-[2px]">
      <button
        type="button"
        onClick={onRead}
        className="w-1/2 bg-[#e3e3e3] typography-body01-regular text-text-90"
      >
        읽음
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-1/2 bg-error typography-body01-regular text-white"
      >
        삭제
      </button>
    </div>
  )
}
