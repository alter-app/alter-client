import { useState, useRef, useEffect } from 'react'
import type { ConfirmationResult } from 'firebase/auth'
import {
  sendPhoneVerification,
  toInternationalPhone,
  clearRecaptcha,
} from '@/shared/lib/firebase'
import {
  normalizePhone,
  formatPhone,
} from '@/shared/lib/utils/signupValidation'
import { useTimer } from './useTimer'

export const RECAPTCHA_CONTAINER_ID = 'recaptcha-container'
const RESEND_COOLDOWN = 30

/**
 * 전화번호 Firebase SMS 인증 훅
 * - 인증번호 발송 / 재발송 (reCAPTCHA 포함)
 * - 쿨다운 타이머 (useTimer 활용)
 * - 인증번호 확인 → Firebase ID 토큰 발급
 */
export function usePhoneVerification() {
  const [phone, setPhone] = useState('')
  const [smsSent, setSmsSent] = useState(false)
  const [smsCode, setSmsCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [firebaseIdToken, setFirebaseIdToken] = useState('')

  const smsConfirmationRef = useRef<ConfirmationResult | null>(null)
  const {
    countdown: resendCooldown,
    start: startCooldown,
    clear: clearCooldown,
  } = useTimer()

  // 언마운트 시 reCAPTCHA 정리
  useEffect(() => {
    return () => clearRecaptcha()
  }, [])

  /** 전화번호 입력 변경 — 인증 상태 초기화 */
  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value))
    setSmsSent(false)
    setSmsCode('')
    setVerified(false)
    setFirebaseIdToken('')
    setMessage('')
    clearCooldown()
  }

  /** 인증번호 발송 */
  const sendSms = async () => {
    if (!phone.trim() || isSending || resendCooldown > 0) return
    try {
      setIsSending(true)
      setMessage('')
      clearRecaptcha() // 재발송 시 reCAPTCHA 재생성
      const intlPhone = toInternationalPhone(normalizePhone(phone))
      const confirmation = await sendPhoneVerification(
        intlPhone,
        RECAPTCHA_CONTAINER_ID
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

  /** 인증번호 확인 */
  const verifySms = async () => {
    if (!smsCode.trim() || isVerifying || !smsConfirmationRef.current) return
    try {
      setIsVerifying(true)
      setMessage('')
      const result = await smsConfirmationRef.current.confirm(smsCode)
      const idToken = await result.user.getIdToken()
      setFirebaseIdToken(idToken)
      setVerified(true)
      setMessage('전화번호 인증이 완료됐어요!')
      clearCooldown()
    } catch {
      setVerified(false)
      setMessage('인증번호가 올바르지 않습니다. 다시 확인해주세요.')
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
    firebaseIdToken,
    handlePhoneChange,
    sendSms,
    verifySms,
  }
}
