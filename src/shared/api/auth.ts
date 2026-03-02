import axios from 'axios'
import type { NavigateFunction } from 'react-router-dom'

import axiosInstance from '../lib/axiosInstance'

interface LoginCredentials {
  email: string
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
  platformType: 'WEB' | 'NATIVE'
}

// API 응답 형식 (CommonApiResponse<GenerateTokenResponseDto>)
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
  email: string
  password: string
  name: string
  nickname: string
  gender: 'GENDER_MALE' | 'GENDER_FEMALE'
  birthday: string
  contact: string
}

interface CheckNicknameDuplicationResponseDto {
  nickname: string
  duplicated: boolean
}

interface CheckEmailDuplicationResponseDto {
  email: string
  duplicated: boolean
}

interface CreateSignupSessionResponseDto {
  signupSessionId: string
}

export async function loginIDPW(
  credentials: LoginCredentials,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    const { data: result } = await axiosInstance.post<
      ApiResponse<GenerateTokenResponseDto>
    >('/public/users/login', credentials)

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
      navigate('/main', { replace: true })
    } else {
      navigate('/job-lookup-map', { replace: true })
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
    const { data: result } = await axiosInstance.post<SocialLoginResponse>(
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
      navigate('/main', { replace: true })
    } else {
      navigate('/job-lookup-map', { replace: true })
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
    const { data: result } = await axiosInstance.post<
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

export async function checkEmailDuplicate(email: string): Promise<boolean> {
  try {
    const { data: result } = await axiosInstance.post<
      ApiResponse<CheckEmailDuplicationResponseDto>
    >('/public/users/exists/email', { email })

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
          '이메일 중복 검사 중 오류가 발생했습니다.',
      } as ApiError
    }
    throw {
      message: '이메일 중복 검사 중 오류가 발생했습니다.',
    } as ApiError
  }
}

export async function createSignupSession(phone: string): Promise<string> {
  try {
    const contact = phone.replace(/-/g, '')

    const { data: result } = await axiosInstance.post<
      ApiResponse<CreateSignupSessionResponseDto>
    >('/public/users/signup-session', { contact })

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

export async function signup(
  request: SignupRequest,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    const { data: result } = await axiosInstance.post<
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
      navigate('/main', { replace: true })
    } else {
      navigate('/job-lookup-map', { replace: true })
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
    B011: '존재하지 않는 사용자 계정입니다.',
    A004: '이미 사용 중인 이메일입니다.',
    // 추가 에러 코드 매핑 가능
  }
  return code ? errorMessages[code] : undefined
}
