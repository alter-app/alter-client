import axiosInstance from '@/shared/lib/axiosInstance'
import type {
  ChatRoomListQueryParams,
  ChatRoomResponseDto,
  CreateChatRoomRequestDto,
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

export async function createOrGetChatRoom(
  payload: CreateChatRoomRequestDto
): Promise<ChatRoomResponseDto> {
  const response = await axiosInstance.post<ChatRoomResponseDto>(
    '/manager/chat/rooms',
    payload
  )
  return response.data
}
