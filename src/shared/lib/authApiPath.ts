/** USER(scope) → /app/*, MANAGER → /manager/* */
export function getAuthApiBasePath(
  scope: 'MANAGER' | 'USER' | null | undefined
): 'app' | 'manager' {
  return scope === 'MANAGER' ? 'manager' : 'app'
}
