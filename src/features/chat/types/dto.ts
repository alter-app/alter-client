/**
 * 채팅 서버 응답 shape — USER(`/app/chat/*`) · MANAGER(`/manager/chat/*`) 공통.
 * 스펙에 아직 없는 필드(프로필 이미지·방별 미읽음·발신자 이름)는 optional 로 두고 클라이언트에서 폴백합니다.
 */

/** 클라이언트 도메인 표현 — 서버의 APP 을 USER 로 정규화해 씁니다 */
export type ChatParticipantScope = 'USER' | 'MANAGER'

/** 서버 enum — 알바생은 USER 가 아니라 APP */
export type ChatServerScope = 'APP' | 'MANAGER'

/**
 * scope 직렬화가 엔드포인트마다 다릅니다.
 * 방 목록은 평문 `"APP"`, 방 상세·메시지는 `{ value, description }` 객체로 내려옵니다.
 */
export type ChatScopeDto = string | { value: string; description?: string }

export type ChatMessageType = 'NORMAL' | 'NOTICE'

export interface ChatAttachmentDto {
  fileId: string
  url: string
}

/** GET /{app|manager}/chat/rooms */
export interface ChatRoomListItemDto {
  id: number
  opponentId: number
  opponentScope: ChatScopeDto
  opponentName: string
  /** API 미제공 — 없으면 Avatar 기본 프로필로 폴백 */
  opponentProfileImageUrl?: string | null
  latestMessageContent: string | null
  /** API 미제공 — 없으면 0으로 간주 (목록 뱃지·Docbar 뱃지 소스) */
  unreadCount?: number
  createdAt: string
  updatedAt: string
}

/** GET /{app|manager}/chat/rooms/{chatRoomId} — 딥링크 진입 시 헤더 정보 */
export interface ChatRoomDetailDto {
  id: number
  opponentId: number
  opponentScope: ChatScopeDto
  opponentName: string
  opponentProfileImageUrl?: string | null
  createdAt: string
  updatedAt: string
}

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
