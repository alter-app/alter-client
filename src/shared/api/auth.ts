import useAuthStore from '../stores/useAuthStore'
import type { NavigateFunction } from 'react-router-dom'

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

interface ApiError {
  data?: {
    fieldErrors?: {
      email?: string
      password?: string
      [key: string]: string | undefined
    }
    globalError?: string
    message?: string
  }
  message?: string
}

export async function loginIDPW(
  credentials: LoginCredentials,
  setAuth: (data: LoginResponse) => void,
  navigate: NavigateFunction
): Promise<LoginResponse> {
  try {
    // TODO: 실제 API 엔드포인트로 변경
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error: ApiError = {
        data: errorData,
        message: errorData.message || '로그인에 실패했습니다.',
      }
      throw error
    }

    const data: LoginResponse = await response.json()
    setAuth(data)

    // 로그인 성공 후 리다이렉트
    if (data.scope === 'MANAGER') {
      navigate('/main', { replace: true })
    } else {
      navigate('/job-lookup-map', { replace: true })
    }

    return data
  } catch (error) {
    if (error && typeof error === 'object' && 'data' in error) {
      throw error as ApiError
    }
    throw {
      message: '네트워크 오류가 발생했습니다.',
    } as ApiError
  }
}

