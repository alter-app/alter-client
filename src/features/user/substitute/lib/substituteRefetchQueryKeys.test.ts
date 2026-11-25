import { partialMatchKey } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { queryKeys } from '@/shared/lib/queryKeys'

import {
  USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS,
  buildSubstituteCreateRefetchQueryKeys,
} from './substituteRefetchQueryKeys'

function matchesAny(
  prefixes: ReadonlyArray<readonly unknown[]>,
  queryKey: readonly unknown[]
) {
  return prefixes.some(prefix => partialMatchKey(queryKey, prefix))
}

describe('받은 대타 요청 수락·거절 후 다시 조회하는 쿼리', () => {
  it('보낸·받은 목록을 필터와 관계없이 모두 다시 조회한다', () => {
    expect(
      matchesAny(
        USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS,
        queryKeys.userSubstitute.list({
          direction: 'RECEIVED',
          pageSize: 20,
          statusFilter: 'pending',
        })
      )
    ).toBe(true)
    expect(
      matchesAny(
        USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS,
        queryKeys.userSubstitute.list({ direction: 'SENT', pageSize: 20 })
      )
    ).toBe(true)
  })

  it('관리자 대타 목록은 대상이 아니다', () => {
    expect(
      matchesAny(
        USER_SUBSTITUTE_RESPOND_REFETCH_QUERY_KEYS,
        queryKeys.substitute.list({ workspaceId: 1, statusFilter: 'all' })
      )
    ).toBe(false)
  })
})

describe('대타 요청 생성 후 다시 조회하는 쿼리', () => {
  const keys = buildSubstituteCreateRefetchQueryKeys(7, 3)

  it('해당 근무의 후보·해당 업장의 내 교환 가능 일정·대타 목록을 다시 조회한다', () => {
    expect(
      matchesAny(keys, queryKeys.workspace.exchangeableWorkers(7, 50))
    ).toBe(true)
    expect(
      matchesAny(
        keys,
        queryKeys.workspace.exchangeableSchedules(3, { year: 2026, month: 11 })
      )
    ).toBe(true)
    expect(
      matchesAny(
        keys,
        queryKeys.userSubstitute.list({ direction: 'SENT', pageSize: 20 })
      )
    ).toBe(true)
  })

  it('다른 근무의 후보와 다른 업장의 일정은 대상이 아니다', () => {
    expect(
      matchesAny(keys, queryKeys.workspace.exchangeableWorkers(8, 50))
    ).toBe(false)
    expect(matchesAny(keys, queryKeys.workspace.exchangeableSchedules(4))).toBe(
      false
    )
  })

  it('workspaceId가 없으면 내 교환 가능 일정은 빼고 후보·목록만 다시 조회한다', () => {
    const withoutWorkspace = buildSubstituteCreateRefetchQueryKeys(7)

    expect(withoutWorkspace).toEqual([
      ['workspace', 'exchangeableWorkers', 7],
      ['userSubstitute', 'list'],
    ])
  })
})
