import { describe, expect, it } from 'vitest'

import type {
  ChatMessageDto,
  ChatRoomListItemDto,
} from '@/features/chat/types/dto'

import {
  adaptChatMessage,
  adaptChatRoomDetail,
  adaptChatRoomListItem,
  toParticipantScope,
  toServerScope,
} from '../../lib/adaptChat'
import { clampMessageDraft, canSendMessage } from '../../lib/messageDraft'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/features/chat/types/chat'

function roomDto(
  overrides: Partial<ChatRoomListItemDto> = {}
): ChatRoomListItemDto {
  return {
    id: 1,
    type: { value: 'DIRECT', description: '개인 채팅' },
    roomName: '최민석 점주님',
    memberCount: 2,
    opponentId: 200,
    opponentScope: 'MANAGER',
    opponentName: '최민석 점주님',
    latestMessageContent: '근무표 확정해서 공유드려요',
    createdAt: '2026-08-19T09:00:00',
    updatedAt: '2026-08-19T09:10:00',
    ...overrides,
  }
}

/** 전체 채팅방 — 상대방 필드가 전부 null 로 내려옵니다 */
function groupRoomDto(
  overrides: Partial<ChatRoomListItemDto> = {}
): ChatRoomListItemDto {
  return roomDto({
    id: 34,
    type: { value: 'GROUP', description: '그룹 채팅' },
    roomName: '알터 카페 강남점',
    memberCount: 8,
    opponentId: null,
    opponentScope: null,
    opponentName: null,
    opponentProfileImageUrl: null,
    latestMessageContent: '이번 주 스케줄 공유합니다',
    ...overrides,
  })
}

function messageDto(overrides: Partial<ChatMessageDto> = {}): ChatMessageDto {
  return {
    id: 10,
    senderId: 200,
    senderScope: 'MANAGER',
    content: '확인 부탁드려요',
    createdAt: '2026-08-19T09:10:00',
    ...overrides,
  }
}

describe('scope 정규화', () => {
  it('서버의 APP 은 도메인 USER 로 좁힌다', () => {
    expect(toParticipantScope('APP')).toBe('USER')
  })

  it('객체로 감싸 내려오는 scope 도 언랩한다', () => {
    expect(toParticipantScope({ value: 'MANAGER', description: '점주' })).toBe(
      'MANAGER'
    )
    expect(toParticipantScope({ value: 'APP' })).toBe('USER')
  })

  it('알 수 없는 값·누락은 USER 로 폴백한다', () => {
    expect(toParticipantScope('ROBOT')).toBe('USER')
    expect(toParticipantScope(undefined)).toBe('USER')
  })

  it('요청 바디로 나갈 때는 USER 를 APP 으로 되돌린다', () => {
    expect(toServerScope('USER')).toBe('APP')
    expect(toServerScope('MANAGER')).toBe('MANAGER')
  })
})

describe('채팅방 목록 DTO 변환', () => {
  it('스펙에 없는 미읽음·프로필은 폴백한다', () => {
    const item = adaptChatRoomListItem(roomDto())

    expect(item.unreadCount).toBe(0)
    expect(item.profileImageUrl).toBeNull()
    expect(item.segment).toBe('personal')
  })

  it('DIRECT 방은 roomName 을 제목으로 쓰고 상대 정보를 채운다', () => {
    const item = adaptChatRoomListItem(
      roomDto({ opponentProfileImageUrl: 'https://cdn/p.png' })
    )

    expect(item.title).toBe('최민석 점주님')
    expect(item.profileImageUrl).toBe('https://cdn/p.png')
    expect(item.opponentId).toBe(200)
    expect(item.memberCount).toBe(2)
  })

  it('GROUP 방은 전체 세그먼트로 넘기고 업장명·인원수를 쓴다', () => {
    const item = adaptChatRoomListItem(groupRoomDto())

    expect(item.segment).toBe('group')
    expect(item.title).toBe('알터 카페 강남점')
    expect(item.memberCount).toBe(8)
  })

  it('GROUP 방의 상대 정보는 null 대신 undefined 로 둔다', () => {
    const item = adaptChatRoomListItem(groupRoomDto())

    // USER 로 폴백하면 상대 없는 방을 1:1 처럼 다루게 됩니다
    expect(item.opponentId).toBeUndefined()
    expect(item.opponentScope).toBeUndefined()
  })

  it('type 이 없는 구 배포본은 상대방 유무로 세그먼트를 추론한다', () => {
    expect(adaptChatRoomListItem(roomDto({ type: undefined })).segment).toBe(
      'personal'
    )
    expect(
      adaptChatRoomListItem(groupRoomDto({ type: undefined })).segment
    ).toBe('group')
  })

  it('roomName 이 없으면 상대 이름으로, 그마저 없으면 안내 문구로 폴백한다', () => {
    expect(adaptChatRoomListItem(roomDto({ roomName: null })).title).toBe(
      '최민석 점주님'
    )
    expect(
      adaptChatRoomListItem(roomDto({ roomName: null, opponentName: null }))
        .title
    ).toBe('알 수 없음')
  })

  it('미읽음이 오면 그대로 사용한다', () => {
    expect(
      adaptChatRoomListItem(roomDto({ unreadCount: 12 })).unreadCount
    ).toBe(12)
  })

  it('최근 메시지가 없는 방은 빈 문자열로 둔다', () => {
    expect(
      adaptChatRoomListItem(roomDto({ latestMessageContent: null }))
        .latestMessage
    ).toBe('')
  })

  it('목록의 평문 APP scope 를 USER 로 좁힌다', () => {
    expect(
      adaptChatRoomListItem(roomDto({ opponentScope: 'APP' })).opponentScope
    ).toBe('USER')
  })
})

describe('방 상세 DTO 변환', () => {
  it('상대 이름을 헤더 제목으로 쓰고 객체형 scope 를 언랩한다', () => {
    const detail = adaptChatRoomDetail({
      id: 5,
      type: { value: 'DIRECT', description: '개인 채팅' },
      roomName: '최민석 점주님',
      memberCount: 2,
      opponentId: 200,
      opponentScope: { value: 'MANAGER', description: '점주' },
      opponentName: '최민석 점주님',
      createdAt: '2026-08-19T09:00:00',
      updatedAt: '2026-08-19T09:10:00',
    })

    expect(detail.segment).toBe('personal')
    expect(detail.title).toBe('최민석 점주님')
    expect(detail.opponentScope).toBe('MANAGER')
    expect(detail.profileImageUrl).toBeNull()
  })

  it('GROUP 방 상세는 업장명·인원수만 채우고 상대는 비운다', () => {
    const detail = adaptChatRoomDetail({
      id: 34,
      type: { value: 'GROUP', description: '그룹 채팅' },
      roomName: '알터 카페 강남점',
      memberCount: 8,
      opponentId: null,
      opponentScope: null,
      opponentName: null,
      createdAt: '2026-08-01T09:00:00',
      updatedAt: '2026-08-20T08:40:00',
    })

    expect(detail.segment).toBe('group')
    expect(detail.title).toBe('알터 카페 강남점')
    expect(detail.memberCount).toBe(8)
    expect(detail.opponentId).toBeUndefined()
  })
})

describe('메시지 DTO 변환 — 내 메시지 판별', () => {
  it('서버의 isMine 을 최우선으로 쓴다', () => {
    expect(
      adaptChatMessage(messageDto({ isMine: true }), { myId: 999 }).isMine
    ).toBe(true)
  })

  it('객체형 senderScope 를 언랩해 내 메시지를 판별한다', () => {
    expect(
      adaptChatMessage(
        messageDto({ senderId: 5, senderScope: { value: 'APP' } }),
        { myId: 5, myScope: 'USER' }
      ).isMine
    ).toBe(true)
  })

  it('id 가 같아도 scope 가 다르면 내 메시지가 아니다', () => {
    expect(
      adaptChatMessage(
        messageDto({ senderId: 5, senderScope: { value: 'MANAGER' } }),
        { myId: 5, myScope: 'USER' }
      ).isMine
    ).toBe(false)
  })

  it('내 id 를 모르면 1:1 방의 상대 여부로 판별한다', () => {
    const fromOpponent = adaptChatMessage(messageDto(), {
      opponentId: 200,
      opponentScope: 'MANAGER',
    })
    const fromMe = adaptChatMessage(
      messageDto({ senderId: 7, senderScope: { value: 'APP' } }),
      { opponentId: 200, opponentScope: 'MANAGER' }
    )

    expect(fromOpponent.isMine).toBe(false)
    expect(fromMe.isMine).toBe(true)
  })

  it('서버가 준 발신자 이름·프로필을 그대로 쓴다', () => {
    // 단체방 발신자 표기는 이 필드에만 의존합니다(상대 개념이 없어 폴백이 불가)
    const adapted = adaptChatMessage(
      messageDto({
        senderName: '이서준',
        senderProfileImageUrl: 'https://cdn/sender.png',
      })
    )

    expect(adapted.senderName).toBe('이서준')
    expect(adapted.senderProfileImageUrl).toBe('https://cdn/sender.png')
  })

  it('발신자 이름이 없으면 받은 메시지에 상대 이름을 채운다', () => {
    const adapted = adaptChatMessage(messageDto(), {
      opponentId: 200,
      opponentScope: 'MANAGER',
      opponentName: '최민석 점주님',
    })

    expect(adapted.senderName).toBe('최민석 점주님')
  })
})

describe('메시지 DTO 변환 — 타입·첨부', () => {
  it('타입이 없으면 일반 메시지로 본다', () => {
    const adapted = adaptChatMessage(messageDto())

    expect(adapted.messageType).toBe('NORMAL')
    expect(adapted.attachments).toEqual([])
  })

  it('공지 메시지를 구분해 표시할 수 있다', () => {
    expect(adaptChatMessage(messageDto({ type: 'NOTICE' })).messageType).toBe(
      'NOTICE'
    )
  })

  it('이미지 전용 메시지는 본문을 빈 문자열로 두고 첨부만 남긴다', () => {
    const adapted = adaptChatMessage(
      messageDto({
        content: null,
        attachments: [{ fileId: 'f1', url: 'https://cdn/f1.png' }],
      })
    )

    expect(adapted.content).toBe('')
    expect(adapted.attachments).toHaveLength(1)
  })

  it('메시지별 안 읽은 사람 수를 그대로 보존한다', () => {
    expect(adaptChatMessage(messageDto({ unreadCount: 3 })).unreadCount).toBe(3)
  })
})

describe('메시지 입력 제한', () => {
  it('1000자를 넘는 입력은 잘라낸다', () => {
    const long = 'ㄱ'.repeat(CHAT_MESSAGE_MAX_LENGTH + 50)

    expect(clampMessageDraft(long)).toHaveLength(CHAT_MESSAGE_MAX_LENGTH)
  })

  it('공백만 있으면 전송할 수 없다', () => {
    expect(canSendMessage('   \n ')).toBe(false)
    expect(canSendMessage('')).toBe(false)
  })

  it('내용이 있으면 전송할 수 있다', () => {
    expect(canSendMessage(' 안녕하세요 ')).toBe(true)
  })
})
