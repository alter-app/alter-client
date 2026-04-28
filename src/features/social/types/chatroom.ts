export interface CursorPaginatedApiResponseChatRoomListResponseDto {
  page: ChatRoomPageDto
  data: ChatRoomListResponseDto[]
}

export interface ChatRoomPageDto {
  cursor: string | null
  pageSize: number
}

export interface ChatRoomListResponseDto {
  id: number
  opponentId: number
  opponentScope: string
  opponentName: string
  latestMessageContent: string
  createdAt: string
  updatedAt: string
}

export interface ChatRoomListQueryParams {
  cursor?: string
  pageSize: number
}

export interface CreateChatRoomRequestDto {
  opponentUserId: number
  opponentScope: string
}

export interface ChatRoomResponseDto {
  timestamp: string
  data: {
    chatRoomId: number
  }
}
