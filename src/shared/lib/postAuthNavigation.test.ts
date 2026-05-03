import { describe, expect, it, vi } from 'vitest'

import { ROUTES } from '@/shared/constants/routes'

import { navigatePostAuth, resolvePostAuthPath } from './postAuthNavigation'

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

describe('navigatePostAuth', () => {
  it('resolvePostAuthPath 결과로 replace 네비게이션한다', () => {
    const navigate = vi.fn()
    navigatePostAuth('MANAGER', navigate, {
      redirectFrom: ROUTES.USER.WORKSPACE_JOIN,
    })
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith(ROUTES.USER.WORKSPACE_JOIN, {
      replace: true,
    })
  })

  it('redirectFrom 없으면 역할 홈으로 이동한다', () => {
    const navigate = vi.fn()
    navigatePostAuth('USER', navigate)
    expect(navigate).toHaveBeenCalledWith(ROUTES.USER.HOME, {
      replace: true,
    })
  })
})
