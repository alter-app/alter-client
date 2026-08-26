import { describe, expect, it } from 'vitest'

import type { ChatMessage } from '@/features/chat/types/chat'

import {
  buildChatTimeline,
  mergeChatMessages,
  sortMessagesAscending,
} from '../../lib/chatTimeline'

function message(
  overrides: Partial<ChatMessage> & { id: number }
): ChatMessage {
  return {
    senderId: 100,
    senderScope: 'USER',
    senderName: '이서준',
    senderProfileImageUrl: null,
    content: '안녕하세요',
    createdAt: '2026-08-19T09:00:00',
    isMine: false,
    status: 'sent',
    messageType: 'NORMAL',
    attachments: [],
    ...overrides,
  }
}

describe('채팅 타임라인 구성', () => {
  it('첫 메시지 앞에 날짜 구분선을 넣는다', () => {
    const timeline = buildChatTimeline([message({ id: 1 })], 'personal')

    expect(timeline[0].kind).toBe('date')
    expect(timeline[1].kind).toBe('message')
  })

  it('날짜가 바뀔 때만 구분선을 추가한다', () => {
    const timeline = buildChatTimeline(
      [
        message({ id: 1, createdAt: '2026-08-19T09:00:00' }),
        message({ id: 2, createdAt: '2026-08-19T18:00:00' }),
        message({ id: 3, createdAt: '2026-08-20T09:00:00' }),
      ],
      'personal'
    )

    expect(timeline.filter(entry => entry.kind === 'date')).toHaveLength(2)
  })

  it('개인 채팅에서는 발신자 메타를 노출하지 않는다', () => {
    const timeline = buildChatTimeline([message({ id: 1 })], 'personal')
    const entry = timeline.find(item => item.kind === 'message')

    expect(entry?.kind === 'message' && entry.showSenderMeta).toBe(false)
  })

  it('전체 채팅에서는 발신자가 바뀌는 첫 메시지에만 메타를 노출한다', () => {
    const timeline = buildChatTimeline(
      [
        message({ id: 1, senderId: 100, createdAt: '2026-08-19T09:00:00' }),
        message({ id: 2, senderId: 100, createdAt: '2026-08-19T09:01:00' }),
        message({ id: 3, senderId: 200, createdAt: '2026-08-19T09:02:00' }),
      ],
      'group'
    )

    const metaFlags = timeline
      .filter(entry => entry.kind === 'message')
      .map(entry => entry.kind === 'message' && entry.showSenderMeta)

    expect(metaFlags).toEqual([true, false, true])
  })

  it('전체 채팅에서 내 메시지에는 발신자 메타를 붙이지 않는다', () => {
    const timeline = buildChatTimeline(
      [message({ id: 1, isMine: true, senderId: -1 })],
      'group'
    )
    const entry = timeline.find(item => item.kind === 'message')

    expect(entry?.kind === 'message' && entry.showSenderMeta).toBe(false)
  })
})

describe('낙관적 메시지 병합', () => {
  it('서버 echo 가 도착한 pending 은 제거한다', () => {
    const server = [message({ id: 10, isMine: true, content: '보냈어요' })]
    const pending = [
      message({
        id: -1,
        clientId: 'pending-1',
        isMine: true,
        content: '보냈어요',
        status: 'pending',
      }),
    ]

    expect(mergeChatMessages(server, pending)).toHaveLength(1)
  })

  it('아직 echo 가 없는 pending 은 유지한다', () => {
    const pending = [
      message({
        id: -1,
        clientId: 'pending-1',
        isMine: true,
        content: '아직 안 옴',
        status: 'pending',
      }),
    ]

    expect(mergeChatMessages([], pending)).toHaveLength(1)
  })

  it('전송 실패 메시지는 같은 내용이 서버에 있어도 남긴다', () => {
    const server = [message({ id: 10, isMine: true, content: '중복' })]
    const pending = [
      message({
        id: -1,
        clientId: 'pending-1',
        isMine: true,
        content: '중복',
        status: 'failed',
      }),
    ]

    expect(mergeChatMessages(server, pending)).toHaveLength(2)
  })

  it('이미지 전용 메시지끼리 본문이 비었다고 서로 지우지 않는다', () => {
    // 첨부 1장짜리 echo 가 도착해도 아직 안 올라간 2장짜리 pending 은 남아야 한다
    const server = [
      message({
        id: 10,
        isMine: true,
        content: '',
        attachments: [{ fileId: 'server-1', url: 'https://cdn/1.png' }],
      }),
    ]
    const pending = [
      message({
        id: -1,
        clientId: 'pending-1',
        isMine: true,
        content: '',
        attachments: [
          { fileId: 'local-0', url: 'blob:0' },
          { fileId: 'local-1', url: 'blob:1' },
        ],
      }),
    ]

    expect(mergeChatMessages(server, pending)).toHaveLength(2)
  })

  it('첨부 수까지 같은 이미지 메시지는 echo 로 보고 제거한다', () => {
    const attachments = [{ fileId: 'x', url: 'https://cdn/x.png' }]
    const server = [message({ id: 10, isMine: true, content: '', attachments })]
    const pending = [
      message({
        id: -1,
        clientId: 'pending-1',
        isMine: true,
        content: '',
        attachments: [{ fileId: 'local-0', url: 'blob:0' }],
      }),
    ]

    expect(mergeChatMessages(server, pending)).toHaveLength(1)
  })
})

describe('메시지 정렬', () => {
  it('오래된 순으로 정렬하고 동일 시각은 id 순으로 둔다', () => {
    const sorted = sortMessagesAscending([
      message({ id: 3, createdAt: '2026-08-19T09:02:00' }),
      message({ id: 2, createdAt: '2026-08-19T09:00:00' }),
      message({ id: 1, createdAt: '2026-08-19T09:00:00' }),
    ])

    expect(sorted.map(item => item.id)).toEqual([1, 2, 3])
  })
})
