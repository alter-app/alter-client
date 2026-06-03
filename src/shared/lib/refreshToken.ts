import axios from 'axios'

import { API_CONFIG } from './apiConfig'
import { getAuthApiBasePath } from './authApiPath'
import { useAuthStore } from '../stores/useAuthStore'

interface RefreshTokenResponseDto {
  accessToken: string
  refreshToken: string
  authorizationId: string
  scope: string
}

interface ApiResponse<T> {
  data: T
}

/**
 * 액세스 토큰 재발급 — authInstance 인터셉터를 거치지 않도록 직접 axios 사용
 */
export async function refreshAccessToken(): Promise<string> {
  const { refreshToken, scope, isLoggedIn } = useAuthStore.getState()

  if (!refreshToken || !isLoggedIn) {
    throw new Error('RefreshToken이 없습니다.')
  }

  const basePath = getAuthApiBasePath(scope)

  const { data: result } = await axios.post<
    ApiResponse<RefreshTokenResponseDto>
  >(
    `${API_CONFIG.BASE_URL}/${basePath}/auth/token`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  )

  const { accessToken, refreshToken: newRefreshToken } = result.data
  const resolvedScope =
    scope ?? (result.data.scope === 'MANAGER' ? 'MANAGER' : 'USER')

  useAuthStore.getState().setAuth({
    token: accessToken,
    refreshToken: newRefreshToken,
    scope: resolvedScope,
  })

  return accessToken
}
