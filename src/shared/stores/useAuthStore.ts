import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

/** localStorage 사용 불가 시에도 persist·재수화 콜백이 동작하도록 메모리 스토리지로 폴백 */
function createMemoryStorage(): StateStorage {
  const map = new Map<string, string>()
  return {
    getItem: name => map.get(name) ?? null,
    setItem: (name, value) => {
      map.set(name, value)
    },
    removeItem: name => {
      map.delete(name)
    },
  }
}

function getAuthPersistStorage(): StateStorage {
  if (typeof window === 'undefined') {
    return createMemoryStorage()
  }
  try {
    const { localStorage: ls } = window
    const probe = '__alter_auth_ls_probe__'
    ls.setItem(probe, '1')
    ls.removeItem(probe)
    return ls
  } catch {
    return createMemoryStorage()
  }
}

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
      storage: createJSONStorage(getAuthPersistStorage),
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

/**
 * persist 내부 재수화 완료 여부 — `onRehydrateStorage` 반환 콜백만으로는
 * hydrate 버전 경합(예: React Strict Mode) 시 `hasHydrated`가 안 올라가는 경우가 있어
 * `persist.hasHydrated` / `onFinishHydration`을 함께 사용합니다.
 */
useAuthStore.persist.onFinishHydration(() => {
  useAuthStore.setState({ hasHydrated: true })
})

export default useAuthStore
