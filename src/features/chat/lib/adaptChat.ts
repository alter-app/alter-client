import type {
  ChatMessage,
  ChatRoomDetail,
  ChatRoomListItem,
} from '@/features/chat/types/chat'
import type {
  ChatMessageDto,
  ChatParticipantScope,
  ChatRoomDetailDto,
  ChatRoomListItemDto,
  ChatScopeDto,
  ChatServerScope,
} from '@/features/chat/types/dto'

/**
 * scope 를 도메인 표현으로 좁힙니다.
 * 서버는 평문 `"APP"` 과 `{ value: "APP" }` 두 형태를 섞어 쓰고, 알바생은 APP 으로 옵니다.
 */
export function toParticipantScope(
  value: ChatScopeDto | null | undefined
): ChatParticipantScope {
  const raw = typeof value === 'string' ? value : value?.value
  return raw === 'MANAGER' ? 'MANAGER' : 'USER'
}

/** 요청 바디용 — 서버 enum 은 USER 대신 APP */
export function toServerScope(scope: ChatParticipantScope): ChatServerScope {
  return scope === 'MANAGER' ? 'MANAGER' : 'APP'
}

export function adaptChatRoomListItem(
  dto: ChatRoomListItemDto
): ChatRoomListItem {
  return {
    id: dto.id,
    segment: 'personal',
    title: dto.opponentName,
    profileImageUrl: dto.opponentProfileImageUrl ?? null,
    latestMessage: dto.latestMessageContent ?? '',
    updatedAt: dto.updatedAt,
    unreadCount: dto.unreadCount ?? 0,
    opponentId: dto.opponentId,
    opponentScope: toParticipantScope(dto.opponentScope),
  }
}

export function adaptChatRoomDetail(dto: ChatRoomDetailDto): ChatRoomDetail {
  return {
    id: dto.id,
    title: dto.opponentName,
    profileImageUrl: dto.opponentProfileImageUrl ?? null,
    opponentId: dto.opponentId,
    opponentScope: toParticipantScope(dto.opponentScope),
  }
}

export interface AdaptChatMessageOptions {
  /** 로그인 사용자 id — 있으면 발신자 비교로 내 메시지를 판별 */
  myId?: number
  /** 로그인 사용자 scope */
  myScope?: ChatParticipantScope
  /** 1:1 방 상대 정보 — myId 를 모를 때 폴백 판별에 사용 */
  opponentId?: number
  opponentScope?: ChatParticipantScope
  /** 상대 이름 — DTO에 senderName 이 없을 때 표시용 폴백 */
  opponentName?: string
}

/**
 * 내 메시지 판별 우선순위
 * 1. 서버의 `isMine`
 * 2. 로그인 사용자 id·scope 일치
 * 3. 1:1 방의 상대가 아니면 내 메시지 (단체방에서는 쓸 수 없어 마지막 순위)
 */
function resolveIsMine(
  dto: ChatMessageDto,
  senderScope: ChatParticipantScope,
  options: AdaptChatMessageOptions
): boolean {
  if (typeof dto.isMine === 'boolean') return dto.isMine

  if (options.myId !== undefined) {
    return dto.senderId === options.myId && senderScope === options.myScope
  }

  if (options.opponentId !== undefined) {
    return !(
      dto.senderId === options.opponentId &&
      senderScope === options.opponentScope
    )
  }

  return false
}

export function adaptChatMessage(
  dto: ChatMessageDto,
  options: AdaptChatMessageOptions = {}
): ChatMessage {
  const senderScope = toParticipantScope(dto.senderScope)
  const isMine = resolveIsMine(dto, senderScope, options)

  return {
    id: dto.id,
    senderId: dto.senderId,
    senderScope,
    senderName: dto.senderName ?? (isMine ? '' : (options.opponentName ?? '')),
    senderProfileImageUrl: dto.senderProfileImageUrl ?? null,
    content: dto.content ?? '',
    createdAt: dto.createdAt,
    isMine,
    status: 'sent',
    messageType: dto.type ?? 'NORMAL',
    attachments: dto.attachments ?? [],
    unreadCount: dto.unreadCount,
  }
}
