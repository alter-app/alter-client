import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/constants/routes'

import { resolvePostAuthPath } from './postAuthNavigation'

describe('resolvePostAuthPath', () => {
  it('from이 없으면 홈으로 보낸다', () => {
    expect(resolvePostAuthPath('USER')).toBe(ROUTES.USER.HOME)
    expect(resolvePostAuthPath('MANAGER')).toBe(ROUTES.MANAGER.HOME)
  })

  it('from이 로그인 페이지면 홈으로 보낸다', () => {
    expect(resolvePostAuthPath('USER', ROUTES.AUTH.LOGIN)).toBe(
      ROUTES.USER.HOME
    )
  })

  it('역할과 맞지 않는 홈 URL은 정규화된 홈으로 바꾼다', () => {
    expect(resolvePostAuthPath('MANAGER', ROUTES.USER.HOME)).toBe(
      ROUTES.MANAGER.HOME
    )
    expect(resolvePostAuthPath('USER', ROUTES.MANAGER.HOME)).toBe(
      ROUTES.USER.HOME
    )
  })

  it('내부 경로는 그대로 유지한다', () => {
    expect(resolvePostAuthPath('USER', ROUTES.USER.WORKSPACE_JOIN)).toBe(
      ROUTES.USER.WORKSPACE_JOIN
    )
  })

  it('절대 경로가 아니면 홈으로 폴백한다', () => {
    expect(resolvePostAuthPath('USER', 'https://evil.test/phish')).toBe(
      ROUTES.USER.HOME
    )
  })
})
