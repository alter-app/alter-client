import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useChatListViewModel } from '@/features/chat/hooks/useChatListViewModel'
import { ChatSegmentTab } from '@/features/chat/ui/ChatSegmentTab'
import { SwipeableChatRoomItem } from '@/features/chat/ui/ChatRoomListItem'
import {
  ChatRoomListEmpty,
  ChatRoomListError,
  ChatRoomListSkeleton,
} from '@/features/chat/ui/ChatRoomListStates'
import { NewChatFab } from '@/features/chat/ui/NewChatFab'
import { NewChatSheet } from '@/features/chat/ui/NewChatSheet'
import { useNavbarNotificationProps } from '@/features/notification'
import { chatRoomPath } from '@/shared/constants/routes'
import { Navbar } from '@/shared/ui/common/Navbar'
import { SearchBar } from '@/shared/ui/common/SearchBar'
import { Spinner } from '@/shared/ui/Spinner'

const EMPTY_COPY = {
  personal: {
    title: '아직 대화가 없어요',
    description: '＋ 버튼을 눌러 동료나 점주님과 대화를 시작해보세요.',
  },
  group: {
    title: '참여 중인 전체 채팅방이 없어요',
    description: '업장에 소속되면 단체방이 자동으로 만들어져요.',
  },
} as const

export function ChatRoomsPage() {
  const navigate = useNavigate()
  const notificationProps = useNavbarNotificationProps()
  const [isNewChatOpen, setNewChatOpen] = useState(false)

  const {
    segment,
    changeSegment,
    keyword,
    setKeyword,
    rooms,
    isLoading,
    isError,
    isEmpty,
    hasKeyword,
    unreadCountBySegment,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChatListViewModel()

  const sentinelRef = useRef<HTMLDivElement>(null)
  // sentinel은 로딩 후에야 마운트되므로 deps에 isLoading·개수가 있어야 관찰이 붙는다
  const visibleCount = rooms.length

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, visibleCount])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Navbar {...notificationProps} showBorder={false} />

      <ChatSegmentTab
        activeSegment={segment}
        onSegmentChange={changeSegment}
        unreadCountBySegment={unreadCountBySegment}
      />

      <div className="px-4 py-3">
        <SearchBar
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          placeholder="이름 또는 대화 내용 검색"
          aria-label="채팅 검색"
        />
      </div>

      <main className="flex flex-1 flex-col pb-24">
        {isLoading ? <ChatRoomListSkeleton /> : null}

        {isError && !isLoading ? (
          <ChatRoomListError onRetry={() => void refetch()} />
        ) : null}

        {isEmpty && hasKeyword ? (
          <ChatRoomListEmpty
            title="검색 결과가 없어요"
            description="다른 이름이나 키워드로 검색해보세요."
          />
        ) : null}

        {isEmpty && !hasKeyword ? (
          <ChatRoomListEmpty {...EMPTY_COPY[segment]} />
        ) : null}

        {!isLoading && !isError && rooms.length > 0 ? (
          <>
            <ul>
              {rooms.map(room => (
                <li key={`${room.segment}-${room.id}`}>
                  <SwipeableChatRoomItem
                    room={room}
                    onClick={() => navigate(chatRoomPath(room.id))}
                  />
                </li>
              ))}
            </ul>
            <div
              ref={sentinelRef}
              className="flex h-10 items-center justify-center"
              aria-hidden={!isFetchingNextPage}
            >
              {isFetchingNextPage ? <Spinner size={24} /> : null}
            </div>
          </>
        ) : null}
      </main>

      {segment === 'personal' ? (
        <NewChatFab onClick={() => setNewChatOpen(true)} />
      ) : null}

      <NewChatSheet
        isOpen={isNewChatOpen}
        onClose={() => setNewChatOpen(false)}
      />
    </div>
  )
}
