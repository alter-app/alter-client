import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  scope: 'MANAGER' | 'USER' | null
  user: {
    email?: string
    name?: string
  } | null
  setAuth: (data: {
    token: string
    refreshToken?: string
    scope: 'MANAGER' | 'USER'
    user?: { email?: string; name?: string }
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      scope: null,
      user: null,
      setAuth: data =>
        set({
          token: data.token,
          refreshToken: data.refreshToken || null,
          isLoggedIn: true,
          scope: data.scope,
          user: data.user || null,
        }),
      logout: () =>
        set({
          token: null,
          refreshToken: null,
          isLoggedIn: false,
          scope: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
