import { useState, useRef, useEffect } from 'react'
import type { ConfirmationResult } from 'firebase/auth'
import { createPasswordResetSession } from '@/shared/api/auth'
import {
  sendPhoneVerification,
  toInternationalPhone,
  clearRecaptcha,
  getFreshFirebaseIdToken,
} from '@/shared/lib/firebase'
import {
  normalizePhone,
  formatPhone,
} from '@/shared/lib/utils/signupValidation'
import { useTimer } from '@/pages/signup/hooks/useTimer'

export const FIND_PASSWORD_RECAPTCHA_ID = 'find-password-recaptcha-container'
const RESEND_COOLDOWN = 30

/**
 * 비밀번호 찾기 2단계 — Firebase SMS 인증 후 재설정 세션 생성
 */
export function useFindPasswordPhoneVerification(email: string) {
  const [phone, setPhone] = useState('')
  const [smsSent, setSmsSent] = useState(false)
  const [smsCode, setSmsCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [sessionId, setSessionId] = useState('')

  const smsConfirmationRef = useRef<ConfirmationResult | null>(null)
  const {
    countdown: resendCooldown,
    start: startCooldown,
    clear: clearCooldown,
  } = useTimer()

  useEffect(() => {
    return () => clearRecaptcha()
  }, [])

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value))
    setSmsSent(false)
    setSmsCode('')
    setVerified(false)
    setSessionId('')
    setMessage('')
    clearCooldown()
  }

  const sendSms = async () => {
    const normalized = normalizePhone(phone)
    if (normalized.length !== 11 || isSending || resendCooldown > 0) {
      if (normalized.length !== 11) {
        setMessage('전화번호 11자리를 입력해주세요.')
      }
      return
    }

    try {
      setIsSending(true)
      setMessage('')
      clearRecaptcha()
      const intlPhone = toInternationalPhone(normalized)
      const confirmation = await sendPhoneVerification(
        intlPhone,
        FIND_PASSWORD_RECAPTCHA_ID
      )
      smsConfirmationRef.current = confirmation
      setSmsSent(true)
      setMessage('인증번호가 발송됐어요. 문자를 확인해주세요.')
      startCooldown(RESEND_COOLDOWN)
    } catch (err) {
      const e = err as { message?: string }
      clearRecaptcha()
      setMessage(
        e.message || 'SMS 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setIsSending(false)
    }
  }

  const verifySms = async () => {
    if (!smsCode.trim() || isVerifying || !smsConfirmationRef.current) return
    try {
      setIsVerifying(true)
      setMessage('')
      await smsConfirmationRef.current.confirm(smsCode)
      const firebaseIdToken = await getFreshFirebaseIdToken()
      if (!firebaseIdToken) {
        setMessage('전화번호 인증이 만료되었습니다. 다시 인증해 주세요.')
        return
      }
      const newSessionId = await createPasswordResetSession(
        email.trim(),
        normalizePhone(phone),
        firebaseIdToken
      )
      setSessionId(newSessionId)
      setVerified(true)
      setMessage('휴대폰 인증이 완료됐어요!')
      clearCooldown()
    } catch (error) {
      setVerified(false)
      const e = error as { message?: string }
      setMessage(
        e.message || '인증번호가 올바르지 않습니다. 다시 확인해주세요.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    phone,
    smsSent,
    smsCode,
    setSmsCode,
    verified,
    message,
    isSending,
    isVerifying,
    resendCooldown,
    sessionId,
    handlePhoneChange,
    sendSms,
    verifySms,
  }
}
