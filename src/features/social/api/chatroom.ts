import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ChatRoomListQueryParams,
  CursorPaginatedApiResponseChatRoomListResponseDto,
} from '@/features/social/types/chatroom'

export async function fetchChatRooms(
  params: ChatRoomListQueryParams
): Promise<CursorPaginatedApiResponseChatRoomListResponseDto> {
  const response =
    await axiosInstance.get<CursorPaginatedApiResponseChatRoomListResponseDto>(
      '/manager/chat/rooms',
      {
        params: {
          pageSize: params.pageSize,
          ...(params.cursor !== undefined && { cursor: params.cursor }),
        },
      }
    )
  return response.data
}
