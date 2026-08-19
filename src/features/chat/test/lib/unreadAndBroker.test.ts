import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { formatUnreadCount } from '@/shared/lib/unreadCount'
import { resolveBrokerUrl } from '@/shared/lib/stompConnection'
import {
  selectTotalChatUnread,
  useChatUnreadStore,
} from '@/shared/stores/useChatUnreadStore'

import {
  readLastChatSegment,
  writeLastChatSegment,
} from '../../lib/segmentPreference'

/** unit 프로젝트는 node 환경이라 브라우저 전역을 최소한으로 흉내 냅니다 */
function createLocalStorageStub(options: { throwOnRead?: boolean } = {}) {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => {
      if (options.throwOnRead) throw new Error('blocked')
      return store.get(key) ?? null
    },
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    clear: () => store.clear(),
  }
}

function setWindowStub(overrides: Record<string, unknown> = {}) {
  Object.defineProperty(globalThis, 'window', {
    value: {
      location: { protocol: 'http:', host: 'localhost:5173' },
      localStorage: createLocalStorageStub(),
      ...overrides,
    },
    configurable: true,
    writable: true,
  })
}

describe('미읽음 뱃지 표기', () => {
  it('99 이하는 숫자를 그대로 쓴다', () => {
    expect(formatUnreadCount(1)).toBe('1')
    expect(formatUnreadCount(99)).toBe('99')
  })

  it('99를 넘으면 99+ 로 축약한다', () => {
    expect(formatUnreadCount(100)).toBe('99+')
  })
})

describe('Docbar 채팅 뱃지 합계', () => {
  afterEach(() => {
    useChatUnreadStore.getState().reset()
  })

  it('개인과 전체 미읽음을 합산한다', () => {
    useChatUnreadStore.getState().setUnreadCount('personal', 3)
    useChatUnreadStore.getState().setUnreadCount('group', 1)

    expect(selectTotalChatUnread(useChatUnreadStore.getState())).toBe(4)
  })

  it('음수는 0으로 보정한다', () => {
    useChatUnreadStore.getState().setUnreadCount('personal', -5)

    expect(selectTotalChatUnread(useChatUnreadStore.getState())).toBe(0)
  })
})

describe('STOMP 브로커 주소 해석', () => {
  beforeAll(() => setWindowStub())
  afterAll(() => {
    Reflect.deleteProperty(globalThis, 'window')
  })

  it('ws·wss 절대 주소는 그대로 쓴다', () => {
    expect(resolveBrokerUrl('wss://api.example.com/ws-connect')).toBe(
      'wss://api.example.com/ws-connect'
    )
  })

  it('상대 경로는 현재 오리진 기준으로 만든다', () => {
    expect(resolveBrokerUrl('/api/ws-connect')).toBe(
      'ws://localhost:5173/api/ws-connect'
    )
  })

  it('앞 슬래시가 없어도 경로로 해석한다', () => {
    expect(resolveBrokerUrl('api/ws-connect')).toBe(
      'ws://localhost:5173/api/ws-connect'
    )
  })

  it('https 오리진에서는 wss 로 붙는다', () => {
    setWindowStub({
      location: { protocol: 'https:', host: 'alter-app.com' },
    })

    expect(resolveBrokerUrl('/api/ws-connect')).toBe(
      'wss://alter-app.com/api/ws-connect'
    )
  })
})

describe('마지막 세그먼트 기억', () => {
  afterAll(() => {
    Reflect.deleteProperty(globalThis, 'window')
  })

  it('브라우저 환경이 아니면 개인 채팅으로 폴백한다', () => {
    Reflect.deleteProperty(globalThis, 'window')

    expect(readLastChatSegment()).toBe('personal')
  })

  it('저장된 값이 없으면 개인 채팅이 기본이다', () => {
    setWindowStub()

    expect(readLastChatSegment()).toBe('personal')
  })

  it('전체 채팅을 고르면 다음 진입 시 유지된다', () => {
    setWindowStub()
    writeLastChatSegment('group')

    expect(readLastChatSegment()).toBe('group')
  })

  it('스토리지 읽기가 막혀도 기본값으로 동작한다', () => {
    setWindowStub({
      localStorage: createLocalStorageStub({ throwOnRead: true }),
    })

    expect(readLastChatSegment()).toBe('personal')
  })
})
