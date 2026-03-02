import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ConfirmationResult } from 'firebase/auth'
import { AuthInput } from '@/shared/ui/AuthInput'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import {
  checkNicknameDuplicate,
  sendEmailVerification,
  verifyEmailCode,
  createSignupSession,
  signup,
} from '@/shared/api/auth'
import {
  sendPhoneVerification,
  toInternationalPhone,
  clearRecaptcha,
} from '@/shared/lib/firebase'
import useAuthStore from '@/shared/stores/useAuthStore'

const RESEND_COOLDOWN = 30
const RECAPTCHA_CONTAINER_ID = 'recaptcha-container'

export function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [step, setStep] = useState<1 | 2>(1)

  // ─── 1단계: 기본 정보 ────────────────────────────────────────────
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'남' | '여' | ''>('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [birthError, setBirthError] = useState('')

  // 전화번호 Firebase 인증
  const [phoneSmsSent, setPhoneSmsSent] = useState(false)
  const [phoneSmsCode, setPhoneSmsCode] = useState('')
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [phoneMessage, setPhoneMessage] = useState('')
  const [isSendingSms, setIsSendingSms] = useState(false)
  const [isVerifyingSms, setIsVerifyingSms] = useState(false)
  const [smsResendCooldown, setSmsResendCooldown] = useState(0)
  const smsConfirmationRef = useRef<ConfirmationResult | null>(null)
  const smsCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [firebaseIdToken, setFirebaseIdToken] = useState('')

  // ─── 2단계: 계정 정보 ────────────────────────────────────────────
  const [nickname, setNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('')

  // 이메일 인증 (선택)
  const [email, setEmail] = useState('')
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailCode, setEmailCode] = useState('')
  const [emailSessionId, setEmailSessionId] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false)
  const [isVerifyingEmailCode, setIsVerifyingEmailCode] = useState(false)
  const [emailResendCooldown, setEmailResendCooldown] = useState(0)
  const emailCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [adAgreed, setAdAgreed] = useState(false)
  const [signupError, setSignupError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordCheckError, setPasswordCheckError] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (smsCooldownRef.current) clearInterval(smsCooldownRef.current)
      if (emailCooldownRef.current) clearInterval(emailCooldownRef.current)
      clearRecaptcha()
    }
  }, [])

  // ─── 쿨다운 헬퍼 ─────────────────────────────────────────────────
  const startSmsCooldown = () => {
    setSmsResendCooldown(RESEND_COOLDOWN)
    smsCooldownRef.current = setInterval(() => {
      setSmsResendCooldown(prev => {
        if (prev <= 1) {
          if (smsCooldownRef.current) clearInterval(smsCooldownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startEmailCooldown = () => {
    setEmailResendCooldown(RESEND_COOLDOWN)
    emailCooldownRef.current = setInterval(() => {
      setEmailResendCooldown(prev => {
        if (prev <= 1) {
          if (emailCooldownRef.current) clearInterval(emailCooldownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // ─── 유효성 ───────────────────────────────────────────────────────
  const isStep1Valid = !!(
    name.trim() &&
    gender &&
    phone.trim() &&
    birth.trim().length === 8 &&
    !birthError &&
    phoneVerified
  )

  const isPasswordValid = (value: string) => {
    const trimmed = value.trim()
    if (trimmed.length < 8) return false
    const hasLetter = /[A-Za-z]/.test(trimmed)
    const hasNumber = /\d/.test(trimmed)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed)
    return [hasLetter, hasNumber, hasSpecial].filter(Boolean).length >= 2
  }

  const isEmailValid = !email.trim() || emailVerified

  const isStep2Valid =
    nicknameChecked &&
    isEmailValid &&
    agreed &&
    isPasswordValid(password) &&
    password === passwordCheck &&
    !passwordError &&
    !passwordCheckError

  // ─── 포맷 헬퍼 ───────────────────────────────────────────────────
  const normalizePhone = (value: string) =>
    value.replace(/\D/g, '').slice(0, 11)

  const formatPhone = (value: string) => {
    const n = normalizePhone(value)
    if (n.length < 4) return n
    if (n.length < 8) return `${n.slice(0, 3)}-${n.slice(3)}`
    return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7, 11)}`
  }

  const normalizeBirthday = (value: string) =>
    value.replace(/\D/g, '').slice(0, 8)

  // ─── 전화번호 SMS 인증 ────────────────────────────────────────────
  const handleSendSms = async () => {
    if (!phone.trim() || isSendingSms || smsResendCooldown > 0) return
    try {
      setIsSendingSms(true)
      setPhoneMessage('')
      clearRecaptcha() // 재발송 시 reCAPTCHA 재생성
      const intlPhone = toInternationalPhone(normalizePhone(phone))
      const confirmation = await sendPhoneVerification(
        intlPhone,
        RECAPTCHA_CONTAINER_ID
      )
      smsConfirmationRef.current = confirmation
      setPhoneSmsSent(true)
      setPhoneMessage('인증번호가 발송됐어요. 문자를 확인해주세요.')
      startSmsCooldown()
    } catch (err) {
      const e = err as { message?: string }
      clearRecaptcha()
      setPhoneMessage(
        e.message || 'SMS 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      )
    } finally {
      setIsSendingSms(false)
    }
  }

  const handleVerifySms = async () => {
    if (!phoneSmsCode.trim() || isVerifyingSms || !smsConfirmationRef.current)
      return
    try {
      setIsVerifyingSms(true)
      setPhoneMessage('')
      const result = await smsConfirmationRef.current.confirm(phoneSmsCode)
      const idToken = await result.user.getIdToken()
      setFirebaseIdToken(idToken)
      setPhoneVerified(true)
      setPhoneMessage('전화번호 인증이 완료됐어요!')
      if (smsCooldownRef.current) clearInterval(smsCooldownRef.current)
      setSmsResendCooldown(0)
    } catch {
      setPhoneVerified(false)
      setPhoneMessage('인증번호가 올바르지 않습니다. 다시 확인해주세요.')
    } finally {
      setIsVerifyingSms(false)
    }
  }

  // ─── 이메일 인증 ─────────────────────────────────────────────────
  const handleSendEmailCode = async () => {
    if (!email.trim() || isSendingEmailCode || emailResendCooldown > 0) return
    try {
      setIsSendingEmailCode(true)
      setEmailMessage('')
      await sendEmailVerification(email.trim())
      setEmailCodeSent(true)
      setEmailMessage('인증 코드가 발송됐어요. 이메일을 확인해주세요.')
      startEmailCooldown()
    } catch (error) {
      const apiError = error as { message?: string }
      setEmailMessage(
        apiError.message || '인증 코드 발송에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setIsSendingEmailCode(false)
    }
  }

  const handleVerifyEmailCode = async () => {
    if (!emailCode.trim() || isVerifyingEmailCode) return
    try {
      setIsVerifyingEmailCode(true)
      setEmailMessage('')
      const sessionId = await verifyEmailCode(email.trim(), emailCode.trim())
      setEmailSessionId(sessionId)
      setEmailVerified(true)
      setEmailMessage('이메일 인증이 완료됐어요!')
      if (emailCooldownRef.current) clearInterval(emailCooldownRef.current)
      setEmailResendCooldown(0)
    } catch (error) {
      const apiError = error as { message?: string }
      setEmailVerified(false)
      setEmailMessage(
        apiError.message || '인증 코드가 올바르지 않습니다. 다시 확인해주세요.'
      )
    } finally {
      setIsVerifyingEmailCode(false)
    }
  }

  // ─── 회원가입 제출 ────────────────────────────────────────────────
  const getGenderCode = (
    g: '남' | '여' | ''
  ): 'GENDER_MALE' | 'GENDER_FEMALE' =>
    g === '남' ? 'GENDER_MALE' : 'GENDER_FEMALE'

  const handleSubmit = async () => {
    try {
      setSignupError('')
      setBirthError('')
      setIsSubmitting(true)

      const birthday = normalizeBirthday(birth)
      if (birthday.length !== 8) {
        setBirthError(
          '생년월일은 하이픈 없이 YYYYMMDD 8자리(예: 19990101)로 입력해주세요.'
        )
        return
      }

      const signupSessionId = await createSignupSession(phone, firebaseIdToken)

      await signup(
        {
          signupSessionId,
          ...(emailSessionId ? { emailSessionId } : {}),
          password,
          name: name.trim(),
          nickname: nickname.trim(),
          gender: getGenderCode(gender),
          birthday,
          contact: normalizePhone(phone),
        },
        setAuth,
        navigate
      )
    } catch (error) {
      const apiError = error as { message?: string }
      setSignupError(apiError.message || '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── 렌더링 ───────────────────────────────────────────────────────
  return (
    <MobileLayout>
      {/* Invisible reCAPTCHA 마운트 포인트 */}
      <div id={RECAPTCHA_CONTAINER_ID} />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] min-h-[calc(100dvh-48px)] px-5 py-6 box-border bg-white relative overflow-x-hidden sm:px-4 sm:py-5 xs:px-3 xs:py-4">
        {/* ── 1단계 ──────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col items-center w-full max-w-[400px]">
            <div className="w-full mb-8 sm:mb-7 xs:mb-6">
              <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-[#111111] text-left mb-4 sm:text-[22px] sm:leading-[30px] xs:text-[20px] xs:leading-[28px]">
                회원님의 정보를 알려주세요!
              </h1>
              <p className="font-pretendard font-regular text-[14px] leading-5 text-[#767676] text-left sm:text-[13px] sm:leading-[19px] xs:text-[12px] xs:leading-[18px]">
                알터가 회원님이 동의해 주신 내용을 바탕으로 작성했어요.
                <br />
                틀리거나 빈 정보가 있다면 알려주시겠어요?
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full mb-6 sm:gap-[14px] sm:mb-5 xs:gap-3 xs:mb-4">
              {/* 이름 + 성별 */}
              <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                <div className="flex-1">
                  <AuthInput
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <div className="flex border border-[#d9d9d9] rounded-xl h-14 overflow-hidden sm:h-[52px] xs:h-12">
                    <button
                      type="button"
                      className={`px-4 font-pretendard text-4 ${gender === '남' ? 'bg-main text-white font-semibold' : 'bg-white text-[#767676]'}`}
                      onClick={() => setGender('남')}
                    >
                      남
                    </button>
                    <button
                      type="button"
                      className={`px-4 font-pretendard text-4 border-l border-[#d9d9d9] ${gender === '여' ? 'bg-main text-white font-semibold' : 'bg-white text-[#767676]'}`}
                      onClick={() => setGender('여')}
                    >
                      여
                    </button>
                  </div>
                </div>
              </div>

              {/* 전화번호 + SMS 인증 */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                  <div className="flex-1">
                    <AuthInput
                      type="tel"
                      maxLength={13}
                      placeholder="전화번호"
                      value={phone}
                      disabled={phoneVerified}
                      onChange={e => {
                        setPhone(formatPhone(e.target.value))
                        setPhoneSmsSent(false)
                        setPhoneSmsCode('')
                        setPhoneVerified(false)
                        setFirebaseIdToken('')
                        setPhoneMessage('')
                        if (smsCooldownRef.current)
                          clearInterval(smsCooldownRef.current)
                        setSmsResendCooldown(0)
                      }}
                      borderColor={
                        phoneVerified
                          ? '1px solid #2DE283'
                          : phoneMessage && !phoneSmsSent
                            ? '1px solid #DC0000'
                            : undefined
                      }
                    />
                  </div>
                  {!phoneVerified && (
                    <button
                      type="button"
                      className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                      onClick={handleSendSms}
                      disabled={
                        !phone.trim() || isSendingSms || smsResendCooldown > 0
                      }
                    >
                      {isSendingSms
                        ? '발송 중...'
                        : smsResendCooldown > 0
                          ? `${smsResendCooldown}초 후 재발송`
                          : phoneSmsSent
                            ? '재발송'
                            : '인증번호 발송'}
                    </button>
                  )}
                </div>

                {/* SMS 인증번호 입력 */}
                {phoneSmsSent && !phoneVerified && (
                  <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                    <div className="flex-1">
                      <AuthInput
                        type="text"
                        placeholder="인증번호 6자리"
                        value={phoneSmsCode}
                        maxLength={6}
                        onChange={e => {
                          setPhoneSmsCode(
                            e.target.value.replace(/\D/g, '').slice(0, 6)
                          )
                          setPhoneMessage('')
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                      onClick={handleVerifySms}
                      disabled={phoneSmsCode.length !== 6 || isVerifyingSms}
                    >
                      {isVerifyingSms ? '확인 중...' : '확인'}
                    </button>
                  </div>
                )}

                {phoneMessage && (
                  <div
                    className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] xs:text-[10px]"
                    style={{ color: phoneVerified ? '#2DE283' : '#DC0000' }}
                  >
                    {phoneMessage}
                  </div>
                )}
              </div>

              {/* 생년월일 */}
              <AuthInput
                type="text"
                placeholder="생년월일 8자리"
                value={birth}
                maxLength={8}
                onChange={e => {
                  const next = normalizeBirthday(e.target.value)
                  setBirth(next)
                  if (next.length === 0 || next.length === 8) {
                    setBirthError('')
                  } else {
                    setBirthError(
                      '생년월일은 하이픈 없이 YYYYMMDD 8자리(예: 19990101)로 입력해주세요.'
                    )
                  }
                }}
              />
            </div>

            <p className="font-pretendard font-regular text-[12px] leading-[18px] text-[#767676] text-center w-full mb-6 sm:text-[11px] sm:mb-5 xs:text-[10px] xs:mb-4">
              만약 내용이 없다면 모든 내용을 기입해 주세요!
            </p>

            {birthError && (
              <div className="font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full mb-4 sm:text-[11px] sm:mb-3 xs:text-[10px] xs:mb-3">
                {birthError}
              </div>
            )}

            <button
              type="button"
              className="w-full h-14 border-none bg-main text-white text-5 font-pretendard font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-[0_2px_8px_rgba(45,226,131,0.3)]
              hover:bg-[#25c973] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(45,226,131,0.4)]
              active:bg-[#1fb865] active:translate-y-0 active:shadow-[0_2px_6px_rgba(45,226,131,0.3)]
              disabled:bg-[#cbcbcb] disabled:text-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
              sm:h-[52px] sm:text-[17px] sm:rounded-[10px] xs:h-12 xs:text-4 xs:rounded-lg"
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
            >
              완료
            </button>
          </div>
        )}

        {/* ── 2단계 ──────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col items-center w-full max-w-[400px]">
            <div className="flex justify-start w-full mb-6 sm:mb-5 xs:mb-4">
              <button
                type="button"
                className="w-12 h-12 sm:w-11 sm:h-11 xs:w-10 xs:h-10 border border-[#e5e5e5] bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#f8f9fa] hover:border-main hover:-translate-y-px active:bg-[#e9ecef] active:translate-y-0"
                onClick={() => setStep(1)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 9L12 15L18 21"
                    stroke="#767676"
                    strokeWidth="1.7"
                  />
                </svg>
              </button>
            </div>

            <div className="w-full mb-8 sm:mb-7 xs:mb-6">
              <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-[#111111] text-left mb-4 sm:text-[22px] sm:leading-[30px] xs:text-[20px] xs:leading-[28px]">
                이제 마지막이에요!
              </h1>
              <p className="font-pretendard font-regular text-[14px] leading-5 text-[#767676] text-left mb-8 sm:text-[13px] sm:leading-[19px] sm:mb-7 xs:text-[12px] xs:leading-[18px] xs:mb-6">
                회원님이 알터에서 불릴 닉네임을 알려주세요.
                <br />
                그리고 필수 정보 제공에 동의해 주시면 완료예요.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full mb-4 sm:gap-[14px] sm:mb-[14px] xs:gap-3 xs:mb-3">
              {/* 닉네임 */}
              <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                <div className="flex-1">
                  <AuthInput
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={e => {
                      const value = e.target.value
                      if (/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/.test(value)) {
                        setNickname(value)
                        setNicknameChecked(false)
                        setNicknameCheckMessage('')
                      }
                    }}
                    borderColor={
                      nicknameChecked
                        ? '1px solid #2DE283'
                        : nicknameCheckMessage
                          ? '1px solid #DC0000'
                          : undefined
                    }
                  />
                </div>
                <button
                  type="button"
                  className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                  onClick={async () => {
                    if (!nickname.trim()) return
                    try {
                      setIsCheckingNickname(true)
                      const ok = await checkNicknameDuplicate(nickname)
                      setNicknameChecked(ok)
                      setNicknameCheckMessage(
                        ok
                          ? '사용 가능한 닉네임입니다!'
                          : '이미 사용 중인 닉네임입니다.'
                      )
                    } catch (err) {
                      const e = err as { message?: string }
                      setNicknameChecked(false)
                      setNicknameCheckMessage(
                        e.message || '닉네임 중복 검사 중 오류가 발생했습니다.'
                      )
                    } finally {
                      setIsCheckingNickname(false)
                    }
                  }}
                  disabled={!nickname.trim() || isCheckingNickname}
                >
                  {isCheckingNickname ? '확인 중...' : '중복 확인'}
                </button>
              </div>

              {nicknameCheckMessage && (
                <div
                  className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] xs:text-[10px]"
                  style={{ color: nicknameChecked ? '#2DE283' : '#DC0000' }}
                >
                  {nicknameCheckMessage}
                </div>
              )}

              {/* 이메일 인증 (선택) */}
              <div className="flex flex-col gap-2 w-full">
                <p className="font-pretendard font-regular text-[12px] leading-[18px] text-[#767676] sm:text-[11px] xs:text-[10px]">
                  <span className="mr-1">(선택)</span>
                  이메일 — 인증 후 알림 수신 및 비밀번호 찾기에 활용돼요.
                </p>

                <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                  <div className="flex-1">
                    <AuthInput
                      type="email"
                      placeholder="이메일 (선택)"
                      value={email}
                      disabled={emailVerified}
                      onChange={e => {
                        setEmail(e.target.value)
                        setEmailCodeSent(false)
                        setEmailCode('')
                        setEmailSessionId('')
                        setEmailVerified(false)
                        setEmailMessage('')
                        if (emailCooldownRef.current)
                          clearInterval(emailCooldownRef.current)
                        setEmailResendCooldown(0)
                      }}
                      borderColor={
                        emailVerified
                          ? '1px solid #2DE283'
                          : emailMessage && !emailCodeSent
                            ? '1px solid #DC0000'
                            : undefined
                      }
                    />
                  </div>
                  {!emailVerified && (
                    <button
                      type="button"
                      className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                      onClick={handleSendEmailCode}
                      disabled={
                        !email.trim() ||
                        isSendingEmailCode ||
                        emailResendCooldown > 0
                      }
                    >
                      {isSendingEmailCode
                        ? '발송 중...'
                        : emailResendCooldown > 0
                          ? `${emailResendCooldown}초 후 재발송`
                          : emailCodeSent
                            ? '재발송'
                            : '인증 코드 발송'}
                    </button>
                  )}
                </div>

                {emailCodeSent && !emailVerified && (
                  <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                    <div className="flex-1">
                      <AuthInput
                        type="text"
                        placeholder="인증 코드 6자리"
                        value={emailCode}
                        maxLength={6}
                        onChange={e => {
                          setEmailCode(
                            e.target.value.replace(/\D/g, '').slice(0, 6)
                          )
                          setEmailMessage('')
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                      onClick={handleVerifyEmailCode}
                      disabled={emailCode.length !== 6 || isVerifyingEmailCode}
                    >
                      {isVerifyingEmailCode ? '확인 중...' : '확인'}
                    </button>
                  </div>
                )}

                {emailMessage && (
                  <div
                    className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] xs:text-[10px]"
                    style={{ color: emailVerified ? '#2DE283' : '#DC0000' }}
                  >
                    {emailMessage}
                  </div>
                )}
              </div>

              {/* 비밀번호 */}
              <div className="flex flex-col gap-4 w-full sm:gap-[14px] xs:gap-3">
                <AuthInput
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={e => {
                    const v = e.target.value
                    setPassword(v)
                    if (!v.trim()) setPasswordError('비밀번호를 입력해주세요.')
                    else if (!isPasswordValid(v))
                      setPasswordError(
                        '비밀번호는 최소 8자이며, 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.'
                      )
                    else setPasswordError('')
                    if (passwordCheck && v !== passwordCheck)
                      setPasswordCheckError(
                        '비밀번호가 서로 일치하지 않습니다.'
                      )
                    else setPasswordCheckError('')
                  }}
                />
                <AuthInput
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={e => {
                    const v = e.target.value
                    setPasswordCheck(v)
                    if (!v.trim())
                      setPasswordCheckError('비밀번호 확인을 입력해주세요.')
                    else if (v !== password)
                      setPasswordCheckError(
                        '비밀번호가 서로 일치하지 않습니다.'
                      )
                    else setPasswordCheckError('')
                  }}
                />
              </div>
              {(passwordError || passwordCheckError) && (
                <div className="font-pretendard font-regular text-[12px] leading-[18px] text-error text-left w-full mt-1 sm:text-[11px] xs:text-[10px]">
                  {passwordError || passwordCheckError}
                </div>
              )}
            </div>

            {/* 약관 동의 */}
            <div className="flex flex-col gap-3 w-full mb-6 sm:gap-[10px] sm:mb-5 xs:gap-2.5 xs:mb-4">
              <label className="flex items-start gap-2 font-pretendard font-regular text-[13px] leading-[19px] text-[#767676] sm:text-[12px] sm:leading-[18px] xs:text-[11px] xs:leading-[17px]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="appearance-none w-[18px] h-[18px] rounded-[4px] border border-[#d9d9d9] bg-white inline-block align-middle cursor-pointer transition-all duration-200 flex-shrink-0 mt-[1px] checked:bg-main checked:border-main hover:border-main sm:w-4 sm:h-4 xs:w-[14px] xs:h-[14px]"
                />
                <span>
                  <span className="text-[#DC0000] mr-1">(필수)</span>
                  <span className="font-medium text-[#111111]">
                    이용약관
                  </span>과{' '}
                  <span className="font-medium text-[#111111]">
                    개인정보 보호정책
                  </span>
                  에 동의합니다.
                </span>
              </label>

              <label className="flex items-start gap-2 font-pretendard font-regular text-[13px] leading-[19px] text-[#767676] sm:text-[12px] sm:leading-[18px] xs:text-[11px] xs:leading-[17px]">
                <input
                  type="checkbox"
                  checked={adAgreed}
                  onChange={e => setAdAgreed(e.target.checked)}
                  className="appearance-none w-[18px] h-[18px] rounded-[4px] border border-[#d9d9d9] bg-white inline-block align-middle cursor-pointer transition-all duration-200 flex-shrink-0 mt-[1px] checked:bg-main checked:border-main hover:border-main sm:w-4 sm:h-4 xs:w-[14px] xs:h-[14px]"
                />
                <span>(선택) 이메일 및 SMS 광고성 정보 수신에 동의합니다.</span>
              </label>
            </div>

            <button
              type="button"
              className="w-full h-14 border-none bg-main text-white text-5 font-pretendard font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-[0_2px_8px_rgba(45,226,131,0.3)]
              hover:bg-[#25c973] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(45,226,131,0.4)]
              active:bg-[#1fb865] active:translate-y-0 active:shadow-[0_2px_6px_rgba(45,226,131,0.3)]
              disabled:bg-[#cbcbcb] disabled:text-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
              sm:h-[52px] sm:text-[17px] sm:rounded-[10px] xs:h-12 xs:text-4 xs:rounded-lg"
              disabled={!isStep2Valid || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? '가입 중...' : '가입하기'}
            </button>

            {signupError && (
              <div className="mt-4 font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full sm:text-[11px] xs:text-[10px]">
                {signupError}
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}

export default SignupPage
