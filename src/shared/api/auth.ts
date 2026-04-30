import axios from 'axios'
import type { NavigateFunction } from 'react-router-dom'

import { publicInstance } from '../lib/axiosInstance'

interface LoginCredentials {
  phone: string
  password: string
}

interface LoginResponse {
  token: string
  refreshToken?: string
  scope: 'MANAGER' | 'USER'
  user?: {
    email?: string
    name?: string
  }
}

export interface SocialLoginRequest {
  provider: 'KAKAO' | 'APPLE'
  oauthToken?: {
    accessToken: string
    refreshToken?: string
  }
  authorizationCode?: string
  /** 카카오 WEB: 서버에서 code 교환 시 authorize 요청과 동일한 redirect_uri 필요 */
  redirectUri?: string
  platformType: 'WEB' | 'NATIVE'
}

// API 응답 형식 (CommonApiResponse<T>)
interface ApiResponse<T> {
  timestamp: string
  data: T
}

interface GenerateTokenResponseDto {
  authorizationId: string
  scope: string
  accessToken: string
  refreshToken: string
}

type SocialLoginResponse = ApiResponse<GenerateTokenResponseDto>

interface ErrorResponse {
  code?: string
  message?: string
}

interface ApiError {
  data?: ErrorResponse
  message?: string
}

// 회원가입 요청 형태
export interface SignupRequest {
  signupSessionId: string
  emailSessionId?: string // 이메일 인증 세션 ID (이메일 입력 시 필수)
  password: string
  name: string
  nickname: string
  gender: 'GENDER_MALE' | 'GENDER_FEMALE'
  birthday: string
  contact: string
}

/** POST /public/users/signup-social — 소셜 계정으로 회원가입 (이메일·비밀번호 없음) */
export interface SignupSocialRequest {
  signupSessionId: string
  provider: 'KAKAO' | 'APPLE'
  oauthToken?: {
    accessToken: string
    refreshToken?: string
  }
  authorizationCode?: string
  /** 카카오 WEB: 서버에서 code 교환 시 authorize 요청과 동일한 redirect_uri 필요 */
  redirectUri?: string
  platformType: 'WEB' | 'NATIVE'
  name: string
  nickname: string
  gender: 'GENDER_MALE' | 'GENDER_FEMALE'
  birthday: string
}

interface CheckNicknameDuplicationResponseDto {
  nickname: string
  duplicated: boolean
}

interface CreateSignupSessionResponseDto {
  signupSessionId: string
}

interface EmailVerificationSessionDto {
  sessionId: string
}

export async function loginIDPW(
  credentials: LoginCredentials,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    const { data: result } = await publicInstance.post<
      ApiResponse<GenerateTokenResponseDto>
    >('/public/users/login', {
      contact: credentials.phone.replace(/-/g, ''),
      password: credentials.password,
    })

    const { data } = result

    const scope =
      data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    const loginResponse: LoginResponse = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      scope,
    }

    setAuth(loginResponse)

    if (scope === 'MANAGER') {
      navigate('/manager/home', { replace: true })
    } else {
      navigate('/user/home', { replace: true })
    }

    return loginResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '로그인에 실패했습니다.',
      } as ApiError
    }
    throw { message: '네트워크 오류가 발생했습니다.' } as ApiError
  }
}

export interface SocialLoginResult {
  success: boolean
  requiresSignup?: boolean
  data?: SocialLoginResponse
  error?: ApiError
}

export async function loginSocial(
  request: SocialLoginRequest,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<SocialLoginResponse> {
  try {
    const { data: result } = await publicInstance.post<SocialLoginResponse>(
      '/public/users/login-social',
      request
    )

    const { data } = result

    const scope =
      data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    setAuth({
      token: data.accessToken,
      refreshToken: data.refreshToken,
      scope,
    })

    if (scope === 'MANAGER') {
      navigate('/manager/home', { replace: true })
    } else {
      navigate('/user/home', { replace: true })
    }

    return result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}

      // B011: 존재하지 않는 사용자 계정 - 회원가입 필요
      if (errorData.code === 'B011') {
        navigate('/signup', {
          state: {
            socialLoginData: request,
            errorCode: 'B011',
          },
          replace: false,
        })
        throw {
          data: errorData,
          message: '신규 사용자입니다. 회원가입을 진행해주세요.',
        } as ApiError
      }

      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '소셜 로그인에 실패했습니다.',
      } as ApiError
    }
    throw { message: '네트워크 오류가 발생했습니다.' } as ApiError
  }
}

export async function checkNicknameDuplicate(
  nickname: string
): Promise<boolean> {
  try {
    const { data: result } = await publicInstance.post<
      ApiResponse<CheckNicknameDuplicationResponseDto>
    >('/public/users/exists/nickname', { nickname })

    // duplicated === true 이면 이미 사용 중이므로, 사용 가능 여부는 false
    return result.data.duplicated === false
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '닉네임 중복 검사 중 오류가 발생했습니다.',
      } as ApiError
    }
    throw {
      message: '닉네임 중복 검사 중 오류가 발생했습니다.',
    } as ApiError
  }
}

/**
 * 회원가입용 이메일 인증 코드 발송
 * - 이미 가입된 이메일이면 A004 에러
 * - 30초 내 재요청 시 E001 에러 (쿨다운)
 */
export async function sendEmailVerification(email: string): Promise<void> {
  try {
    await publicInstance.post('/public/users/email/verification/send', {
      email,
    })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '인증 코드 발송에 실패했습니다.',
      } as ApiError
    }
    throw { message: '네트워크 오류가 발생했습니다.' } as ApiError
  }
}

/**
 * 회원가입용 이메일 인증 코드 검증
 * @returns emailSessionId - 회원가입 요청의 emailSessionId로 사용
 */
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<string> {
  try {
    const { data: result } = await publicInstance.post<
      ApiResponse<EmailVerificationSessionDto>
    >('/public/users/email/verification', { email, code })

    return result.data.sessionId
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '인증 코드 확인에 실패했습니다.',
      } as ApiError
    }
    throw { message: '네트워크 오류가 발생했습니다.' } as ApiError
  }
}

export async function createSignupSession(
  phone: string,
  firebaseIdToken: string
): Promise<string> {
  try {
    const contact = phone.replace(/-/g, '')

    const { data: result } = await publicInstance.post<
      ApiResponse<CreateSignupSessionResponseDto>
    >('/public/users/signup-session', { contact, firebaseIdToken })

    return result.data.signupSessionId
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '회원가입 세션 생성 중 오류가 발생했습니다.',
      } as ApiError
    }
    throw {
      message: '회원가입 세션 생성 중 오류가 발생했습니다.',
    } as ApiError
  }
}

export async function signupSocial(
  request: SignupSocialRequest,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    const { data: result } = await publicInstance.post<
      ApiResponse<GenerateTokenResponseDto>
    >('/public/users/signup-social', request)

    const { data } = result

    const scope =
      data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    const signupResponse: LoginResponse = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      scope,
    }

    setAuth(signupResponse)

    if (scope === 'MANAGER') {
      navigate('/manager/home', { replace: true })
    } else {
      navigate('/user/home', { replace: true })
    }

    return signupResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '회원가입에 실패했습니다.',
      } as ApiError
    }
    throw { message: '회원가입에 실패했습니다.' } as ApiError
  }
}

export async function signup(
  request: SignupRequest,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    const { data: result } = await publicInstance.post<
      ApiResponse<GenerateTokenResponseDto>
    >('/public/users/signup', request)

    const { data } = result

    const scope =
      data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    const signupResponse: LoginResponse = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      scope,
    }

    setAuth(signupResponse)

    if (scope === 'MANAGER') {
      navigate('/manager/home', { replace: true })
    } else {
      navigate('/user/home', { replace: true })
    }

    return signupResponse
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData: ErrorResponse = error.response?.data ?? {}
      throw {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '회원가입에 실패했습니다.',
      } as ApiError
    }
    throw { message: '회원가입에 실패했습니다.' } as ApiError
  }
}

/**
 * 에러 코드에 따른 메시지 반환
 */
function getErrorMessage(code?: string): string | undefined {
  const errorMessages: Record<string, string> = {
    A006: '회원 가입 세션이 존재하지 않습니다. 처음부터 다시 진행해주세요.',
    A010: '소셜 인가 코드가 만료되었거나 이미 사용되었습니다. 로그인을 다시 시도해주세요.',
    A001: '소셜 로그인 처리 중 서버 오류가 났습니다. 카카오 콘솔 Redirect URI·환경(로컬/배포 URL)이 일치하는지 확인해 주세요.',
    B001: '인증 코드가 일치하지 않습니다.',
    B011: '존재하지 않는 사용자 계정입니다.',
    A004: '이미 가입된 이메일입니다.',
    E001: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  }
  return code ? errorMessages[code] : undefined
}
