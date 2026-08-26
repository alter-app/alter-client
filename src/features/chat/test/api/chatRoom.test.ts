import { beforeEach, describe, expect, it, vi } from 'vitest'

import axiosInstance from '@/shared/lib/axiosInstance'
import { queryKeys } from '@/shared/lib/queryKeys'

import {
  createChatRoom,
  fetchChatMessages,
  fetchChatRoomDetail,
  fetchChatRooms,
  markChatRoomRead,
} from '../../api/chatRoom'
import { toServerScope } from '../../lib/adaptChat'
import {
  chatPublishDestination,
  chatSubscribeDestination,
} from '../../lib/stompDestinations'

vi.mock('@/shared/lib/axiosInstance', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

const get = vi.mocked(axiosInstance.get)
const post = vi.mocked(axiosInstance.post)

const emptyPage = {
  page: { cursor: null, pageSize: 20, totalCount: 0 },
  data: [],
}

describe('채팅 API 스코프 분기', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
    get.mockResolvedValue({ data: emptyPage })
    post.mockResolvedValue({ data: { chatRoomId: 1 } })
  })

  it('알바생(USER)은 /app 경로로 방 목록을 조회한다', async () => {
    await fetchChatRooms('USER', { pageSize: 20 })

    expect(get).toHaveBeenCalledWith('/app/chat/rooms', {
      params: { pageSize: 20 },
    })
  })

  it('사장님(MANAGER)은 /manager 경로로 방 목록을 조회한다', async () => {
    await fetchChatRooms('MANAGER', { pageSize: 20 })

    expect(get).toHaveBeenCalledWith('/manager/chat/rooms', {
      params: { pageSize: 20 },
    })
  })

  it('스코프가 없으면 /app 으로 폴백한다', async () => {
    await fetchChatRooms(null, { pageSize: 20 })

    expect(get).toHaveBeenCalledWith('/app/chat/rooms', {
      params: { pageSize: 20 },
    })
  })

  it('커서가 있으면 파라미터에 포함한다', async () => {
    await fetchChatRooms('USER', { pageSize: 20, cursor: 'c1' })

    expect(get).toHaveBeenCalledWith('/app/chat/rooms', {
      params: { pageSize: 20, cursor: 'c1' },
    })
  })

  it('메시지 목록은 방 하위 경로로 조회한다', async () => {
    await fetchChatMessages('MANAGER', 42, { pageSize: 30 })

    expect(get).toHaveBeenCalledWith('/manager/chat/rooms/42/messages', {
      params: { pageSize: 30 },
    })
  })

  it('방 상세는 방 경로로 조회한다', async () => {
    get.mockResolvedValue({ data: { data: { id: 42 } } })
    await fetchChatRoomDetail('USER', 42)

    expect(get).toHaveBeenCalledWith('/app/chat/rooms/42')
  })

  it('읽음 처리는 어디까지 읽었는지 바디로 보낸다', async () => {
    await markChatRoomRead('USER', 42, 1024)

    expect(post).toHaveBeenCalledWith('/app/chat/rooms/42/read', {
      lastReadMessageId: 1024,
    })
  })
})

describe('채팅방 생성 응답 언랩', () => {
  beforeEach(() => {
    post.mockReset()
  })

  it('CommonApiResponse 로 감싸진 응답에서 chatRoomId 를 꺼낸다', async () => {
    post.mockResolvedValue({
      data: { timestamp: '2026-08-19T00:00:00Z', data: { chatRoomId: 7 } },
    })

    await expect(
      createChatRoom('USER', { opponentUserId: 3, opponentScope: 'MANAGER' })
    ).resolves.toEqual({ chatRoomId: 7 })
  })

  it('감싸지 않은 응답도 그대로 사용한다', async () => {
    post.mockResolvedValue({ data: { chatRoomId: 9 } })

    await expect(
      createChatRoom('USER', { opponentUserId: 3, opponentScope: 'MANAGER' })
    ).resolves.toEqual({ chatRoomId: 9 })
  })

  it('알바생 상대는 서버 enum 인 APP 으로 보낸다', async () => {
    post.mockResolvedValue({ data: { chatRoomId: 1 } })

    await createChatRoom('MANAGER', {
      opponentUserId: 3,
      opponentScope: toServerScope('USER'),
    })

    expect(post).toHaveBeenCalledWith('/manager/chat/rooms', {
      opponentUserId: 3,
      opponentScope: 'APP',
    })
  })
})

describe('STOMP 목적지', () => {
  it('구독은 스코프와 무관하게 방 단위다', () => {
    expect(chatSubscribeDestination(42)).toBe('/sub/chat.42')
  })

  it('발행은 스코프별 경로를 쓴다', () => {
    expect(chatPublishDestination('USER', 42)).toBe('/pub/app/send.42')
    expect(chatPublishDestination('MANAGER', 42)).toBe('/pub/manager/send.42')
  })
})

describe('채팅 쿼리 키', () => {
  it('스코프별로 목록 캐시가 분리된다', () => {
    expect(queryKeys.chat.rooms('USER', { pageSize: 20 })).not.toEqual(
      queryKeys.chat.rooms('MANAGER', { pageSize: 20 })
    )
  })

  it('목록 무효화 prefix 는 개별 키의 앞부분과 일치한다', () => {
    const key = queryKeys.chat.rooms('USER', { pageSize: 20 })
    expect(key.slice(0, 2)).toEqual([...queryKeys.chat.roomsAll])
  })
})
