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
  /** persist 재수화 완료 여부 — 스토리지 복원 전에는 false */
  hasHydrated: boolean
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
      hasHydrated: false,
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
      partialize: state => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
        scope: state.scope,
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)

export default useAuthStore
