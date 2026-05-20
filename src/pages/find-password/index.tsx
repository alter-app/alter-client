import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg?react'
import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { resetPassword } from '@/shared/api/auth'
import { ROUTES } from '@/shared/constants/routes'
import { isPasswordValid } from '@/shared/lib/utils/signupValidation'
import { PhoneVerification } from '@/features/auth'
import {
  FIND_PASSWORD_RECAPTCHA_ID,
  useFindPasswordPhoneVerification,
} from './hooks/useFindPasswordPhoneVerification'

type Step = 1 | 2 | 3

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FindPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [resetError, setResetError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const phoneVerification = useFindPasswordPhoneVerification(email)

  const handleBack = () => {
    if (step === 1) {
      navigate(ROUTES.AUTH.LOGIN)
      return
    }
    setStep(prev => (prev === 2 ? 1 : 2))
  }

  const handleNextFromEmail = () => {
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailError('아이디(이메일)를 입력해주세요.')
      return
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    setEmailError('')
    setStep(2)
  }

  const handleNextFromPhone = () => {
    if (!phoneVerification.verified || !phoneVerification.sessionId) {
      return
    }
    setStep(3)
  }

  const handleResetPassword = async () => {
    setPasswordError('')
    setConfirmPasswordError('')
    setResetError('')

    if (!newPassword.trim()) {
      setPasswordError('새 비밀번호를 입력해주세요.')
      return
    }
    if (!isPasswordValid(newPassword)) {
      setPasswordError(
        '비밀번호는 최소 8자이며, 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.'
      )
      return
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 서로 일치하지 않습니다.')
      return
    }
    if (!phoneVerification.sessionId) {
      setResetError('세션이 만료되었습니다. 처음부터 다시 시도해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      await resetPassword(phoneVerification.sessionId, newPassword)
      setCompleted(true)
    } catch (error) {
      const e = error as { message?: string }
      setResetError(e.message || '비밀번호 재설정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (completed) {
    return (
      <div className="relative box-border flex min-h-[100dvh] flex-col items-center px-5 py-6 sm:px-4 xs:px-3">
        <div className="mt-16 flex w-full max-w-[400px] flex-col gap-6">
          <h1 className="font-pretendard text-[24px] font-semibold leading-8 text-text-100">
            비밀번호가 변경됐어요
          </h1>
          <p className="font-pretendard text-[14px] leading-5 text-text-70">
            새 비밀번호로 로그인해 주세요.
          </p>
          <AuthButton
            onClick={() => navigate(ROUTES.AUTH.LOGIN, { replace: true })}
          >
            로그인하기
          </AuthButton>
        </div>
      </div>
    )
  }

  return (
    <>
      <div id={FIND_PASSWORD_RECAPTCHA_ID} className="hidden" aria-hidden />

      <div className="relative box-border flex min-h-[100dvh] flex-col px-5 pb-28 pt-6 sm:px-4 xs:px-3">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-5 top-6 flex size-[30px] items-center justify-center border-none bg-transparent p-0 sm:left-4 xs:left-3"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="size-[30px] text-text-100" />
        </button>

        <div className="mx-auto mt-14 flex w-full max-w-[400px] flex-col gap-6">
          {step === 1 && (
            <>
              <div>
                <h1 className="mb-2 font-pretendard text-[24px] font-semibold leading-8 text-text-100">
                  비밀번호 찾기
                </h1>
                <p className="font-pretendard text-[14px] leading-5 text-text-70">
                  가입 시 사용한 이메일(아이디)을 입력해 주세요.
                </p>
              </div>
              <AuthInput
                type="email"
                placeholder="이메일 (아이디)"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                borderColor={emailError ? '1px solid error' : undefined}
              />
              {emailError && (
                <p className="font-pretendard text-[12px] leading-[18px] text-error">
                  {emailError}
                </p>
              )}
              <AuthButton
                onClick={handleNextFromEmail}
                disabled={!email.trim()}
              >
                다음
              </AuthButton>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h1 className="mb-2 font-pretendard text-[24px] font-semibold leading-8 text-text-100">
                  휴대폰 번호를 입력해 주세요
                </h1>
                <p className="font-pretendard text-[14px] leading-5 text-text-70">
                  비밀번호 찾기용 인증번호를 문자로 보내드려요.
                </p>
              </div>
              <PhoneVerification {...phoneVerification} />
              <AuthButton
                onClick={handleNextFromPhone}
                disabled={!phoneVerification.verified}
              >
                다음
              </AuthButton>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <h1 className="mb-2 font-pretendard text-[24px] font-semibold leading-8 text-text-100">
                  새 비밀번호를 입력해 주세요
                </h1>
                <p className="font-pretendard text-[14px] leading-5 text-text-70">
                  최소 8자, 영문/숫자/특수문자 중 2가지 이상을 포함해 주세요.
                </p>
              </div>
              <AuthInput
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value)
                  setPasswordError('')
                }}
                borderColor={passwordError ? '1px solid error' : undefined}
              />
              {passwordError && (
                <p className="-mt-4 font-pretendard text-[12px] leading-[18px] text-error">
                  {passwordError}
                </p>
              )}
              <AuthInput
                type="password"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  setConfirmPasswordError('')
                }}
                borderColor={
                  confirmPasswordError ? '1px solid error' : undefined
                }
              />
              {confirmPasswordError && (
                <p className="-mt-4 font-pretendard text-[12px] leading-[18px] text-error">
                  {confirmPasswordError}
                </p>
              )}
              {resetError && (
                <p className="font-pretendard text-[12px] leading-[18px] text-error">
                  {resetError}
                </p>
              )}
              <AuthButton
                onClick={handleResetPassword}
                disabled={
                  isSubmitting || !newPassword.trim() || !confirmPassword.trim()
                }
              >
                {isSubmitting ? '변경 중...' : '비밀번호 변경'}
              </AuthButton>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default FindPasswordPage
