import { useRef, useState } from 'react'
import TrashIcon from '@/assets/icons/social/trash.svg?react'
import AlterLogo from '@/assets/alter-logo-vector.svg?react'

export interface NotificationItemProps {
  isRead: boolean
  category: string
  timeAgo: string
  message: string
  highlightedWord?: string
  subLabel?: string
  onDelete?: () => void
  onClick?: () => void
}

const DELETE_WIDTH = 60
const SWIPE_THRESHOLD = DELETE_WIDTH / 2

function HighlightedMessage({
  message,
  highlightedWord,
}: {
  message: string
  highlightedWord?: string
}) {
  if (!highlightedWord) return <span>{message}</span>

  const idx = message.indexOf(highlightedWord)
  if (idx === -1) return <span>{message}</span>

  return (
    <>
      <span>{message.slice(0, idx)}</span>
      <span className="text-main">{highlightedWord}</span>
      <span>{message.slice(idx + highlightedWord.length)}</span>
    </>
  )
}

export function NotificationItem({
  isRead,
  category,
  timeAgo,
  message,
  highlightedWord,
  subLabel,
  onDelete,
  onClick,
}: NotificationItemProps) {
  const [offset, setOffset] = useState(0)
  const startXRef = useRef<number | null>(null)
  const isDragging = useRef(false)

  const startDrag = (clientX: number) => {
    if (!onDelete) return
    startXRef.current = clientX
    isDragging.current = true
  }

  const moveDrag = (clientX: number) => {
    if (!isDragging.current || startXRef.current === null) return
    const diff = clientX - startXRef.current
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, diff)))
  }

  const endDrag = () => {
    if (!isDragging.current) return
    isDragging.current = false
    setOffset(offset < -SWIPE_THRESHOLD ? -DELETE_WIDTH : 0)
    startXRef.current = null
  }

  const handleTouchStart = (e: React.TouchEvent) =>
    startDrag(e.touches[0].clientX)
  const handleTouchMove = (e: React.TouchEvent) =>
    moveDrag(e.touches[0].clientX)
  const handleTouchEnd = endDrag

  const handleMouseDown = (e: React.MouseEvent) => startDrag(e.clientX)
  const handleMouseMove = (e: React.MouseEvent) => moveDrag(e.clientX)
  const handleMouseUp = endDrag

  const handleDelete = () => {
    setOffset(0)
    onDelete?.()
  }

  return (
    <div className="relative w-full overflow-hidden">
      {onDelete && (
        <button
          type="button"
          className="absolute bottom-0 right-0 top-0 flex w-[60px] items-center justify-center bg-error"
          aria-label="알림 삭제"
          onClick={handleDelete}
        >
          <TrashIcon className="size-5 text-white" />
        </button>
      )}

      <button
        type="button"
        className={`flex w-full items-start text-left transition-transform ${isRead ? 'bg-white' : 'bg-main-100'}`}
        style={
          offset !== 0
            ? { transform: `translateX(${offset}px)`, transition: 'none' }
            : undefined
        }
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => {
          if (offset !== 0) {
            setOffset(0)
            return
          }
          onClick?.()
        }}
      >
        <AlterLogo
          className="mt-[15px] ml-[18px] size-5 shrink-0 text-main"
          aria-hidden
        />
        <div className="ml-[10px] flex flex-1 min-w-0 flex-col gap-2 py-5 pr-5">
          <div className="flex items-center justify-between gap-2 typography-bg">
            <span className="min-w-0 truncate text-text-100">{category}</span>
            <span
              className={`shrink-0 whitespace-nowrap ${isRead ? 'text-text-70' : 'text-text-50'}`}
            >
              {timeAgo}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="whitespace-pre-line typography-body03-semibold text-text-100">
              <HighlightedMessage
                message={message}
                highlightedWord={highlightedWord}
              />
            </p>
            {subLabel && (
              <p className="typography-bg text-text-70">{subLabel}</p>
            )}
          </div>
        </div>
      </button>
    </div>
  )
}
