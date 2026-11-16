import { partialMatchKey } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { queryKeys } from '@/shared/lib/queryKeys'

import { SUBSTITUTE_APPROVE_REFETCH_QUERY_KEYS } from '../../lib/approveRefetchQueryKeys'

function isRefetched(queryKey: readonly unknown[]) {
  return SUBSTITUTE_APPROVE_REFETCH_QUERY_KEYS.some(prefix =>
    partialMatchKey(queryKey, prefix)
  )
}

describe('대타 승인 후 다시 조회하는 쿼리', () => {
  it('관리자 대타 요청 목록을 다시 조회한다', () => {
    expect(
      isRefetched(
        queryKeys.substitute.list({ workspaceId: 1, statusFilter: 'all' })
      )
    ).toBe(true)
  })

  it('관리자 월간·오늘 일정을 다시 조회한다', () => {
    expect(isRefetched(queryKeys.manager.schedules(1, 2026, 11))).toBe(true)
    expect(isRefetched(queryKeys.manager.todaySchedules(1))).toBe(true)
  })

  it('알바생 대타 목록은 대상이 아니다', () => {
    expect(
      isRefetched(
        queryKeys.userSubstitute.list({ direction: 'SENT', pageSize: 20 })
      )
    ).toBe(false)
  })
})
