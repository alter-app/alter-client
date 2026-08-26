import { Client, type StompSubscription } from '@stomp/stompjs'

import { API_CONFIG } from './apiConfig'
import { useAuthStore } from '../stores/useAuthStore'

export type StompStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'

const RECONNECT_DELAY = 3000
const HEARTBEAT_INTERVAL = 10_000

/** `ws(s)://` 절대 주소는 그대로, 그 외에는 현재 오리진 기준으로 해석합니다 */
export function resolveBrokerUrl(configured: string): string {
  if (/^wss?:\/\//.test(configured)) return configured
  if (typeof window === 'undefined') return configured

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const path = configured.startsWith('/') ? configured : `/${configured}`
  return `${protocol}//${window.location.host}${path}`
}

interface Subscriber {
  id: number
  destination: string
  onMessage: (body: string) => void
  subscription: StompSubscription | null
}

/**
 * 앱 전역 STOMP 연결.
 *
 * - 화면(훅)들이 acquire/release 로 참조를 잡고, 참조가 0이 되면 연결을 끊습니다.
 * - 구독 요청은 매니저가 보관하다가 연결·재연결 시점에 실제 구독으로 붙입니다.
 *   (stompjs 는 미연결 상태의 subscribe 를 큐잉하지 않습니다)
 */
class StompConnectionManager {
  private client: Client | null = null
  private refCount = 0
  private status: StompStatus = 'idle'
  private statusListeners = new Set<(status: StompStatus) => void>()
  private subscribers = new Map<number, Subscriber>()
  private subscriberSeq = 0
  private hasConnectedOnce = false

  /** useSyncExternalStore 에 그대로 넘길 수 있도록 바인딩된 형태로 노출합니다 */
  getStatus = (): StompStatus => this.status

  onStatusChange = (listener: (status: StompStatus) => void): (() => void) => {
    this.statusListeners.add(listener)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  private setStatus(next: StompStatus) {
    if (this.status === next) return
    this.status = next
    this.statusListeners.forEach(listener => listener(next))
  }

  private createClient(): Client {
    const client = new Client({
      brokerURL: resolveBrokerUrl(API_CONFIG.WS_URL),
      reconnectDelay: RECONNECT_DELAY,
      heartbeatIncoming: HEARTBEAT_INTERVAL,
      heartbeatOutgoing: HEARTBEAT_INTERVAL,
    })

    // 토큰이 갱신될 수 있어 매 연결 시도마다 헤더를 다시 만듭니다
    client.beforeConnect = () => {
      const token = useAuthStore.getState().token
      client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}
      this.setStatus(this.hasConnectedOnce ? 'reconnecting' : 'connecting')
    }

    client.onConnect = () => {
      this.hasConnectedOnce = true
      this.setStatus('connected')
      this.subscribers.forEach(subscriber => this.attach(subscriber))
    }

    client.onWebSocketClose = () => {
      this.subscribers.forEach(subscriber => {
        subscriber.subscription = null
      })
      // 참조가 남아 있으면 stompjs 가 자동 재연결을 시도합니다
      this.setStatus(this.refCount > 0 ? 'reconnecting' : 'disconnected')
    }

    client.onStompError = () => {
      this.setStatus('reconnecting')
    }

    return client
  }

  private attach(subscriber: Subscriber) {
    if (!this.client?.connected || subscriber.subscription) return
    subscriber.subscription = this.client.subscribe(
      subscriber.destination,
      frame => subscriber.onMessage(frame.body)
    )
  }

  acquire(): void {
    this.refCount += 1
    if (!this.client) {
      this.client = this.createClient()
    }
    if (!this.client.active) {
      this.client.activate()
    }
  }

  release(): void {
    this.refCount = Math.max(0, this.refCount - 1)
    if (this.refCount > 0) return

    const client = this.client
    this.client = null
    this.subscribers.clear()
    this.hasConnectedOnce = false
    this.setStatus('idle')
    void client?.deactivate()
  }

  subscribe(
    destination: string,
    onMessage: (body: string) => void
  ): () => void {
    this.subscriberSeq += 1
    const subscriber: Subscriber = {
      id: this.subscriberSeq,
      destination,
      onMessage,
      subscription: null,
    }
    this.subscribers.set(subscriber.id, subscriber)
    this.attach(subscriber)

    return () => {
      subscriber.subscription?.unsubscribe()
      this.subscribers.delete(subscriber.id)
    }
  }

  /** 연결 전이면 false — 호출자가 전송 실패로 처리합니다 */
  publish(destination: string, body: unknown): boolean {
    if (!this.client?.connected) return false
    this.client.publish({ destination, body: JSON.stringify(body) })
    return true
  }
}

export const stompConnection = new StompConnectionManager()
