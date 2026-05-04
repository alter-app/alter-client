import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFreshFirebaseIdToken } from '@/shared/lib/firebase'
import {
  getKakaoOAuthRedirectUri,
  requestFreshKakaoAuthorizationCode,
} from '@/shared/lib/socialLogin'
import {
  type SocialLoginRequest,
  checkNicknameDuplicate,
  createSignupSession,
  signup,
  signupSocial,
} from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'
import {
  isPasswordValid,
  normalizePhone,
  normalizeBirthday,
  getGenderCode,
} from '@/shared/lib/utils/signupValidation'

interface SubmitParams {
  phone: string
  firebaseIdToken: string
  emailSessionId: string
}

type UseSignupFormOptions = {
  /** B011 후 로그인 페이지에서 전달된 소셜 토큰 — 있으면 signup-social API 사용 */
  socialLoginData?: SocialLoginRequest | null
}

/**
 * 회원가입 폼 상태 및 비즈니스 로직 훅
 * - 1단계: 이름 · 성별 · 생년월일
 * - 2단계: 닉네임 · 비밀번호 · 약관 동의 (소셜 가입 시 비밀번호·이메일 생략)
 * - 회원가입 API 제출
 * (전화번호·이메일 인증 상태는 각 전용 훅에서 관리)
 */
export function useSignupForm(options?: UseSignupFormOptions) {
  const socialLoginData = options?.socialLoginData ?? null
  const isSocialSignup = !!socialLoginData
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  // ─── 1단계 ────────────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'남' | '여' | ''>('')
  const [birth, setBirth] = useState('')
  const [birthError, setBirthError] = useState('')

  // ─── 2단계 ────────────────────────────────────────────────────────────
  const [nickname, setNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('')
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)

  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordCheckError, setPasswordCheckError] = useState('')

  const [agreed, setAgreed] = useState(false)
  const [adAgreed, setAdAgreed] = useState(false)

  const [signupError, setSignupError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  /** 같은 전화로 세션을 이미 만들었으면 재시도 시 firebase 토큰 재사용 오류 방지 */
  const signupSessionCacheRef = useRef<{
    contact: string
    signupSessionId: string
  } | null>(null)

  // ─── 핸들러 ───────────────────────────────────────────────────────────

  const handleBirthChange = (value: string) => {
    const next = normalizeBirthday(value)
    setBirth(next)
    if (next.length === 0 || next.length === 8) {
      setBirthError('')
    } else {
      setBirthError(
        '생년월일은 하이픈 없이 YYYYMMDD 8자리(예: 19990101)로 입력해주세요.'
      )
    }
  }

  const handleNicknameChange = (value: string) => {
    if (/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]*$/.test(value)) {
      setNickname(value)
      setNicknameChecked(false)
      setNicknameCheckMessage('')
    }
  }

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) return
    try {
      setIsCheckingNickname(true)
      const ok = await checkNicknameDuplicate(nickname)
      setNicknameChecked(ok)
      setNicknameCheckMessage(
        ok ? '사용 가능한 닉네임입니다!' : '이미 사용 중인 닉네임입니다.'
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
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (!value.trim()) {
      setPasswordError('비밀번호를 입력해주세요.')
    } else if (!isPasswordValid(value)) {
      setPasswordError(
        '비밀번호는 최소 8자이며, 영문/숫자/특수문자 중 2가지 이상을 포함해야 합니다.'
      )
    } else {
      setPasswordError('')
    }
    if (passwordCheck && value !== passwordCheck) {
      setPasswordCheckError('비밀번호가 서로 일치하지 않습니다.')
    } else {
      setPasswordCheckError('')
    }
  }

  const handlePasswordCheckChange = (value: string) => {
    setPasswordCheck(value)
    if (!value.trim()) {
      setPasswordCheckError('비밀번호 확인을 입력해주세요.')
    } else if (value !== password) {
      setPasswordCheckError('비밀번호가 서로 일치하지 않습니다.')
    } else {
      setPasswordCheckError('')
    }
  }

  // ─── 제출 ─────────────────────────────────────────────────────────────

  const handleSubmit = async ({
    phone,
    firebaseIdToken,
    emailSessionId,
  }: SubmitParams) => {
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

      const contact = normalizePhone(phone)
      let signupSessionId: string

      const cached = signupSessionCacheRef.current
      if (cached && cached.contact === contact) {
        signupSessionId = cached.signupSessionId
      } else {
        const tokenForSession =
          (await getFreshFirebaseIdToken()) ?? firebaseIdToken
        if (!tokenForSession) {
          setSignupError(
            '전화번호 인증이 만료되었습니다. 1단계에서 다시 인증해 주세요.'
          )
          return
        }
        signupSessionId = await createSignupSession(contact, tokenForSession)
        signupSessionCacheRef.current = { contact, signupSessionId }
      }

      if (isSocialSignup && socialLoginData) {
        let authorizationCode = socialLoginData.authorizationCode
        let oauthToken = socialLoginData.oauthToken
        let kakaoWebRedirectUri: string | undefined

        if (socialLoginData.provider === 'KAKAO') {
          try {
            kakaoWebRedirectUri = getKakaoOAuthRedirectUri()
            const kakaoOauth =
              await requestFreshKakaoAuthorizationCode(kakaoWebRedirectUri)
            authorizationCode = kakaoOauth.authorizationCode
            kakaoWebRedirectUri = kakaoOauth.redirectUri
            oauthToken = undefined
          } catch (err) {
            const e = err as Error
            setSignupError(
              e.message ||
                '카카오 인증을 완료하지 못했습니다. 팝업 허용 후 다시 시도해 주세요.'
            )
            return
          }
        }

        await signupSocial(
          {
            signupSessionId,
            provider: socialLoginData.provider,
            ...(oauthToken ? { oauthToken } : {}),
            ...(authorizationCode ? { authorizationCode } : {}),
            ...(socialLoginData.provider === 'KAKAO' &&
            socialLoginData.platformType === 'WEB'
              ? {
                  redirectUri:
                    kakaoWebRedirectUri ?? getKakaoOAuthRedirectUri(),
                }
              : {}),
            platformType: socialLoginData.platformType,
            name: name.trim(),
            nickname: nickname.trim(),
            gender: getGenderCode(gender),
            birthday,
          },
          setAuth,
          navigate
        )
        return
      }

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
      const e = error as { data?: { code?: string }; message?: string }
      if (e.data?.code === 'A006') {
        signupSessionCacheRef.current = null
      }
      setSignupError(e.message || '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── 유효성 ───────────────────────────────────────────────────────────

  /** 전화번호 인증 완료 여부를 외부에서 주입받아 계산 */
  const isStep1Valid = (phoneVerified: boolean) =>
    !!(
      name.trim() &&
      gender &&
      birth.trim().length === 8 &&
      !birthError &&
      phoneVerified
    )

  /** 이메일은 선택 항목: 입력하지 않았거나 인증 완료 시 통과 (소셜 가입 시 이메일·비밀번호 불필요) */
  const isStep2Valid = (emailValue: string, emailVerified: boolean) => {
    if (isSocialSignup) {
      return nicknameChecked && agreed
    }
    return (
      nicknameChecked &&
      (!emailValue.trim() || emailVerified) &&
      agreed &&
      isPasswordValid(password) &&
      password === passwordCheck &&
      !passwordError &&
      !passwordCheckError
    )
  }

  return {
    // 1단계 상태
    name,
    setName,
    gender,
    setGender,
    birth,
    birthError,
    handleBirthChange,

    // 2단계 상태
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

    // 유효성 검사
    isStep1Valid,
    isStep2Valid,

    // 제출
    handleSubmit,

    /** 소셜 유입 가입 — UI에서 이메일·비밀번호 영역 숨김 */
    isSocialSignup,
  }
}
