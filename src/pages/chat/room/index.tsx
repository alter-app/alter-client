import { useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useChatRoomViewModel } from '@/features/chat/hooks/useChatRoomViewModel'
import { AttachmentTray } from '@/features/chat/ui/AttachmentTray'
import { ChatBubble } from '@/features/chat/ui/ChatBubble'
import { ChatConnectionBanner } from '@/features/chat/ui/ChatConnectionBanner'
import { ChatDateDivider } from '@/features/chat/ui/ChatDateDivider'
import { MessageInput } from '@/features/chat/ui/MessageInput'
import { ROUTES } from '@/shared/constants/routes'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Skeleton } from '@/shared/ui/common/Skeleton'
import { Spinner } from '@/shared/ui/Spinner'

function MessagesSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-6" aria-busy>
      <Skeleton className="h-11 w-40 rounded-[20px]" />
      <Skeleton className="ml-auto h-11 w-32 rounded-[20px]" />
      <Skeleton className="h-11 w-52 rounded-[20px]" />
      <Skeleton className="ml-auto h-11 w-24 rounded-[20px]" />
    </div>
  )
}

export function ChatRoomPage() {
  const navigate = useNavigate()
  const { roomId: roomIdParam } = useParams<{ roomId: string }>()
  const roomId = Number(roomIdParam)

  const {
    room,
    timeline,
    isLoading,
    isError,
    isEmpty,
    refetch,
    hasOlderMessages,
    isFetchingOlderMessages,
    fetchOlderMessages,
    draft,
    setDraft,
    handleSend,
    sendImages,
    isSendingImages,
    retryFailedMessage,
    connectionState,
    isAttachmentOpen,
    toggleAttachment,
  } = useChatRoomViewModel(roomId)

  const scrollRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const lastEntryKey = timeline[timeline.length - 1]?.key
  /** 과거 메시지를 앞에 붙일 때 화면이 튀지 않도록 이전 높이를 기억합니다 */
  const previousScrollHeightRef = useRef(0)

  // 새 메시지가 붙으면 하단으로 붙입니다
  useEffect(() => {
    const el = scrollRef.current
    if (!el || isFetchingOlderMessages) return
    el.scrollTop = el.scrollHeight
  }, [lastEntryKey, isFetchingOlderMessages])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || !previousScrollHeightRef.current) return
    el.scrollTop = el.scrollHeight - previousScrollHeightRef.current
    previousScrollHeightRef.current = 0
  }, [timeline.length])

  useEffect(() => {
    const sentinel = topSentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasOlderMessages &&
          !isFetchingOlderMessages
        ) {
          previousScrollHeightRef.current = scrollRef.current?.scrollHeight ?? 0
          fetchOlderMessages()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasOlderMessages, isFetchingOlderMessages, fetchOlderMessages, isLoading])

  if (!Number.isFinite(roomId)) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <Navbar
          variant="detail"
          title="채팅"
          onBackClick={() => navigate(ROUTES.CHAT.ROOMS)}
        />
        <div className="flex flex-1 items-center justify-center px-6 text-center typography-body02-regular text-text-70">
          잘못된 채팅방이에요.
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title={room.title}
        onBackClick={() => navigate(ROUTES.CHAT.ROOMS)}
        rightAction={
          room.segment === 'group' && room.memberCount !== undefined ? (
            <span className="typography-body03-regular text-text-70">
              멤버 {room.memberCount}
            </span>
          ) : undefined
        }
      />

      <ChatConnectionBanner state={connectionState} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isLoading ? <MessagesSkeleton /> : null}

        {isError && !isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="typography-body02-regular text-text-70">
              대화를 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="h-11 rounded-[12px] border border-line-2 bg-white px-6 typography-body02-semibold text-text-100"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {!isLoading && !isError && isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="typography-body01-semibold text-text-100">
              대화를 시작해보세요
            </p>
            <p className="typography-body02-regular text-text-70">
              첫 메시지를 보내면 여기에 표시돼요.
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && !isEmpty ? (
          <div className="flex flex-col gap-2 px-4 py-4">
            <div
              ref={topSentinelRef}
              className="flex h-8 items-center justify-center"
              aria-hidden={!isFetchingOlderMessages}
            >
              {isFetchingOlderMessages ? <Spinner size={20} /> : null}
            </div>

            {timeline.map(entry => {
              if (entry.kind === 'date') {
                return <ChatDateDivider key={entry.key} label={entry.label} />
              }

              // 재전송은 낙관적 메시지(clientId 보유)에만 걸 수 있습니다
              const { clientId, status } = entry.message

              return (
                <ChatBubble
                  key={entry.key}
                  message={entry.message}
                  showSenderMeta={entry.showSenderMeta}
                  reserveAvatarSpace={room.segment === 'group'}
                  onRetry={
                    status === 'failed' && clientId
                      ? () => retryFailedMessage(clientId)
                      : undefined
                  }
                />
              )
            })}
          </div>
        ) : null}
      </div>

      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={handleSend}
        onToggleAttachment={toggleAttachment}
        isAttachmentOpen={isAttachmentOpen}
      />

      {isAttachmentOpen ? (
        <AttachmentTray
          onSelectImages={files => void sendImages(files)}
          isSending={isSendingImages}
        />
      ) : null}
    </div>
  )
}
