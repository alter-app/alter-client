import type {
  ChatMessage,
  ChatRoomDetail,
  ChatRoomListItem,
  ChatRoomSummary,
  ChatSegment,
} from '@/features/chat/types/chat'
import type {
  ChatMessageDto,
  ChatParticipantScope,
  ChatRoomDetailDto,
  ChatRoomListItemDto,
  ChatRoomTypeDto,
  ChatRoomTypeValue,
  ChatScopeDto,
  ChatServerScope,
  DescribedEnumDto,
} from '@/features/chat/types/dto'

/** `"APP"` 과 `{ value: "APP" }` 두 직렬화를 모두 값으로 풉니다 */
function unwrapEnum<T extends string>(
  value: DescribedEnumDto<T> | null | undefined
): T | undefined {
  if (value === null || value === undefined) return undefined
  return typeof value === 'string' ? value : value.value
}

/**
 * scope 를 도메인 표현으로 좁힙니다.
 * 서버는 평문 `"APP"` 과 `{ value: "APP" }` 두 형태를 섞어 쓰고, 알바생은 APP 으로 옵니다.
 */
export function toParticipantScope(
  value: ChatScopeDto | null | undefined
): ChatParticipantScope {
  return unwrapEnum(value) === 'MANAGER' ? 'MANAGER' : 'USER'
}

/** 상대방이 없는 전체 채팅방과 구분해야 해서 값이 없으면 undefined 로 둡니다 */
function toOptionalParticipantScope(
  value: ChatScopeDto | null | undefined
): ChatParticipantScope | undefined {
  return unwrapEnum(value) === undefined ? undefined : toParticipantScope(value)
}

/** 요청 바디용 — 서버 enum 은 USER 대신 APP */
export function toServerScope(scope: ChatParticipantScope): ChatServerScope {
  return scope === 'MANAGER' ? 'MANAGER' : 'APP'
}

/**
 * 방 타입 → 세그먼트.
 * `type` 이 없는 구 배포본에서는 상대방 유무로 추론합니다(GROUP 은 opponent 가 전부 null).
 */
export function toChatSegment(
  type: ChatRoomTypeDto | null | undefined,
  opponentId: number | null | undefined
): ChatSegment {
  const value: ChatRoomTypeValue | undefined = unwrapEnum(type)
  if (value === 'GROUP') return 'group'
  if (value === 'DIRECT') return 'personal'
  return opponentId === null || opponentId === undefined ? 'group' : 'personal'
}

/** 목록·상세가 공유하는 필드셋 변환 */
function adaptChatRoomSummary(
  dto: ChatRoomListItemDto | ChatRoomDetailDto
): ChatRoomSummary {
  return {
    id: dto.id,
    segment: toChatSegment(dto.type, dto.opponentId),
    // 서버가 roomName 을 주지 않는 구 배포본에서는 상대 이름으로 폴백합니다
    title: dto.roomName ?? dto.opponentName ?? '알 수 없음',
    profileImageUrl: dto.opponentProfileImageUrl ?? null,
    memberCount: dto.memberCount,
    opponentId: dto.opponentId ?? undefined,
    opponentScope: toOptionalParticipantScope(dto.opponentScope),
  }
}

export function adaptChatRoomListItem(
  dto: ChatRoomListItemDto
): ChatRoomListItem {
  return {
    ...adaptChatRoomSummary(dto),
    latestMessage: dto.latestMessageContent ?? '',
    updatedAt: dto.updatedAt,
    unreadCount: dto.unreadCount ?? 0,
  }
}

export function adaptChatRoomDetail(dto: ChatRoomDetailDto): ChatRoomDetail {
  return adaptChatRoomSummary(dto)
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
