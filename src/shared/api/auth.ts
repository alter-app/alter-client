import type { NavigateFunction } from 'react-router-dom'
import { API_CONFIG } from '../lib/apiConfig'

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
    const response = await fetch(`${API_CONFIG.BASE_URL}/public/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '로그인에 실패했습니다.',
      }
      throw error
    }

    const result: ApiResponse<GenerateTokenResponseDto> = await response.json()
    const { data } = result

    // API 응답을 앱 내부 형식으로 변환
    // scope는 "APP"으로 오지만, 필요시 매핑 로직 추가 가능
    const scope =
      data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

    const loginResponse: LoginResponse = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      scope: scope,
    }

    setAuth(loginResponse)

    // 로그인 성공 후 리다이렉트
    if (scope === 'MANAGER') {
      navigate('/main', { replace: true })
    } else {
      navigate('/job-lookup-map', { replace: true })
    }

    return loginResponse
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '네트워크 오류가 발생했습니다.',
    } as ApiError
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
  const response = await fetch(
    `${API_CONFIG.BASE_URL}/public/users/login-social`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({}))

    // B011: 존재하지 않는 사용자 계정 - 회원가입 필요
    if (errorData.code === 'B011') {
      const error: ApiError = {
        data: errorData,
        message: '신규 사용자입니다. 회원가입을 진행해주세요.',
      }
      // 회원가입 페이지로 리다이렉트 (소셜 로그인 정보와 함께)
      navigate('/signup', {
        state: {
          socialLoginData: request,
          errorCode: 'B011',
        },
        replace: false,
      })
      throw error
    }

    const error: ApiError = {
      data: errorData,
      message:
        errorData.message ||
        getErrorMessage(errorData.code) ||
        '소셜 로그인에 실패했습니다.',
    }
    throw error
  }

  const result: SocialLoginResponse = await response.json()
  const { data } = result

  // API 응답을 앱 내부 형식으로 변환
  // scope는 "APP"으로 오지만, 필요시 매핑 로직 추가 가능
  const scope =
    data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')

  setAuth({
    token: data.accessToken,
    refreshToken: data.refreshToken,
    scope: scope,
  })

  // 로그인 성공 후 리다이렉트
  if (scope === 'MANAGER') {
    navigate('/main', { replace: true })
  } else {
    navigate('/job-lookup-map', { replace: true })
  }

  return result
}

export async function checkNicknameDuplicate(
  nickname: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/public/users/exists/nickname`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '닉네임 중복 검사 중 오류가 발생했습니다.',
      }
      throw error
    }

    const result: ApiResponse<CheckNicknameDuplicationResponseDto> =
      await response.json()

    // duplicated === true 이면 이미 사용 중이므로, 사용 가능 여부는 false
    return result.data.duplicated === false
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '닉네임 중복 검사 중 오류가 발생했습니다.',
    } as ApiError
  }
}

export async function checkEmailDuplicate(email: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/public/users/exists/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '이메일 중복 검사 중 오류가 발생했습니다.',
      }
      throw error
    }

    const result: ApiResponse<CheckEmailDuplicationResponseDto> =
      await response.json()

    // duplicated === true 이면 이미 사용 중이므로, 사용 가능 여부는 false
    return result.data.duplicated === false
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '이메일 중복 검사 중 오류가 발생했습니다.',
    } as ApiError
  }
}

export async function createSignupSession(phone: string): Promise<string> {
  try {
    const contact = phone.replace(/-/g, '')

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/public/users/signup-session`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact }),
      }
    )

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '회원가입 세션 생성 중 오류가 발생했습니다.',
      }
      throw error
    }

    const result: ApiResponse<CreateSignupSessionResponseDto> =
      await response.json()

    return result.data.signupSessionId
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/public/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message:
          errorData.message ||
          getErrorMessage(errorData.code) ||
          '회원가입에 실패했습니다.',
      }
      throw error
    }

    const result: ApiResponse<GenerateTokenResponseDto> = await response.json()
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
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '회원가입에 실패했습니다.',
    } as ApiError
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
