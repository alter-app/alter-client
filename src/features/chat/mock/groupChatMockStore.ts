import { create } from 'zustand'
import type {
  ChatMessage,
  ChatParticipantScope,
  ChatRoomListItem,
} from '@/features/chat/types/chat'

/**
 * 전체 채팅(업장 단위 단체방) 목업.
 *
 * 스펙 기준으로 백엔드에 group room + 발신자별 메시지 모델이 아직 없습니다.
 * 디자인·인터랙션 검증용 인메모리 스토어이며, API가 준비되면 이 파일과
 * `useGroupChatMock*` 훅만 실제 쿼리로 교체하면 됩니다.
 */

const MY_SENDER_ID = -1

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

interface MockGroupRoomSeed {
  id: number
  workspaceName: string
  memberCount: number
  messages: Array<{
    senderId: number
    senderScope: ChatParticipantScope
    senderName: string
    content: string
    minutesAgo: number
    isMine?: boolean
  }>
}

const SEEDS: MockGroupRoomSeed[] = [
  {
    id: 9001,
    workspaceName: '알터 강남점',
    memberCount: 7,
    messages: [
      {
        senderId: 101,
        senderScope: 'MANAGER',
        senderName: '최민석 점주님',
        content: '근무표 확정해서 공유드려요',
        minutesAgo: 1500,
      },
      {
        senderId: MY_SENDER_ID,
        senderScope: 'USER',
        senderName: '',
        content: '확인했습니다!',
        minutesAgo: 1496,
        isMine: true,
      },
      {
        senderId: 102,
        senderScope: 'USER',
        senderName: '이서준',
        content: '이번 주 금요일 오픈 담당 누구인가요?',
        minutesAgo: 180,
      },
      {
        senderId: 101,
        senderScope: 'MANAGER',
        senderName: '최민석 점주님',
        content: '서준님이 오픈, 지원님이 미들입니다.',
        minutesAgo: 174,
      },
    ],
  },
  {
    id: 9002,
    workspaceName: '알터 성수점',
    memberCount: 4,
    messages: [
      {
        senderId: 201,
        senderScope: 'MANAGER',
        senderName: '박서연 점주님',
        content: '다음 주 재고 조사 일정 공유합니다.',
        minutesAgo: 40,
      },
    ],
  },
]

function seedMessages(seed: MockGroupRoomSeed): ChatMessage[] {
  return seed.messages.map((message, index) => ({
    id: seed.id * 100 + index,
    senderId: message.senderId,
    senderScope: message.senderScope,
    senderName: message.senderName,
    senderProfileImageUrl: null,
    content: message.content,
    createdAt: minutesAgo(message.minutesAgo),
    isMine: message.isMine ?? false,
    status: 'sent' as const,
    messageType: 'NORMAL' as const,
    attachments: [],
  }))
}

interface GroupChatMockState {
  messagesByRoomId: Record<number, ChatMessage[]>
  unreadByRoomId: Record<number, number>
  sendMessage: (roomId: number, content: string) => void
  markRead: (roomId: number) => void
}

export const useGroupChatMockStore = create<GroupChatMockState>(set => ({
  messagesByRoomId: Object.fromEntries(
    SEEDS.map(seed => [seed.id, seedMessages(seed)])
  ),
  unreadByRoomId: { 9001: 1, 9002: 0 },
  sendMessage: (roomId, content) =>
    set(state => {
      const existing = state.messagesByRoomId[roomId] ?? []
      const nextMessage: ChatMessage = {
        id: Date.now(),
        senderId: MY_SENDER_ID,
        senderScope: 'USER',
        senderName: '',
        senderProfileImageUrl: null,
        content,
        createdAt: new Date().toISOString(),
        isMine: true,
        status: 'sent',
        messageType: 'NORMAL',
        attachments: [],
      }
      return {
        messagesByRoomId: {
          ...state.messagesByRoomId,
          [roomId]: [...existing, nextMessage],
        },
      }
    }),
  markRead: roomId =>
    set(state =>
      state.unreadByRoomId[roomId] === 0
        ? state
        : { unreadByRoomId: { ...state.unreadByRoomId, [roomId]: 0 } }
    ),
}))

/**
 * 스토어 스냅샷으로 목록 행을 만듭니다.
 * zustand 셀렉터로 쓰지 마세요 — 매번 새 배열을 만들어 무한 렌더가 납니다.
 */
export function buildGroupChatRooms(
  messagesByRoomId: Record<number, ChatMessage[]>,
  unreadByRoomId: Record<number, number>
): ChatRoomListItem[] {
  return SEEDS.map(seed => {
    const messages = messagesByRoomId[seed.id] ?? []
    const latest = messages[messages.length - 1]
    return {
      id: seed.id,
      segment: 'group' as const,
      title: seed.workspaceName,
      profileImageUrl: null,
      latestMessage: latest?.content ?? '',
      updatedAt: latest?.createdAt ?? new Date(0).toISOString(),
      unreadCount: unreadByRoomId[seed.id] ?? 0,
      memberCount: seed.memberCount,
    }
  }).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function isGroupChatRoomId(roomId: number): boolean {
  return SEEDS.some(seed => seed.id === roomId)
}

export function findGroupChatRoomSeed(roomId: number) {
  return SEEDS.find(seed => seed.id === roomId)
}
