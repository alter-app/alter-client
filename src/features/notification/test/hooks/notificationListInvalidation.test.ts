import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { queryKeys } from '@/shared/lib/queryKeys'

describe('알림 목록 prefix 무효화', () => {
  it('scope의 전체·일반·근무 목록을 모두 무효화하고 다른 scope는 건드리지 않는다', async () => {
    const client = new QueryClient()
    const userKeys = [
      queryKeys.notification.list('USER', undefined),
      queryKeys.notification.list('USER', 'GENERAL'),
      queryKeys.notification.list('USER', 'SCHEDULE'),
    ]
    const managerKey = queryKeys.notification.list('MANAGER', undefined)
    for (const key of [...userKeys, managerKey]) {
      client.setQueryData(key, { pages: [] })
    }

    await client.invalidateQueries({
      queryKey: queryKeys.notification.lists('USER'),
    })

    for (const key of userKeys) {
      expect(client.getQueryState(key)?.isInvalidated).toBe(true)
    }
    expect(client.getQueryState(managerKey)?.isInvalidated).toBe(false)
  })
})
