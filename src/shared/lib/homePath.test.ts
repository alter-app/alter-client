import { describe, expect, it } from 'vitest'

import { ROUTES } from '@/shared/constants/routes'

import { homePathForScope } from './homePath'

describe('homePathForScope', () => {
  it('MANAGER이면 매니저 홈을 반환한다', () => {
    expect(homePathForScope('MANAGER')).toBe(ROUTES.MANAGER.HOME)
  })

  it('USER이면 유저 홈을 반환한다', () => {
    expect(homePathForScope('USER')).toBe(ROUTES.USER.HOME)
  })

  it('scope가 null이면 유저 홈으로 폴백한다', () => {
    expect(homePathForScope(null)).toBe(ROUTES.USER.HOME)
  })
})
