import { cn } from '@/shared/lib/utils'
import { Avatar } from '@/shared/ui/common/Avatar'
import { formatMessageTime } from '@/features/chat/lib/chatTime'
import type { ChatMessage } from '@/features/chat/types/chat'

interface ChatBubbleProps {
  message: ChatMessage
  /** 전체 채팅에서 발신자가 바뀌는 첫 메시지에만 이름·아바타를 노출합니다 */
  showSenderMeta?: boolean
  /** 아바타 자리 유지 — 전체 채팅에서 같은 발신자의 연속 메시지 정렬용 */
  reserveAvatarSpace?: boolean
}

const AVATAR_SIZE = 36

export function ChatBubble({
  message,
  showSenderMeta = false,
  reserveAvatarSpace = false,
}: ChatBubbleProps) {
  const timeLabel = formatMessageTime(message.createdAt)
  const isPending = message.status === 'pending'
  const isFailed = message.status === 'failed'

  const hasAttachments = message.attachments.length > 0
  const isNotice = message.messageType === 'NOTICE'

  const bubble = (
    <div
      className={cn(
        'flex max-w-[240px] flex-col gap-2 overflow-hidden whitespace-pre-wrap break-words rounded-[20px] px-5 py-3 typography-body01-regular',
        message.isMine
          ? 'rounded-br-[4px] bg-main text-white'
          : 'rounded-bl-[4px] border border-line-1 bg-white text-text-100',
        isNotice && 'border border-main bg-main-10 text-text-100',
        isPending && 'opacity-60',
        isFailed && 'border border-error'
      )}
    >
      {isNotice ? (
        <span className="typography-body03-semibold text-main">공지</span>
      ) : null}
      {hasAttachments
        ? message.attachments.map(attachment => (
            <img
              key={attachment.fileId}
              src={attachment.url}
              alt="첨부 이미지"
              className="max-h-[240px] w-full rounded-[12px] object-cover"
            />
          ))
        : null}
      {message.content ? <span>{message.content}</span> : null}
    </div>
  )

  const meta = (
    <span className="shrink-0 typography-doc text-text-70">
      {isFailed ? '전송 실패' : isPending ? '전송 중' : timeLabel}
    </span>
  )

  if (message.isMine) {
    return (
      <div className="flex items-end justify-end gap-2">
        {meta}
        {bubble}
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      {showSenderMeta ? (
        <Avatar
          src={message.senderProfileImageUrl}
          alt={message.senderName}
          size={AVATAR_SIZE}
        />
      ) : reserveAvatarSpace ? (
        <div
          aria-hidden
          className="shrink-0"
          style={{ width: AVATAR_SIZE, height: 1 }}
        />
      ) : null}

      <div className="flex min-w-0 flex-col gap-1">
        {showSenderMeta && message.senderName ? (
          <span className="typography-body03-regular text-text-70">
            {message.senderName}
          </span>
        ) : null}
        <div className="flex items-end gap-2">
          {bubble}
          {meta}
        </div>
      </div>
    </div>
  )
}
