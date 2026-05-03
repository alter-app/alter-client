import { ROUTES } from '@/shared/constants/routes'

export type AuthScope = 'MANAGER' | 'USER' | null

export type HomePath =
  | (typeof ROUTES.MANAGER)['HOME']
  | (typeof ROUTES.USER)['HOME']

export function homePathForScope(scope: AuthScope): HomePath {
  return scope === 'MANAGER' ? ROUTES.MANAGER.HOME : ROUTES.USER.HOME
}
