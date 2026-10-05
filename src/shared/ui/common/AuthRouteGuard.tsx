import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import useAuthStore from '@/shared/stores/useAuthStore'

interface AuthRouteGuardProps {
  children: ReactNode
}

/**
 * 로그인만 요구하는 공용 가드
 * USER/MANAGER 모두 접근 가능한 `/my`, 알림, 채팅 등에 사용
 */
export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const location = useLocation()
  const authReady = useAuthStore(s => s.hasHydrated || Boolean(s.token))
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const token = useAuthStore(s => s.token)

  useEffect(() => {
    const id = window.setTimeout(() => {
      useAuthStore.setState(s => (s.hasHydrated ? {} : { hasHydrated: true }))
    }, 2500)
    return () => window.clearTimeout(id)
  }, [])

  if (!authReady) {
    return (
      <div
        className="flex min-h-dvh w-full items-center justify-center bg-bg-light px-4"
        aria-busy
      >
        <p className="text-center text-3 text-text-70">불러오는 중…</p>
      </div>
    )
  }

  if (!isLoggedIn || !token) {
    return (
      <Navigate
        to={ROUTES.AUTH.LOGIN}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <>{children}</>
}
