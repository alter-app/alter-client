import { describe, expect, it } from 'vitest'

import { validatePostingForm } from '@/features/manager/posting/hooks/usePostingForm'
import type {
  PostingFormSchedule,
  PostingFormValues,
} from '@/features/manager/posting/types/posting'

import {
  toCreatePostingRequest,
  toUpdatePostingRequest,
} from '../../lib/buildPostingRequest'

function values(): PostingFormValues {
  return {
    workspaceId: 10,
    title: '주말 홀서빙 모집',
    schedules: [
      {
        key: 'existing-1',
        id: 1,
        workingDays: ['SATURDAY', 'SUNDAY'],
        startTime: '17:00',
        endTime: '22:00',
        position: '홀서빙',
        positionsNeeded: 2,
      },
    ],
    paymentType: 'HOURLY',
    payAmount: '12000',
    description: '상세내용',
  }
}

describe('공고 폼 검증과 요청 생성', () => {
  it('등록에서는 근무일정이 최소 1개 필요하다', () => {
    expect(
      validatePostingForm({ ...values(), schedules: [] }, false).schedules
    ).toBe('근무일정을 1개 이상 추가해 주세요')
  })

  it('수정에서는 근무일정 0개를 허용한다', () => {
    expect(validatePostingForm({ ...values(), schedules: [] }, true)).toEqual(
      {}
    )
  })

  it('모든 기존 일정을 삭제 목록에 담는다', () => {
    expect(
      toUpdatePostingRequest({ ...values(), schedules: [] }, [1, 2])
    ).toMatchObject({
      createSchedules: [],
      updateSchedules: [],
      deleteScheduleIds: [1, 2],
    })
  })

  it('기존 일정 삭제와 신규 일정 추가를 함께 직렬화한다', () => {
    const newSchedule: PostingFormSchedule = {
      ...values().schedules[0],
      key: 'new-1',
      id: null,
      workingDays: ['MONDAY'],
      startTime: '09:00',
      endTime: '18:00',
    }
    const request = toUpdatePostingRequest(
      { ...values(), schedules: [newSchedule] },
      [1]
    )

    expect(request.deleteScheduleIds).toEqual([1])
    expect(request.updateSchedules).toEqual([])
    expect(request.createSchedules[0]).toMatchObject({
      workingDays: ['MONDAY'],
      startTime: '09:00',
      endTime: '18:00',
    })
  })

  it('등록 요청은 대문자 요일, HH:mm, 양수 급여를 유지한다', () => {
    expect(toCreatePostingRequest(values(), 10)).toMatchObject({
      workspaceId: 10,
      payAmount: 12000,
      schedules: [
        {
          workingDays: ['SATURDAY', 'SUNDAY'],
          startTime: '17:00',
          endTime: '22:00',
        },
      ],
    })
  })
})
