import type {
  ChatAttachmentDto,
  ChatMessageType,
  ChatParticipantScope,
} from '@/features/chat/types/dto'

export type { ChatParticipantScope, ChatMessageType }

/** 이미지 첨부 — 낙관적 렌더 중에는 `url` 이 로컬 object URL 입니다 */
export type ChatAttachment = ChatAttachmentDto

/** 메시지 한 건에 붙일 수 있는 이미지 수 — 초과분은 서버가 거부합니다 */
export const CHAT_ATTACHMENT_MAX_COUNT = 10

/** 채팅 탭 세그먼트 — 개인(1:1) · 전체(소속 업장 단위 단체방) */
export type ChatSegment = 'personal' | 'group'

export const CHAT_SEGMENTS: ChatSegment[] = ['personal', 'group']

export const CHAT_SEGMENT_LABEL: Record<ChatSegment, string> = {
  personal: '개인 채팅',
  group: '전체 채팅',
}

/** 텍스트 전용 · 최대 1000자 */
export const CHAT_MESSAGE_MAX_LENGTH = 1000

/** 목록 행·방 상세가 공유하는 방 표현 — 두 API 가 같은 필드셋을 내려줍니다 */
export interface ChatRoomSummary {
  id: number
  segment: ChatSegment
  /** 서버 `roomName` — 개인=상대 이름 · 전체=업장 이름 */
  title: string
  profileImageUrl: string | null
  /** 활성 멤버 수 — 서버가 주지 않으면 undefined (헤더·목록은 전체 채팅에서만 노출) */
  memberCount?: number
  /** 전체 채팅방에는 상대방 개념이 없어 undefined */
  opponentId?: number
  opponentScope?: ChatParticipantScope
}

/** 채팅 목록 행 */
export interface ChatRoomListItem extends ChatRoomSummary {
  latestMessage: string
  /** 정렬·상대 시각 표기 기준 */
  updatedAt: string
  unreadCount: number
}

/** 딥링크로 방에 바로 진입해 목록 캐시가 없을 때 헤더·발신자 판별을 채웁니다 */
export type ChatRoomDetail = ChatRoomSummary

/** 낙관적 전송 상태 — STOMP echo 수신 전까지 pending */
export type ChatMessageStatus = 'sent' | 'pending' | 'failed'

/** 채팅방 메시지 */
export interface ChatMessage {
  id: number
  /** 낙관적 메시지 식별용 — 서버 echo 로 대체되면 제거됩니다 */
  clientId?: string
  senderId: number
  senderScope: ChatParticipantScope
  senderName: string
  senderProfileImageUrl: string | null
  /** 이미지 전용 메시지는 빈 문자열 */
  content: string
  createdAt: string
  isMine: boolean
  status: ChatMessageStatus
  messageType: ChatMessageType
  attachments: ChatAttachment[]
  /** 이 메시지를 아직 읽지 않은 멤버 수 — 서버가 주지 않으면 undefined */
  unreadCount?: number
}

/** 날짜 구분선을 포함한 렌더 단위 */
export type ChatTimelineEntry =
  | { kind: 'date'; key: string; label: string }
  | {
      kind: 'message'
      key: string
      message: ChatMessage
      showSenderMeta: boolean
    }

/** 채팅방 헤더·전송 경로 산출에 필요한 최소 정보 */
export interface ChatRoomContext {
  id: number
  segment: ChatSegment
  title: string
  /** 전체 채팅 헤더의 "멤버 N" 표기 — 개인 채팅에서는 쓰지 않습니다 */
  memberCount?: number
}

/** 새 채팅 상대 후보 */
export interface ChatContact {
  /** `${scope}:${id}` — 동료·점주 목록을 합칠 때 키 충돌 방지 */
  key: string
  id: number
  scope: ChatParticipantScope
  name: string
  profileImageUrl: string | null
  workspaceName: string
  /** 이미 방이 있으면 해당 roomId — '대화중' 표시 및 기존 방 재사용 */
  existingRoomId?: number
}

/** STOMP 연결 상태 — 안내 문구는 중립 톤(text70)으로 노출 */
export type ChatConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
