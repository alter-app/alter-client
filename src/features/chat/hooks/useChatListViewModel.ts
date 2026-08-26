import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChatRoomsQuery } from '@/features/chat/hooks/query/useChatRoomsQuery'
import {
  readLastChatSegment,
  writeLastChatSegment,
} from '@/features/chat/lib/segmentPreference'
import type { ChatRoomListItem, ChatSegment } from '@/features/chat/types/chat'
import { useChatUnreadStore } from '@/shared/stores/useChatUnreadStore'

function sumUnread(rooms: ChatRoomListItem[]): number {
  return rooms.reduce((total, room) => total + room.unreadCount, 0)
}

function matchesKeyword(room: ChatRoomListItem, keyword: string): boolean {
  const normalized = keyword.trim().toLowerCase()
  if (!normalized) return true
  return (
    room.title.toLowerCase().includes(normalized) ||
    room.latestMessage.toLowerCase().includes(normalized)
  )
}

/** 미읽음 있는 방을 위로, 그다음 최신 갱신 순 */
function sortRooms(rooms: ChatRoomListItem[]): ChatRoomListItem[] {
  return [...rooms].sort((a, b) => {
    const unreadDiff = Number(b.unreadCount > 0) - Number(a.unreadCount > 0)
    if (unreadDiff !== 0) return unreadDiff
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function useChatListViewModel() {
  const [segment, setSegment] = useState<ChatSegment>(readLastChatSegment)
  const [keyword, setKeyword] = useState('')

  // 서버는 개인·전체를 한 커서 목록에 섞어 내려주므로 클라이언트에서 세그먼트로 나눕니다
  const roomsQuery = useChatRoomsQuery()
  const setUnreadCount = useChatUnreadStore(state => state.setUnreadCount)

  const roomsBySegment = useMemo(() => {
    const personal: ChatRoomListItem[] = []
    const group: ChatRoomListItem[] = []
    roomsQuery.rooms.forEach(room => {
      if (room.segment === 'group') group.push(room)
      else personal.push(room)
    })
    return { personal, group }
  }, [roomsQuery.rooms])

  const personalUnread = useMemo(
    () => sumUnread(roomsBySegment.personal),
    [roomsBySegment.personal]
  )
  const groupUnread = useMemo(
    () => sumUnread(roomsBySegment.group),
    [roomsBySegment.group]
  )

  // Docbar 채팅 뱃지 = 개인 + 전체 합산
  useEffect(() => {
    setUnreadCount('personal', personalUnread)
  }, [personalUnread, setUnreadCount])

  useEffect(() => {
    setUnreadCount('group', groupUnread)
  }, [groupUnread, setUnreadCount])

  const changeSegment = useCallback((next: ChatSegment) => {
    setSegment(next)
    setKeyword('')
    writeLastChatSegment(next)
  }, [])

  const sourceRooms = roomsBySegment[segment]
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = roomsQuery

  /** 한 페이지가 전부 반대 세그먼트일 수 있어, 현재 탭이 비었으면 다음 페이지를 더 봅니다 */
  const isAwaitingMorePages = sourceRooms.length === 0 && hasNextPage

  useEffect(() => {
    if (!isAwaitingMorePages || isFetchingNextPage) return
    void fetchNextPage()
  }, [isAwaitingMorePages, isFetchingNextPage, fetchNextPage])

  const rooms = useMemo(
    () => sortRooms(sourceRooms).filter(room => matchesKeyword(room, keyword)),
    [sourceRooms, keyword]
  )

  // 자동 추가 로드 중에는 빈 상태 대신 스켈레톤을 유지합니다
  const isLoading = roomsQuery.isLoading || isAwaitingMorePages
  const isError = roomsQuery.isError
  const hasKeyword = keyword.trim().length > 0

  return {
    segment,
    changeSegment,
    keyword,
    setKeyword,
    rooms,
    isLoading,
    isError,
    /** 검색 결과가 없는 경우와 방이 아예 없는 경우를 구분해 빈 상태 문구를 바꿉니다 */
    isEmpty: !isLoading && !isError && rooms.length === 0,
    hasKeyword,
    unreadCountBySegment: { personal: personalUnread, group: groupUnread },
    refetch: roomsQuery.refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}
