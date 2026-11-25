import { describe, expect, it } from 'vitest'
import {
  adaptApplicationDto,
  type ApplicationDto,
} from '@/features/user/home/applied-stores/types/application'

const base = (workspace: ApplicationDto['posting']['workspace']) =>
  ({
    id: 1,
    postingSchedule: {
      id: 1,
      workingDays: 'MONDAY',
      startTime: '09:00',
      endTime: '18:00',
      position: 'staff',
    },
    posting: {
      id: 1,
      workspace,
      title: '주말 알바',
      payAmount: 10000,
      paymentType: 'HOURLY',
    },
    description: '안녕하세요',
    status: { value: 'SUBMITTED', description: '제출됨' },
    createdAt: '2026-11-20T10:00:00',
  }) as ApplicationDto

describe('adaptApplicationDto 주소', () => {
  it('기본+상세 주소와 지번을 분리해 내려준다', () => {
    const r = adaptApplicationDto(
      base({
        id: 1,
        fullAddress: '서울 강남구 테헤란로 123',
        jibunAddress: '서울 강남구 역삼동 456-7',
        detailAddress: '3층',
      })
    )
    expect(r.workspaceAddress).toBe('서울 강남구 테헤란로 123 3층')
    expect(r.workspaceJibunAddress).toBe('서울 강남구 역삼동 456-7')
  })
  it('null 이거나 id(number)만 오면 빈 문자열', () => {
    expect(
      adaptApplicationDto(
        base({ fullAddress: '서울', jibunAddress: null, detailAddress: null })
      ).workspaceJibunAddress
    ).toBe('')
    expect(adaptApplicationDto(base(7)).workspaceAddress).toBe('')
  })
})
