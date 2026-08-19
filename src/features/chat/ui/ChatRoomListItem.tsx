import { useRef, useState, type PointerEventHandler } from 'react'
import TrashIcon from '@/assets/icons/social/trash.svg'
import { cn } from '@/shared/lib/utils'
import { Avatar } from '@/shared/ui/common/Avatar'
import { UnreadBadge } from '@/shared/ui/common/UnreadBadge'
import { formatChatListTime } from '@/features/chat/lib/chatTime'
import type { ChatRoomListItem as ChatRoomListItemModel } from '@/features/chat/types/chat'

const ACTION_WIDTH = 72
const OPEN_THRESHOLD = ACTION_WIDTH * 0.45
/** 세로 스크롤과 구분하기 위한 가로 이동 최소값 */
const HORIZONTAL_INTENT = 8

interface ChatRoomRowProps {
  room: ChatRoomListItemModel
  onClick?: () => void
}

export function ChatRoomRow({ room, onClick }: ChatRoomRowProps) {
  const hasUnread = room.unreadCount > 0

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line-1 px-4 py-3 text-left"
    >
      <Avatar src={room.profileImageUrl} alt={room.title} size={48} />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate typography-body01-semibold text-text-100">
            {room.title}
            {room.memberCount !== undefined && (
              <span className="ml-1 typography-body03-regular text-text-50">
                {room.memberCount}
              </span>
            )}
          </span>
          <span className="shrink-0 typography-body03-regular text-text-70">
            {formatChatListTime(room.updatedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'truncate',
              hasUnread
                ? 'typography-body02-semibold text-text-100'
                : 'typography-body02-regular text-text-70'
            )}
          >
            {room.latestMessage || '대화를 시작해보세요'}
          </span>
          <UnreadBadge count={room.unreadCount} />
        </div>
      </div>
    </button>
  )
}

interface SwipeableChatRoomItemProps extends ChatRoomRowProps {
  /** P1 — 스와이프 삭제는 백엔드 지원 후 연결합니다 */
  onDelete?: () => void
}

export function SwipeableChatRoomItem({
  room,
  onClick,
  onDelete,
}: SwipeableChatRoomItemProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const pointerIdRef = useRef<number | null>(null)
  const startXRef = useRef(0)
  const startTranslateXRef = useRef(0)
  const didSwipeRef = useRef(false)

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = event => {
    if (event.button !== 0) return
    pointerIdRef.current = event.pointerId
    startXRef.current = event.clientX
    startTranslateXRef.current = translateX
    didSwipeRef.current = false
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = event => {
    if (!isDragging || pointerIdRef.current !== event.pointerId) return

    const deltaX = event.clientX - startXRef.current
    if (Math.abs(deltaX) > HORIZONTAL_INTENT) {
      didSwipeRef.current = true
    }
    setTranslateX(
      Math.min(0, Math.max(-ACTION_WIDTH, startTranslateXRef.current + deltaX))
    )
  }

  const finishDrag = (pointerId: number) => {
    if (pointerIdRef.current !== pointerId) return

    pointerIdRef.current = null
    setIsDragging(false)
    setTranslateX(prev => (Math.abs(prev) > OPEN_THRESHOLD ? -ACTION_WIDTH : 0))
  }

  /** 스와이프 제스처가 방 진입으로 오인되지 않도록 클릭을 걸러냅니다 */
  const handleRowClick = () => {
    if (didSwipeRef.current || translateX !== 0) {
      setTranslateX(0)
      return
    }
    onClick?.()
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute right-0 top-0 flex h-full items-center">
        <button
          type="button"
          onClick={onDelete}
          className="flex h-[72px] w-[60px] items-center justify-center bg-error text-white"
          aria-label="채팅방 삭제"
        >
          <img src={TrashIcon} alt="" aria-hidden />
        </button>
      </div>

      <div
        className="bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={event => finishDrag(event.pointerId)}
        onPointerCancel={event => finishDrag(event.pointerId)}
        style={{
          touchAction: 'pan-y',
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <ChatRoomRow room={room} onClick={handleRowClick} />
      </div>
    </div>
  )
}
