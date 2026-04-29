import { AuthInput } from '@/shared/ui/common/AuthInput'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { VerifyActionButton } from './VerifyActionButton'
import { EmailVerification } from './EmailVerification'
import { SignupTerms } from './SignupTerms'
import type { useSignupForm } from '../hooks/useSignupForm'
import type { useEmailVerification } from '../hooks/useEmailVerification'

interface Props {
  form: Pick<
    ReturnType<typeof useSignupForm>,
    | 'nickname'
    | 'nicknameChecked'
    | 'nicknameCheckMessage'
    | 'isCheckingNickname'
    | 'handleNicknameChange'
    | 'handleNicknameCheck'
    | 'password'
    | 'passwordCheck'
    | 'passwordError'
    | 'passwordCheckError'
    | 'handlePasswordChange'
    | 'handlePasswordCheckChange'
    | 'agreed'
    | 'setAgreed'
    | 'adAgreed'
    | 'setAdAgreed'
    | 'signupError'
    | 'isSubmitting'
  >
  /** 소셜 유입 가입 — 이메일·비밀번호 입력 없음 (백엔드에서 소셜 이메일 사용) */
  isSocialSignup?: boolean
  emailVerification: ReturnType<typeof useEmailVerification>
  isValid: boolean
  onBack: () => void
  onSubmit: () => void
}

/**
 * 회원가입 2단계 — 계정 정보
 * 닉네임 · 이메일(선택) · 비밀번호 · 약관 동의 (소셜 가입 시 닉네임·약관만)
 */
export function Step2AccountInfo({
  form,
  isSocialSignup = false,
  emailVerification,
  isValid,
  onBack,
  onSubmit,
}: Props) {
  const {
    nickname,
    nicknameChecked,
    nicknameCheckMessage,
    isCheckingNickname,
    handleNicknameChange,
    handleNicknameCheck,
    password,
    passwordCheck,
    passwordError,
    passwordCheckError,
    handlePasswordChange,
    handlePasswordCheckChange,
    agreed,
    setAgreed,
    adAgreed,
    setAdAgreed,
    signupError,
    isSubmitting,
  } = form

  return (
    <div className="flex flex-col items-center w-full max-w-[400px]">
      {/* 뒤로가기 */}
      <div className="flex justify-start w-full mb-6 sm:mb-5 xs:mb-4">
        <button
          type="button"
          className="w-12 h-12 sm:w-11 sm:h-11 xs:w-10 xs:h-10 border border-[#e5e5e5] bg-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#f8f9fa] hover:border-main hover:-translate-y-px active:bg-[#e9ecef] active:translate-y-0"
          onClick={onBack}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 9L12 15L18 21" stroke="#767676" strokeWidth="1.7" />
          </svg>
        </button>
      </div>

      {/* 헤더 */}
      <div className="w-full mb-8 sm:mb-7 xs:mb-6">
        <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-[#111111] text-left mb-4 sm:text-[22px] sm:leading-[30px] xs:text-[20px] xs:leading-[28px]">
          이제 마지막이에요!
        </h1>
        <p className="font-pretendard font-regular text-[14px] leading-5 text-[#767676] text-left mb-8 sm:text-[13px] sm:leading-[19px] sm:mb-7 xs:text-[12px] xs:leading-[18px] xs:mb-6">
          {isSocialSignup ? (
            <>
              회원님이 알터에서 불릴 닉네임을 알려주세요.
              <br />
              소셜 계정 이메일은 자동으로 연결되며, 필수 정보 제공에 동의해 주시면
              완료예요.
            </>
          ) : (
            <>
              회원님이 알터에서 불릴 닉네임을 알려주세요.
              <br />
              그리고 필수 정보 제공에 동의해 주시면 완료예요.
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full mb-4 sm:gap-[14px] sm:mb-[14px] xs:gap-3 xs:mb-3">
        {/* 닉네임 + 중복 확인 */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
            <div className="flex-1">
              <AuthInput
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={e => handleNicknameChange(e.target.value)}
                borderColor={
                  nicknameChecked
                    ? '1px solid main'
                    : nicknameCheckMessage
                      ? '1px solid error'
                      : undefined
                }
              />
            </div>
            <VerifyActionButton
              onClick={handleNicknameCheck}
              disabled={!nickname.trim() || isCheckingNickname}
            >
              {isCheckingNickname ? '확인 중...' : '중복 확인'}
            </VerifyActionButton>
          </div>
          {nicknameCheckMessage && (
            <p
              className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] xs:text-[10px]"
              style={{ color: nicknameChecked ? 'main' : 'error' }}
            >
              {nicknameCheckMessage}
            </p>
          )}
        </div>

        {/* 이메일 인증 (선택) — 일반 가입만 */}
        {!isSocialSignup && <EmailVerification {...emailVerification} />}

        {/* 비밀번호 — 일반 가입만 (소셜 전용 계정은 앱에서 나중에 비밀번호 설정 가능) */}
        {!isSocialSignup && (
          <>
            <div className="flex flex-col gap-4 w-full sm:gap-[14px] xs:gap-3">
              <AuthInput
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
              />
              <AuthInput
                type="password"
                placeholder="비밀번호 확인"
                value={passwordCheck}
                onChange={e => handlePasswordCheckChange(e.target.value)}
              />
            </div>
            {(passwordError || passwordCheckError) && (
              <p className="font-pretendard font-regular text-[12px] leading-[18px] text-error text-left w-full mt-1 sm:text-[11px] xs:text-[10px]">
                {passwordError || passwordCheckError}
              </p>
            )}
          </>
        )}
      </div>

      {/* 약관 동의 */}
      <div className="w-full mb-6 sm:mb-5 xs:mb-4">
        <SignupTerms
          agreed={agreed}
          adAgreed={adAgreed}
          onAgreeChange={setAgreed}
          onAdAgreeChange={setAdAgreed}
        />
      </div>

      <AuthButton disabled={!isValid || isSubmitting} onClick={onSubmit}>
        {isSubmitting ? '가입 중...' : '가입하기'}
      </AuthButton>

      {signupError && (
        <p className="mt-4 font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full sm:text-[11px] xs:text-[10px]">
          {signupError}
        </p>
      )}
    </div>
  )
}
