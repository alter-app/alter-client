import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { homePathForScope } from '@/shared/lib/homePath'
import useAuthStore from '@/shared/stores/useAuthStore'
import { AuthRouteGuard } from './AuthRouteGuard'

type ExpectedScope = 'MANAGER' | 'USER'

interface HomeRouteGuardProps {
  expected: ExpectedScope
  children: ReactNode
}

function ScopeRouteGuard({ expected, children }: HomeRouteGuardProps) {
  const scope = useAuthStore(s => s.scope)
  const allowedPath =
    expected === 'MANAGER' ? ROUTES.MANAGER.HOME : ROUTES.USER.HOME
  const targetHome = homePathForScope(scope)

  if (targetHome !== allowedPath) {
    return <Navigate to={targetHome} replace />
  }

  return <>{children}</>
}

export function HomeRouteGuard({ expected, children }: HomeRouteGuardProps) {
  return (
    <AuthRouteGuard>
      <ScopeRouteGuard expected={expected}>{children}</ScopeRouteGuard>
    </AuthRouteGuard>
  )
}
