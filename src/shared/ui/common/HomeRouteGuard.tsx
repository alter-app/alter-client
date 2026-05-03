import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { homePathForScope } from '@/shared/lib/homePath'
import useAuthStore from '@/shared/stores/useAuthStore'

type ExpectedScope = 'MANAGER' | 'USER'

interface HomeRouteGuardProps {
  expected: ExpectedScope
  children: ReactNode
}

export function HomeRouteGuard({ expected, children }: HomeRouteGuardProps) {
  const location = useLocation()
  /** persist 병합 시 `token`이 먼저 반영되고 `hasHydrated` 콜백이 한 틱 늦을 수 있어 둘 다 본다 */
  const authReady = useAuthStore(s => s.hasHydrated || Boolean(s.token))
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const token = useAuthStore(s => s.token)
  const scope = useAuthStore(s => s.scope)

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

  const allowedPath =
    expected === 'MANAGER' ? ROUTES.MANAGER.HOME : ROUTES.USER.HOME
  const targetHome = homePathForScope(scope)

  if (targetHome !== allowedPath) {
    return <Navigate to={targetHome} replace />
  }

  return <>{children}</>
}
