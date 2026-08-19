import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChatRoomsQuery } from '@/features/chat/hooks/query/useChatRoomsQuery'
import {
  readLastChatSegment,
  writeLastChatSegment,
} from '@/features/chat/lib/segmentPreference'
import {
  buildGroupChatRooms,
  useGroupChatMockStore,
} from '@/features/chat/mock/groupChatMockStore'
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

  const personalQuery = useChatRoomsQuery()
  const messagesByRoomId = useGroupChatMockStore(
    state => state.messagesByRoomId
  )
  const unreadByRoomId = useGroupChatMockStore(state => state.unreadByRoomId)
  const groupRooms = useMemo(
    () => buildGroupChatRooms(messagesByRoomId, unreadByRoomId),
    [messagesByRoomId, unreadByRoomId]
  )
  const setUnreadCount = useChatUnreadStore(state => state.setUnreadCount)

  const personalUnread = useMemo(
    () => sumUnread(personalQuery.rooms),
    [personalQuery.rooms]
  )
  const groupUnread = useMemo(() => sumUnread(groupRooms), [groupRooms])

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

  const isPersonal = segment === 'personal'
  const sourceRooms = isPersonal ? personalQuery.rooms : groupRooms

  const rooms = useMemo(
    () => sortRooms(sourceRooms).filter(room => matchesKeyword(room, keyword)),
    [sourceRooms, keyword]
  )

  const isLoading = isPersonal ? personalQuery.isLoading : false
  const isError = isPersonal ? personalQuery.isError : false
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
    refetch: personalQuery.refetch,
    hasNextPage: isPersonal && personalQuery.hasNextPage,
    isFetchingNextPage: isPersonal && personalQuery.isFetchingNextPage,
    fetchNextPage: personalQuery.fetchNextPage,
  }
}
