import type { ReactNode } from 'react'
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
  const hasHydrated = useAuthStore(s => s.hasHydrated)
  const isLoggedIn = useAuthStore(s => s.isLoggedIn)
  const token = useAuthStore(s => s.token)
  const scope = useAuthStore(s => s.scope)

  if (!hasHydrated) {
    return null
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
