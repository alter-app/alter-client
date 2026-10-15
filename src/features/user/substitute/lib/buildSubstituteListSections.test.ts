import { describe, expect, it } from 'vitest'

import type {
  ReceivedSubstituteRequestDto,
  SubstituteRequestStatus,
} from '@/features/user/substitute/types'

import { adaptUserSubstituteListItem } from './adaptUserSubstituteRequest'
import { buildSubstituteListSections } from './buildSubstituteListSections'

function item(id: number, status: SubstituteRequestStatus) {
  const dto: ReceivedSubstituteRequestDto = {
    id,
    schedule: {
      scheduleId: id,
      startDateTime: '2026-10-08T09:00:00',
      endDateTime: '2026-10-08T13:00:00',
      position: 'STAFF',
    },
    workspace: { workspaceId: 10, workspaceName: '카페' },
    requester: { workerId: 5, workerName: '요청자' },
    requestType: 'SPECIFIC',
    status,
    createdAt: '2026-10-01T00:00:00',
  }
  return adaptUserSubstituteListItem(dto, 'RECEIVED')
}

describe('buildSubstituteListSections', () => {
  it('전체 필터는 요청됨·수락됨·승인됨·취소됨 순서로 상태별 섹션을 만든다', () => {
    const sections = buildSubstituteListSections(
      [
        item(1, 'APPROVED'),
        item(2, 'EXPIRED'),
        item(3, 'ACCEPTED'),
        item(4, 'PENDING'),
      ],
      'all'
    )

    expect(sections.map(section => section.title)).toEqual([
      '요청됨',
      '수락됨',
      '승인됨',
      '취소됨',
    ])
    expect(sections.map(section => section.items.map(i => i.id))).toEqual([
      [4],
      [3],
      [1],
      [2],
    ])
  })

  it('전체 필터에서 항목이 없는 상태의 섹션은 만들지 않는다', () => {
    const sections = buildSubstituteListSections(
      [item(1, 'APPROVED'), item(2, 'APPROVED')],
      'all'
    )

    expect(sections).toHaveLength(1)
    expect(sections[0].key).toBe('approved')
    expect(sections[0].items).toHaveLength(2)
  })

  it('상태 필터는 해당 필터 제목의 섹션 하나로 모든 항목을 묶는다', () => {
    const sections = buildSubstituteListSections(
      [item(1, 'APPROVED'), item(2, 'APPROVED')],
      'approved'
    )

    expect(sections).toEqual([
      expect.objectContaining({ key: 'approved', title: '승인됨' }),
    ])
    expect(sections[0].items.map(i => i.id)).toEqual([1, 2])
  })

  it('항목이 없으면 빈 배열을 반환한다', () => {
    expect(buildSubstituteListSections([], 'all')).toEqual([])
    expect(buildSubstituteListSections([], 'accepted')).toEqual([])
  })
})
