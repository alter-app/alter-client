export type AuthScope = 'MANAGER' | 'USER' | null

export function homePathForScope(
  scope: AuthScope
): '/manager/home' | '/user/home' {
  return scope === 'MANAGER' ? '/manager/home' : '/user/home'
}
