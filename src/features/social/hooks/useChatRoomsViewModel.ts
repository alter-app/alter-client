import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'
import { fetchChatRooms } from '@/features/social/api/chatroom'
import type { ChatRoomListResponseDto } from '@/features/social/types/chatroom'

const CHATROOM_PAGE_SIZE = 20

export interface SocialListItemViewData {
  id: number
  name: string
  message: string
  timeAgo: string
  unread: boolean
}

function toRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '-'
  return `${formatDistanceToNowStrict(date, { locale: ko })} 전`
}

function adaptChatRoomToItem(
  room: ChatRoomListResponseDto
): SocialListItemViewData {
  return {
    id: room.id,
    name: room.opponentName,
    message: room.latestMessageContent,
    timeAgo: toRelativeTime(room.updatedAt),
    unread: false,
  }
}

export function useChatRoomsViewModel() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['chatRooms', 'list', { pageSize: CHATROOM_PAGE_SIZE }],
    queryFn: () =>
      fetchChatRooms({
        pageSize: CHATROOM_PAGE_SIZE,
      }),
  })

  const chatRooms = useMemo(
    () => data?.data.map(adaptChatRoomToItem) ?? [],
    [data]
  )

  return {
    chatRooms,
    isLoading: isPending,
    isError,
  }
}
