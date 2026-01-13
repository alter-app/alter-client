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

interface SocialLoginRequest {
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

interface SocialLoginResponse extends ApiResponse<GenerateTokenResponseDto> {}

interface ErrorResponse {
  code?: string
  message?: string
}

interface ApiError {
  data?: ErrorResponse
  message?: string
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
        message: errorData.message || getErrorMessage(errorData.code) || '로그인에 실패했습니다.',
      }
      throw error
    }

    const result: ApiResponse<GenerateTokenResponseDto> = await response.json()
    const { data } = result

    // API 응답을 앱 내부 형식으로 변환
    // scope는 "APP"으로 오지만, 필요시 매핑 로직 추가 가능
    const scope = data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')
    
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

export async function loginSocial(
  request: SocialLoginRequest,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<SocialLoginResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/public/users/login-social`, {
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
        message: errorData.message || getErrorMessage(errorData.code) || '소셜 로그인에 실패했습니다.',
      }
      throw error
    }

    const result: SocialLoginResponse = await response.json()
    const { data } = result

    // API 응답을 앱 내부 형식으로 변환
    // scope는 "APP"으로 오지만, 필요시 매핑 로직 추가 가능
    const scope = data.scope === 'APP' ? 'USER' : (data.scope as 'MANAGER' | 'USER')
    
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
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '네트워크 오류가 발생했습니다.',
    } as ApiError
  }
}

/**
 * 에러 코드에 따른 메시지 반환
 */
function getErrorMessage(code?: string): string | undefined {
  const errorMessages: Record<string, string> = {
    B011: '존재하지 않는 사용자 계정입니다.',
    // 추가 에러 코드 매핑 가능
  }
  return code ? errorMessages[code] : undefined
}

