import { useEffect, useState } from 'react'
import type { ChatConnectionState } from '@/features/chat/types/chat'

/** '다시 연결됐어요' 안내를 노출하는 시간(ms) */
const RECONNECTED_NOTICE_DURATION = 2000

function isDown(state: ChatConnectionState): boolean {
  return state === 'reconnecting' || state === 'disconnected'
}

interface ChatConnectionBannerProps {
  state: ChatConnectionState
}

/** 중립 톤(text70) 안내 — 브랜드 그린은 쓰지 않습니다 */
export function ChatConnectionBanner({ state }: ChatConnectionBannerProps) {
  const [notice, setNotice] = useState({
    trackedState: state,
    showReconnected: false,
  })

  // 상태 전이는 렌더 중 조정 — 끊김 이후 연결됐을 때만 복구 안내를 띄웁니다
  if (notice.trackedState !== state) {
    setNotice({
      trackedState: state,
      showReconnected: isDown(notice.trackedState) && state === 'connected',
    })
  }

  const { showReconnected } = notice

  useEffect(() => {
    if (!showReconnected) return
    const timer = window.setTimeout(
      () => setNotice(current => ({ ...current, showReconnected: false })),
      RECONNECTED_NOTICE_DURATION
    )
    return () => window.clearTimeout(timer)
  }, [showReconnected])

  const message = isDown(state)
    ? '연결이 끊겼어요 · 다시 연결 중…'
    : showReconnected
      ? '다시 연결됐어요'
      : null

  if (!message) return null

  return (
    <div
      role="status"
      className="border-b border-line-1 bg-bg-light py-2 text-center typography-body03-regular text-text-70"
    >
      {message}
    </div>
  )
}
