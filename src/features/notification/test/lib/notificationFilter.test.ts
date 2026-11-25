import { describe, expect, it } from 'vitest'

import {
  NOTIFICATION_FILTER,
  toNotificationTypeParam,
} from '../../lib/notificationFilter'

describe('알림 필터 → 목록 API type 매핑', () => {
  it('전체는 type을 보내지 않는다(undefined)', () => {
    expect(toNotificationTypeParam(NOTIFICATION_FILTER.ALL)).toBeUndefined()
  })

  it('일반은 GENERAL, 근무는 SCHEDULE로 보낸다', () => {
    expect(toNotificationTypeParam(NOTIFICATION_FILTER.GENERAL)).toBe('GENERAL')
    expect(toNotificationTypeParam(NOTIFICATION_FILTER.SCHEDULE)).toBe(
      'SCHEDULE'
    )
  })
})
