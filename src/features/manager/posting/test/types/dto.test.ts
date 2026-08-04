import { describe, expect, it } from 'vitest'

import {
  adaptPostingDetail,
  adaptPostingListItem,
  type ManagerPostingDetailDto,
  type ManagerPostingListItemDto,
} from '../../types/dto'
import type { PostingStatus } from '../../types/posting'

function listItem(status: PostingStatus): ManagerPostingListItemDto {
  return {
    id: 1,
    title: '주말 홀서빙 모집',
    payAmount: 12000,
    paymentType: 'HOURLY',
    status: { value: status, description: status },
    createdAt: '2026-08-04T00:00:00',
    schedules: [],
    workspace: {
      id: 10,
      businessName: '알터 강남점',
      businessType: '카페',
    },
  }
}

function detail(applicantCount: number): ManagerPostingDetailDto {
  return {
    id: 1,
    workspace: { id: 10, name: '알터 강남점', businessType: '카페' },
    title: '주말 홀서빙 모집',
    description: '상세내용',
    payAmount: 12000,
    paymentType: 'HOURLY',
    status: { value: 'OPEN', description: '모집중' },
    applicantCount,
    createdAt: '2026-08-04T00:00:00',
    updatedAt: '2026-08-04T00:00:00',
    schedules: [],
  }
}

describe('매니저 공고 DTO 어댑터', () => {
  it.each(['OPEN', 'CLOSED'] as const)(
    '목록의 %s 상태를 화면 모델로 전달한다',
    status => {
      expect(adaptPostingListItem(listItem(status))).toMatchObject({
        status,
        schedules: [],
      })
    }
  )

  it('상세의 지원자 수와 빈 근무일정을 전달한다', () => {
    expect(adaptPostingDetail(detail(6))).toMatchObject({
      applicantCount: 6,
      schedules: [],
    })
  })
})
