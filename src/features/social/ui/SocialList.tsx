import { useRef, useState, type PointerEventHandler } from 'react'
import TrashIcon from '@/assets/icons/social/trash.svg'

interface SocialProfileProps {
  name: string
  message: string
  timeAgo: string
  unread?: boolean
  unreadCount?: number
}

interface SocialActionProps {
  onDelete?: () => void
}

interface SwipeableSocialItemProps extends SocialProfileProps {
  onDelete?: () => void
}

const ACTION_WIDTH = 72
const OPEN_THRESHOLD = ACTION_WIDTH * 0.45

export function SocialList({
  name,
  message,
  timeAgo,
  unread = false,
  unreadCount,
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

        <div className="flex justify-between items-center">
          <div className=" typography-body02-semibold text-text-100">
            {message}
          </div>
          {unread ? (
            <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sub px-1 text-white typography-body03-regular">
              {unreadCount ?? 1}
            </div>
          ) : null}
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
  onDelete,
  unreadCount,
}: SwipeableSocialItemProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const startTranslateXRef = useRef(0)

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = event => {
    if (event.button !== 0) return
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
        <SocialAction onDelete={onDelete} />
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
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </div>
  )
}

export function SocialAction({ onDelete }: SocialActionProps) {
  return (
    <div className="h-[64px] w-[60px] overflow-hidden ">
      <button
        type="button"
        onClick={onDelete}
        className="flex h-full w-full items-center justify-center bg-error text-white"
        aria-label="삭제"
      >
        <img src={TrashIcon} alt="삭제" />
      </button>
    </div>
  )
}
