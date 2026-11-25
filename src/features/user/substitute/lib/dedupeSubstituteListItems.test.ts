import { describe, expect, it } from 'vitest'

import { dedupeSubstituteListItems } from './dedupeSubstituteListItems'

describe('dedupeSubstituteListItems', () => {
  it('중복이 없으면 순서를 그대로 유지한다', () => {
    const items = [
      { id: 3, label: 'a' },
      { id: 1, label: 'b' },
      { id: 2, label: 'c' },
    ]

    expect(dedupeSubstituteListItems(items)).toEqual(items)
  })

  it('나중 페이지에 같은 id가 다시 오면 처음 위치에 나중 값으로 한 번만 남긴다', () => {
    const page1 = [
      { id: 10, status: 'REQUESTED' },
      { id: 9, status: 'REQUESTED' },
    ]
    const page2 = [
      { id: 9, status: 'ACCEPTED' },
      { id: 8, status: 'REQUESTED' },
    ]

    expect(dedupeSubstituteListItems([...page1, ...page2])).toEqual([
      { id: 10, status: 'REQUESTED' },
      { id: 9, status: 'ACCEPTED' },
      { id: 8, status: 'REQUESTED' },
    ])
  })

  it('빈 목록은 빈 목록을 돌려준다', () => {
    expect(dedupeSubstituteListItems([])).toEqual([])
  })
})
