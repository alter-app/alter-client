import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { KakaoLoginButton, AppleLoginButton } from '@/features/auth'
import { AuthInput } from '@/shared/ui/AuthInput'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { loginIDPW } from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'
import { parseErrorResponse } from '@/shared/lib/utils/errorUtils'

// TODO: 실제 로고 이미지 경로로 변경
const AlterLogo = '/vite.svg'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { setAuth, isLoggedIn, scope, token } = useAuthStore()
  const navigate = useNavigate()

  // 이미 로그인되어 있고 토큰이 있으면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isLoggedIn && token) {
      if (scope === 'MANAGER') {
        navigate('/main', { replace: true })
      } else {
        navigate('/job-lookup-map', { replace: true })
      }
    }
  }, [isLoggedIn, scope, token, navigate])

  const handleLogin = async () => {
    try {
      const data = await loginIDPW({ email, password }, setAuth, navigate)
      console.log('로그인 성공:', data)
    } catch (error: any) {
      // 필드별 에러 초기화
      setEmailError('')
      setPasswordError('')
      setErrorMessage('')

      // 필드별 에러가 있는 경우
      if (error.data) {
        const { fieldErrors, globalError } = parseErrorResponse(error.data)

        // 필드별 에러 설정
        if (fieldErrors.email) setEmailError(fieldErrors.email)
        if (fieldErrors.password) setPasswordError(fieldErrors.password)

        // 일반 에러 메시지
        if (globalError) setErrorMessage(globalError)
      } else {
        setErrorMessage(error.message || '로그인에 실패했습니다.')
      }
    }
  }

  const goToSignup = () => {
    navigate('/phoneauth')
  }

  return (
    <MobileLayout>
      <div className="flex flex-col items-center justify-center min-h-screen min-h-[100dvh] px-5 py-6 relative overflow-x-hidden box-border sm:px-4 sm:py-5 xs:px-3 xs:py-4">
      <img
        src={AlterLogo}
        alt="알터 로고"
        className="h-[200px] w-auto mb-10 sm:h-40 sm:mb-8 xs:h-[130px] xs:mb-7"
      />

      <div className="flex flex-col gap-5 w-full max-w-[400px] sm:gap-4 sm:max-w-full xs:gap-[14px]">
        <div className="flex flex-col gap-4 w-full sm:gap-[14px] xs:gap-3">
          <AuthInput
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
              setErrorMessage('')
            }}
            borderColor={emailError ? '1px solid #DC0000' : undefined}
          />

          <AuthInput
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
              setErrorMessage('')
            }}
            borderColor={passwordError ? '1px solid #DC0000' : undefined}
          />
        </div>

        <button
          className="w-full h-14 border-none bg-main text-white text-5 font-pretendard font-semibold rounded-xl cursor-pointer transition-all duration-200 shadow-[0_2px_8px_rgba(45,226,131,0.3)]
            hover:bg-[#25c973] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(45,226,131,0.4)]
            active:bg-[#1fb865] active:translate-y-0 active:shadow-[0_2px_6px_rgba(45,226,131,0.3)]
            disabled:bg-[#cbcbcb] disabled:text-white disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
            sm:h-[52px] sm:text-[17px] sm:rounded-[10px] xs:h-12 xs:text-4 xs:rounded-lg"
          onClick={handleLogin}
          disabled={!email.trim() || !password.trim()}
        >
          로그인
        </button>

        {(emailError || passwordError || errorMessage) && (
          <div className="text-error font-pretendard font-regular text-1 leading-[18px] text-left w-full sm:text-[11px] sm:leading-[17px] xs:text-0 xs:leading-4">
            {emailError || passwordError || errorMessage}
          </div>
        )}
      </div>

      <div className="flex items-center w-full max-w-[400px] my-8 sm:my-7 sm:max-w-full xs:my-6">
        <div className="flex-1 h-px bg-[#d9d9d9]" />
        <span className="font-pretendard font-regular text-4 leading-5 text-[#999999] mx-[15px] sm:text-3 sm:mx-2.5 xs:text-2 xs:mx-2">
          간편 로그인
        </span>
        <div className="flex-1 h-px bg-[#d9d9d9]" />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[400px] items-center sm:gap-[14px] sm:max-w-full xs:gap-3">
        <KakaoLoginButton />
        <AppleLoginButton />

        <div className="flex justify-center items-center gap-2 font-pretendard font-regular text-3 leading-[18px] text-[#767676] mt-2.5 sm:text-2 sm:gap-1.5 xs:text-1 xs:gap-1">
          <span
            className="cursor-pointer transition-colors duration-200 hover:text-main"
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
          </span>
          <span>|</span>
          <span
            className="cursor-pointer transition-colors duration-200 hover:text-main"
            onClick={() => navigate('/find-password')}
          >
            비밀번호 찾기
          </span>
          <span>|</span>
          <span
            className="cursor-pointer transition-colors duration-200 hover:text-main"
            onClick={goToSignup}
          >
            회원가입
          </span>
        </div>
      </div>
      </div>
    </MobileLayout>
  )
}

