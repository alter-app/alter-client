import { useRef, type ChangeEvent, type KeyboardEvent } from 'react'
import SendIcon from '@/assets/icons/socialvector.svg'
import { cn } from '@/shared/lib/utils'
import {
  canSendMessage,
  clampMessageDraft,
  isMessageDraftAtLimit,
} from '@/features/chat/lib/messageDraft'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/features/chat/types/chat'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  /** ＋ 버튼 — 첨부 트레이 토글 (P1, 디자인만) */
  onToggleAttachment?: () => void
  isAttachmentOpen?: boolean
  disabled?: boolean
}

const MAX_TEXTAREA_ROWS_HEIGHT = 96

export function MessageInput({
  value,
  onChange,
  onSend,
  onToggleAttachment,
  isAttachmentOpen = false,
  disabled = false,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const canSend = !disabled && canSendMessage(value)
  const atLimit = isMessageDraftAtLimit(value)

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_ROWS_HEIGHT)}px`
  }

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(clampMessageDraft(event.target.value))
    resize()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter 는 줄바꿈, Enter 단독은 전송
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return
    event.preventDefault()
    if (canSend) onSend()
  }

  const handleSendClick = () => {
    if (!canSend) return
    onSend()
    const el = textareaRef.current
    if (el) el.style.height = 'auto'
  }

  return (
    <div className="border-t border-line-1 bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={onToggleAttachment}
          aria-label="첨부"
          aria-expanded={isAttachmentOpen}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-2xl leading-none transition-colors',
            isAttachmentOpen
              ? 'bg-main-100 text-main'
              : 'bg-bg-light text-text-70'
          )}
        >
          <span
            className={cn(
              'transition-transform',
              isAttachmentOpen && 'rotate-45'
            )}
          >
            +
          </span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            placeholder="메시지 입력"
            aria-label="메시지 입력"
            className="max-h-24 w-full resize-none bg-transparent py-2 typography-body01-regular text-text-100 outline-none placeholder:text-text-50 disabled:text-text-50"
          />
          {atLimit ? (
            <p className="typography-doc text-error" role="status">
              최대 {CHAT_MESSAGE_MAX_LENGTH}자까지 입력할 수 있어요.
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleSendClick}
          disabled={!canSend}
          aria-label="전송"
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors',
            canSend ? 'bg-main' : 'bg-bg-dark'
          )}
        >
          <img
            src={SendIcon}
            alt=""
            aria-hidden
            className={cn(
              'h-4 w-4',
              canSend ? 'brightness-0 invert' : 'opacity-40'
            )}
          />
        </button>
      </div>
    </div>
  )
}
