import { describe, expect, it } from 'vitest'

import {
  listFixedSchedulesForWorker,
  type WorkerFixedSlotByWeekday,
} from '../../lib/fixedScheduleForWorker'
import {
  defaultRecurrenceForm,
  recurrenceFieldsForCreate,
  recurrenceFieldsForUpdate,
  recurrenceFormFromSlots,
  slotRecurrenceDiffers,
  validateRecurrenceForm,
  type FixedScheduleRecurrenceForm,
} from '../../lib/fixedScheduleRecurrence'
import type { FixedWorkerScheduleDto } from '../../types/fixedWorkerSchdules'

const TODAY = '2026-11-08'

function dto(
  overrides: Partial<FixedWorkerScheduleDto>
): FixedWorkerScheduleDto {
  return {
    id: 1,
    workspaceWorkerId: 7,
    startDayOfWeek: 'MONDAY',
    startTime: '09:00:00',
    endDayOfWeek: 'MONDAY',
    endTime: '18:00:00',
    status: 'ACTIVATED',
    ...overrides,
  }
}

function form(
  overrides: Partial<FixedScheduleRecurrenceForm> = {}
): FixedScheduleRecurrenceForm {
  return { ...defaultRecurrenceForm(TODAY), ...overrides }
}

describe('고정 근무 슬롯의 반복·기간 변환', () => {
  it('enum 래퍼와 문자열 반복 방식을 모두 읽는다', () => {
    const slots = listFixedSchedulesForWorker(
      [
        dto({
          id: 1,
          recurrenceType: { value: 'MONTHLY', description: '매월' },
          weekOfMonth: 2,
          startDate: '2026-10-01',
          endDate: '2027-03-31',
        }),
        dto({ id: 2, startDayOfWeek: 'TUESDAY', recurrenceType: 'WEEKLY' }),
      ],
      7
    )

    expect(slots[0]).toMatchObject({
      recurrenceType: 'MONTHLY',
      weekOfMonth: 2,
      startDate: '2026-10-01',
      endDate: '2027-03-31',
    })
    expect(slots[1]).toMatchObject({
      recurrenceType: 'WEEKLY',
      weekOfMonth: null,
      startDate: null,
      endDate: null,
    })
  })
})

describe('recurrenceFormFromSlots', () => {
  it('슬롯이 없으면 오늘부터 무기한 매주다', () => {
    expect(recurrenceFormFromSlots([], TODAY)).toEqual({
      recurrenceType: 'WEEKLY',
      weekOfMonth: null,
      startDate: TODAY,
      endDate: null,
      dirty: false,
    })
  })

  it('가장 이른 요일 슬롯의 반복·기간으로 채운다', () => {
    const slots = listFixedSchedulesForWorker(
      [
        dto({
          id: 2,
          startDayOfWeek: 'WEDNESDAY',
          endDayOfWeek: 'WEDNESDAY',
          recurrenceType: 'WEEKLY',
          startDate: '2026-12-01',
        }),
        dto({
          id: 1,
          recurrenceType: 'MONTHLY',
          weekOfMonth: 3,
          startDate: '2026-10-01',
          endDate: null,
        }),
      ],
      7
    )

    expect(recurrenceFormFromSlots(slots, TODAY)).toMatchObject({
      recurrenceType: 'MONTHLY',
      weekOfMonth: 3,
      startDate: '2026-10-01',
      endDate: null,
      dirty: false,
    })
  })

  it('반복·기간 도입 전 규칙은 시작일 없이 보여준다', () => {
    const slots = listFixedSchedulesForWorker([dto({})], 7)

    expect(recurrenceFormFromSlots(slots, TODAY)).toMatchObject({
      recurrenceType: 'WEEKLY',
      startDate: null,
    })
  })
})

describe('validateRecurrenceForm', () => {
  it('반복·기간을 바꿨는데 시작일이 없으면 막는다', () => {
    expect(validateRecurrenceForm(form({ startDate: null, dirty: true }))).toBe(
      '적용 시작일을 선택해 주세요.'
    )
  })

  it('기존 규칙을 그대로 두면 시작일이 없어도 저장할 수 있다', () => {
    expect(validateRecurrenceForm(form({ startDate: null }))).toBeNull()
  })

  it('매월인데 주차가 없으면 막는다', () => {
    expect(
      validateRecurrenceForm(form({ recurrenceType: 'MONTHLY', dirty: true }))
    ).toBe('매월 몇 번째 주에 근무하는지 선택해 주세요.')
  })

  it('종료일이 시작일보다 빠르면 막고 같으면 허용한다', () => {
    expect(
      validateRecurrenceForm(
        form({ startDate: '2026-11-10', endDate: '2026-11-09', dirty: true })
      )
    ).toBe('종료일은 시작일보다 빠를 수 없어요.')
    expect(
      validateRecurrenceForm(
        form({ startDate: '2026-11-10', endDate: '2026-11-10', dirty: true })
      )
    ).toBeNull()
  })
})

describe('반복·기간 요청 필드', () => {
  it('등록은 매주면 weekOfMonth를 null로, 종료일 없음은 endDate null로 보낸다', () => {
    expect(
      recurrenceFieldsForCreate(form({ weekOfMonth: 2, dirty: true }))
    ).toEqual({
      recurrenceType: 'WEEKLY',
      weekOfMonth: null,
      startDate: TODAY,
      endDate: null,
    })
  })

  it('등록은 매월이면 주차를 함께 보낸다', () => {
    expect(
      recurrenceFieldsForCreate(
        form({
          recurrenceType: 'MONTHLY',
          weekOfMonth: 5,
          endDate: '2027-01-31',
        })
      )
    ).toEqual({
      recurrenceType: 'MONTHLY',
      weekOfMonth: 5,
      startDate: TODAY,
      endDate: '2027-01-31',
    })
  })

  it('기존 무기한 매주 규칙을 그대로 보여주는 폼이면 등록 필드를 생략한다', () => {
    expect(recurrenceFieldsForCreate(form({ startDate: null }))).toEqual({})
  })

  it('수정은 반복·기간을 바꾼 경우에만 필드를 보낸다', () => {
    expect(recurrenceFieldsForUpdate(form())).toEqual({})
    expect(recurrenceFieldsForUpdate(form({ dirty: true }))).toMatchObject({
      recurrenceType: 'WEEKLY',
      startDate: TODAY,
    })
  })
})

describe('slotRecurrenceDiffers', () => {
  const slot: WorkerFixedSlotByWeekday = {
    id: 1,
    weekdayKo: '월',
    startDayOfWeek: 'MONDAY',
    endDayOfWeek: 'MONDAY',
    startTime: '09:00:00',
    endTime: '18:00:00',
    recurrenceType: 'WEEKLY',
    weekOfMonth: null,
    startDate: TODAY,
    endDate: null,
  }

  it('바꾸지 않은 폼은 차이가 없다고 본다', () => {
    expect(
      slotRecurrenceDiffers(slot, form({ recurrenceType: 'MONTHLY' }))
    ).toBe(false)
  })

  it('바꾼 값이 슬롯과 다르면 차이가 있다', () => {
    expect(
      slotRecurrenceDiffers(slot, form({ endDate: '2027-01-01', dirty: true }))
    ).toBe(true)
    expect(slotRecurrenceDiffers(slot, form({ dirty: true }))).toBe(false)
  })
})
