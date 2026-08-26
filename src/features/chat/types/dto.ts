/**
 * 채팅 서버 응답 shape — USER(`/app/chat/*`) · MANAGER(`/manager/chat/*`) 공통.
 * 스펙에 아직 없는 필드(방별 미읽음·발신자 이름)와 구 배포본에 없는 필드(방 타입·표시명·인원수)는
 * optional 로 두고 클라이언트에서 폴백합니다.
 */

/** 클라이언트 도메인 표현 — 서버의 APP 을 USER 로 정규화해 씁니다 */
export type ChatParticipantScope = 'USER' | 'MANAGER'

/** 서버 enum — 알바생은 USER 가 아니라 APP */
export type ChatServerScope = 'APP' | 'MANAGER'

/** 서버 enum 직렬화 — `{ value, description }` 객체가 표준이고 평문도 올 수 있습니다 */
export type DescribedEnumDto<T extends string> =
  | T
  | { value: T; description?: string }

/**
 * scope 직렬화가 엔드포인트마다 다릅니다.
 * 방 목록은 평문 `"APP"`, 방 상세·메시지는 `{ value, description }` 객체로 내려옵니다.
 */
export type ChatScopeDto = DescribedEnumDto<string>

/** DIRECT=1:1, GROUP=업장 단위 단체방 */
export type ChatRoomTypeValue = 'DIRECT' | 'GROUP'

export type ChatRoomTypeDto = DescribedEnumDto<ChatRoomTypeValue>

export type ChatMessageType = 'NORMAL' | 'NOTICE'

export interface ChatAttachmentDto {
  fileId: string
  url: string
}

/**
 * 목록·정보 응답의 공통 필드셋.
 * GROUP 방은 상대방 개념이 없어 `opponentXxx` 가 모두 null 로 내려옵니다.
 */
interface ChatRoomBaseDto {
  id: number
  /** 구 배포본에는 없어 optional — 없으면 상대방 유무로 추론합니다 */
  type?: ChatRoomTypeDto
  /** 방 표시명 — GROUP=업장명, DIRECT=상대방 이름 */
  roomName?: string | null
  /** 활성 멤버 수 — DIRECT 도 실제값(2)이 내려옵니다 */
  memberCount?: number
  opponentId: number | null
  opponentScope: ChatScopeDto | null
  opponentName: string | null
  /** presigned URL — 없으면 Avatar 기본 프로필로 폴백 */
  opponentProfileImageUrl?: string | null
  createdAt: string
  updatedAt: string
}

/** GET /{app|manager}/chat/rooms */
export interface ChatRoomListItemDto extends ChatRoomBaseDto {
  latestMessageContent: string | null
  /** API 미제공 — 없으면 0으로 간주 (목록 뱃지·Docbar 뱃지 소스) */
  unreadCount?: number
}

/** GET /{app|manager}/chat/rooms/{chatRoomId} — 딥링크 진입 시 헤더 정보 */
export type ChatRoomDetailDto = ChatRoomBaseDto

/** GET /{app|manager}/chat/rooms/{id}/messages · 구독 /sub/chat.{id} 페이로드 */
export interface ChatMessageDto {
  id: number
  chatRoomId?: number
  senderId: number
  senderScope: ChatScopeDto
  type?: ChatMessageType
  /** 이미지 전용 메시지는 null */
  content: string | null
  createdAt: string
  isMine?: boolean
  /** 이 메시지를 아직 읽지 않은 멤버 수 */
  unreadCount?: number
  attachments?: ChatAttachmentDto[]
  /** API 미제공 — 단체방 발신자 표기에 필요 */
  senderName?: string
  senderProfileImageUrl?: string | null
}

/** POST /{app|manager}/chat/rooms */
export interface CreateChatRoomRequest {
  opponentUserId: number
  opponentScope: ChatServerScope
}

export interface CreateChatRoomResponseDto {
  chatRoomId: number
}

/** POST /{app|manager}/chat/rooms/{id}/read */
export interface MarkChatRoomReadRequest {
  lastReadMessageId: number
}

/** GET /{app|manager}/chat/workspace/{workspaceId}/room */
export interface WorkspaceGroupChatRoomDto {
  chatRoomId: number
}

/** 발행 /pub/{app|manager}/send.{id} */
export interface SendChatMessagePayload {
  content?: string
  type?: ChatMessageType
  /** 최대 10개 */
  fileIds?: string[]
}
