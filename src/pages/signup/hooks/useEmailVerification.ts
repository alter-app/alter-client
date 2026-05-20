import { useState } from 'react'
import {
  checkEmailDuplicate,
  sendEmailVerification,
  verifyEmailCode,
} from '@/shared/api/auth'
import { useTimer } from '@/shared/hooks/useTimer'

const RESEND_COOLDOWN = 30
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 이메일 인증 훅 (선택 항목)
 * - 인증 코드 발송 / 재발송
 * - 쿨다운 타이머 (useTimer 활용)
 * - 인증 코드 확인 → 이메일 세션 ID 발급
 */
export function useEmailVerification() {
  const [email, setEmail] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [message, setMessage] = useState('')
  const [verified, setVerified] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const {
    countdown: resendCooldown,
    start: startCooldown,
    clear: clearCooldown,
  } = useTimer()

  /** 이메일 입력 변경 — 인증 상태 초기화 */
  const handleEmailChange = (value: string) => {
    setEmail(value)
    setCodeSent(false)
    setCode('')
    setSessionId('')
    setVerified(false)
    setMessage('')
    clearCooldown()
  }

  /** 인증 코드 발송 */
  const sendCode = async () => {
    const trimmed = email.trim()
    if (!trimmed || isSending || resendCooldown > 0) return

    if (!EMAIL_REGEX.test(trimmed)) {
      setMessage('올바른 이메일 형식을 입력해주세요.')
      return
    }

    try {
      setIsSending(true)
      setMessage('')
      const available = await checkEmailDuplicate(trimmed)
      if (!available) {
        setMessage('이미 가입된 이메일입니다.')
        return
      }

      await sendEmailVerification(trimmed)
      setCodeSent(true)
      setMessage('인증 코드가 발송됐어요. 이메일을 확인해주세요.')
      startCooldown(RESEND_COOLDOWN)
    } catch (error) {
      const e = error as { message?: string }
      setMessage(
        e.message || '인증 코드 발송에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setIsSending(false)
    }
  }

  /** 인증 코드 확인 */
  const verifyCode = async () => {
    if (!code.trim() || isVerifying) return
    try {
      setIsVerifying(true)
      setMessage('')
      const newSessionId = await verifyEmailCode(email.trim(), code.trim())
      setSessionId(newSessionId)
      setVerified(true)
      setMessage('이메일 인증이 완료됐어요!')
      clearCooldown()
    } catch (error) {
      const e = error as { message?: string }
      setVerified(false)
      setMessage(
        e.message || '인증 코드가 올바르지 않습니다. 다시 확인해주세요.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    email,
    codeSent,
    code,
    setCode,
    sessionId,
    message,
    verified,
    isSending,
    isVerifying,
    resendCooldown,
    handleEmailChange,
    sendCode,
    verifyCode,
  }
}
