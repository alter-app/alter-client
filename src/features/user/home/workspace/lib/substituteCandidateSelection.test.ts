import { describe, expect, it } from 'vitest'

import {
  retainAvailableCandidateKeys,
  workerIdFromCandidateKey,
} from './substituteCandidateSelection'

describe('workerIdFromCandidateKey', () => {
  it('ew- 접두사 키에서 근무자 id를 꺼낸다', () => {
    expect(workerIdFromCandidateKey('ew-12')).toBe(12)
  })

  it('형식이 다른 키는 undefined를 돌려준다', () => {
    expect(workerIdFromCandidateKey('12')).toBeUndefined()
    expect(workerIdFromCandidateKey('ew-abc')).toBeUndefined()
  })
})

describe('retainAvailableCandidateKeys', () => {
  it('다시 조회한 후보에서 빠진 근무자의 선택을 해제한다', () => {
    const selected = new Set(['ew-1', 'ew-2'])

    expect([...retainAvailableCandidateKeys(selected, [2, 3])]).toEqual([
      'ew-2',
    ])
  })

  it('선택한 근무자가 모두 후보에 남아 있으면 같은 Set을 돌려준다', () => {
    const selected = new Set(['ew-1'])

    expect(retainAvailableCandidateKeys(selected, [1, 2])).toBe(selected)
  })

  it('후보가 비면 선택을 모두 해제한다', () => {
    expect(retainAvailableCandidateKeys(new Set(['ew-1']), []).size).toBe(0)
  })
})
