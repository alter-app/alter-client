import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthInput } from '@/shared/ui/AuthInput'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import {
  checkNicknameDuplicate,
  checkEmailDuplicate,
  createSignupSession,
  signup,
} from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'

export function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [step, setStep] = useState<1 | 2>(1)

  // 1단계 상태
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'남' | '여' | ''>('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')

  // 2단계 상태
  const [nickname, setNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('')
  const [email, setEmail] = useState('')
  const [emailChecked, setEmailChecked] = useState(false)
  const [emailCheckMessage, setEmailCheckMessage] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [adAgreed, setAdAgreed] = useState(false)
  const [birthError, setBirthError] = useState('')
  const [signupError, setSignupError] = useState('')

  const isStep1Valid = !!(
    name.trim() &&
    gender &&
    phone.trim() &&
    birth.trim().length === 8 &&
    !birthError
  )
  const isStep2Valid =
    nicknameChecked &&
    emailChecked &&
    agreed &&
    !!password.trim() &&
    password === passwordCheck

  const handleFormatPhone = (value: string) => {
    const onlyNumber = value.replace(/\D/g, '')
    if (onlyNumber.length < 4) return onlyNumber
    if (onlyNumber.length < 8)
      return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`
    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`
  }

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) return
    try {
      const isAvailable = await checkNicknameDuplicate(nickname)
      if (isAvailable) {
        setNicknameChecked(true)
        setNicknameCheckMessage('사용 가능한 닉네임입니다!')
      } else {
        setNicknameChecked(false)
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다.')
      }
    } catch (error) {
      const apiError = error as { message?: string }
      setNicknameChecked(false)
      setNicknameCheckMessage(
        apiError.message || '닉네임 중복 검사 중 오류가 발생했습니다.'
      )
    }
  }

  const handleEmailCheck = async () => {
    if (!email.trim()) return
    try {
      const isAvailable = await checkEmailDuplicate(email)
      if (isAvailable) {
        setEmailChecked(true)
        setEmailCheckMessage('사용 가능한 이메일입니다!')
      } else {
        setEmailChecked(false)
        setEmailCheckMessage('이미 사용 중인 이메일입니다.')
      }
    } catch (error) {
      const apiError = error as { message?: string }
      setEmailChecked(false)
      setEmailCheckMessage(
        apiError.message || '이메일 중복 검사 중 오류가 발생했습니다.'
      )
    }
  }

  const getGenderCode = (
    genderStr: '남' | '여' | ''
  ): 'GENDER_MALE' | 'GENDER_FEMALE' => {
    if (genderStr === '남') return 'GENDER_MALE'
    return 'GENDER_FEMALE'
  }

  const handleSubmit = async () => {
    try {
      setSignupError('')
      setBirthError('')

      const birthday = birth.replace(/\D/g, '')
      if (birthday.length !== 8) {
        setBirthError(
          '생년월일은 하이픈 없이 YYYYMMDD 8자리(예: 19990101)로 입력해주세요.'
        )
        return
      }

      const signupSessionId = await createSignupSession(phone)

      await signup(
        {
          signupSessionId,
          email: email.trim(),
          password,
          name: name.trim(),
          nickname: nickname.trim(),
          gender: getGenderCode(gender),
          birthday,
          contact: phone.replace(/-/g, ''),
        },
        setAuth,
        navigate
      )
    } catch (error) {
      const apiError = error as { message?: string }
      setSignupError(apiError.message || '회원가입에 실패했습니다.')
    }
  }

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-48px)] min-h-[calc(100dvh-48px)] px-5 py-6 box-border bg-white relative overflow-x-hidden sm:px-4 sm:py-5 xs:px-3 xs:py-4">
        {step === 1 && (
          <div className="flex flex-col items-center w-full max-w-[400px]">
            <div className="w-full mb-8 sm:mb-7 xs:mb-6">
              <h1 className="font-pretendard font-semibold text-[24px] leading-8 text-[#111111] text-left mb-4 sm:text-[22px] sm:leading-[30px] xs:text-[20px] xs:leading-[28px]">
                회원님의 정보를 알려주세요!
              </h1>
              <p className="font-pretendard font-regular text-[14px] leading-5 text-[#767676] text-left mb-8 sm:text-[13px] sm:leading-[19px] sm:mb-7 xs:text-[12px] xs:leading-[18px] xs:mb-6">
                알터가 회원님이 동의해 주신 내용을 바탕으로 작성했어요.
                <br />
                틀리거나 빈 정보가 있다면 알려주시겠어요?
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full mb-6 sm:gap-[14px] sm:mb-5 xs:gap-3 xs:mb-4">
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
                      className={`px-4 font-pretendard text-4 ${
                        gender === '남'
                          ? 'bg-main text-white font-semibold'
                          : 'bg-white text-[#767676]'
                      }`}
                      onClick={() => setGender('남')}
                    >
                      남
                    </button>
                    <button
                      type="button"
                      className={`px-4 font-pretendard text-4 border-l border-[#d9d9d9] ${
                        gender === '여'
                          ? 'bg-main text-white font-semibold'
                          : 'bg-white text-[#767676]'
                      }`}
                      onClick={() => setGender('여')}
                    >
                      여
                    </button>
                  </div>
                </div>
              </div>

              <AuthInput
                type="tel"
                maxLength={13}
                placeholder="전화번호"
                value={phone}
                onChange={e => setPhone(handleFormatPhone(e.target.value))}
              />

              <AuthInput
                type="text"
                placeholder="생년월일 8자리"
                value={birth}
                maxLength={8}
                onChange={e => {
                  const onlyNumber = e.target.value.replace(/\D/g, '')
                  const next = onlyNumber.slice(0, 8)
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

            <p className="font-pretendard font-regular text-[12px] leading-[18px] text-[#767676] text-center w-full mb-6 sm:text-[11px] sm:leading-[17px] sm:mb-5 xs:text-[10px] xs:leading-4 xs:mb-4">
              만약 내용이 없다면 모든 내용을 기입해 주세요!
            </p>

            {birthError && (
              <div className="font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full mb-4 sm:text-[11px] sm:leading-[17px] sm:mb-3 xs:text-[10px] xs:leading-4 xs:mb-3">
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
              <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                <div className="flex-1">
                  <AuthInput
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={e => {
                      const value = e.target.value
                      const allowedPattern = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/

                      if (allowedPattern.test(value)) {
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
                  className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:text-white disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                  onClick={handleNicknameCheck}
                  disabled={!nickname.trim()}
                >
                  중복 확인
                </button>
              </div>

              {nicknameCheckMessage && (
                <div
                  className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] sm:leading-[17px] xs:text-[10px] xs:leading-4"
                  style={{
                    color: nicknameChecked ? '#2DE283' : '#DC0000',
                  }}
                >
                  {nicknameCheckMessage}
                </div>
              )}

              <div className="flex gap-3 w-full sm:gap-[10px] xs:gap-2">
                <div className="flex-1">
                  <AuthInput
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      setEmailChecked(false)
                      setEmailCheckMessage('')
                    }}
                    borderColor={
                      emailChecked
                        ? '1px solid #2DE283'
                        : emailCheckMessage
                          ? '1px solid #DC0000'
                          : undefined
                    }
                  />
                </div>
                <button
                  type="button"
                  className="min-w-[100px] h-14 border-none bg-main text-white text-[14px] font-pretendard font-medium rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#25c973] hover:-translate-y-px active:bg-[#1fb865] active:translate-y-0 disabled:bg-[#cbcbcb] disabled:text-white disabled:cursor-not-allowed disabled:transform-none sm:h-[52px] sm:text-[13px] sm:rounded-[10px] sm:min-w-[90px] xs:h-12 xs:text-[12px] xs:rounded-lg xs:min-w-[80px]"
                  onClick={handleEmailCheck}
                  disabled={!email.trim()}
                >
                  중복 확인
                </button>
              </div>

              {emailCheckMessage && (
                <div
                  className="font-pretendard font-regular text-[12px] leading-[18px] text-left w-full sm:text-[11px] sm:leading-[17px] xs:text-[10px] xs:leading-4"
                  style={{
                    color: emailChecked ? '#2DE283' : '#DC0000',
                  }}
                >
                  {emailCheckMessage}
                </div>
              )}

              <div className="flex flex-col gap-4 w-full sm:gap-[14px] xs:gap-3">
                <AuthInput
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <AuthInput
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={e => setPasswordCheck(e.target.value)}
                />
              </div>
            </div>

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
                  <span className="font-medium text-[#111111]">이용약관</span>과{' '}
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
              disabled={!isStep2Valid}
              onClick={handleSubmit}
            >
              가입하기
            </button>

            {signupError && (
              <div className="mt-4 font-pretendard font-regular text-[12px] leading-[18px] text-error text-center w-full sm:text-[11px] sm:leading-[17px] xs:text-[10px] xs:leading-4">
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
