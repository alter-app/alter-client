import axiosInstance from '@/shared/lib/axiosInstance'
import { getAuthApiBasePath } from '@/shared/lib/authApiPath'
import { unwrapCursorPage, type CursorPage } from '@/shared/lib/cursorPage'
import type { CommonApiResponse } from '@/shared/types/common'
import type {
  ChatMessageDto,
  ChatRoomDetailDto,
  ChatRoomListItemDto,
  CreateChatRoomRequest,
  CreateChatRoomResponseDto,
  MarkChatRoomReadRequest,
} from '@/features/chat/types/dto'

export type ChatApiScope = 'MANAGER' | 'USER' | null | undefined

/** `/app/chat` | `/manager/chat` */
function chatBasePath(scope: ChatApiScope): string {
  return `/${getAuthApiBasePath(scope)}/chat`
}

/** 채팅 엔드포인트는 CommonApiResponse 로 감싼 응답과 날 응답이 섞여 있어 둘 다 받습니다 */
function unwrapData<T extends object>(body: CommonApiResponse<T> | T): T {
  return 'data' in body ? body.data : body
}

export interface ChatRoomsQueryParams {
  pageSize: number
  cursor?: string
}

/** GET /{app|manager}/chat/rooms */
export async function fetchChatRooms(
  scope: ChatApiScope,
  params: ChatRoomsQueryParams
): Promise<CursorPage<ChatRoomListItemDto>> {
  const response = await axiosInstance.get<
    | CursorPage<ChatRoomListItemDto>
    | CommonApiResponse<CursorPage<ChatRoomListItemDto>>
  >(`${chatBasePath(scope)}/rooms`, {
    params: {
      pageSize: params.pageSize,
      ...(params.cursor !== undefined && { cursor: params.cursor }),
    },
  })
  return unwrapCursorPage(response.data)
}

export interface ChatMessagesQueryParams {
  pageSize: number
  /** 위로 당겨 과거 메시지를 가져올 때의 커서 */
  cursor?: string
}

/** GET /{app|manager}/chat/rooms/{roomId}/messages */
export async function fetchChatMessages(
  scope: ChatApiScope,
  roomId: number,
  params: ChatMessagesQueryParams
): Promise<CursorPage<ChatMessageDto>> {
  const response = await axiosInstance.get<
    CursorPage<ChatMessageDto> | CommonApiResponse<CursorPage<ChatMessageDto>>
  >(`${chatBasePath(scope)}/rooms/${roomId}/messages`, {
    params: {
      pageSize: params.pageSize,
      ...(params.cursor !== undefined && { cursor: params.cursor }),
    },
  })
  return unwrapCursorPage(response.data)
}

/** GET /{app|manager}/chat/rooms/{roomId} — 목록 캐시 없이 진입했을 때의 방 정보 */
export async function fetchChatRoomDetail(
  scope: ChatApiScope,
  roomId: number
): Promise<ChatRoomDetailDto> {
  const response = await axiosInstance.get<
    CommonApiResponse<ChatRoomDetailDto> | ChatRoomDetailDto
  >(`${chatBasePath(scope)}/rooms/${roomId}`)
  return unwrapData(response.data)
}

/**
 * POST /{app|manager}/chat/rooms/{roomId}/read
 * 서버가 last_read 를 갱신하므로 어디까지 읽었는지 함께 보냅니다. 멱등·clamp 처리됩니다.
 */
export async function markChatRoomRead(
  scope: ChatApiScope,
  roomId: number,
  lastReadMessageId: number
): Promise<void> {
  const body: MarkChatRoomReadRequest = { lastReadMessageId }
  await axiosInstance.post(`${chatBasePath(scope)}/rooms/${roomId}/read`, body)
}

/** POST /{app|manager}/chat/rooms — 이미 방이 있으면 서버가 기존 방을 반환합니다 */
export async function createChatRoom(
  scope: ChatApiScope,
  body: CreateChatRoomRequest
): Promise<CreateChatRoomResponseDto> {
  const response = await axiosInstance.post<
    CommonApiResponse<CreateChatRoomResponseDto> | CreateChatRoomResponseDto
  >(`${chatBasePath(scope)}/rooms`, body)
  return unwrapData(response.data)
}
