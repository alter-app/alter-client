import { useState, useRef, useEffect } from 'react'

/**
 * 카운트다운 타이머 훅
 * SMS · 이메일 인증 재발송 쿨다운 등 반복되는 타이머 로직을 공통화합니다.
 */
export function useTimer() {
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(seconds)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const clear = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCountdown(0)
  }

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return { countdown, start, clear }
}
