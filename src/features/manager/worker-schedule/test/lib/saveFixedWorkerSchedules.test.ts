import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  deleteFixedWorkerSchdule,
  patchFixedWorkerSchdule,
  postFixedWorkerSchdules,
} from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'

import type { WorkerFixedSlotByWeekday } from '../../lib/fixedScheduleForWorker'
import {
  defaultRecurrenceForm,
  type FixedScheduleRecurrenceForm,
} from '../../lib/fixedScheduleRecurrence'
import {
  ENDED_RECURRENCE_PERIOD_MESSAGE,
  MULTI_SLOT_RECURRENCE_CHANGE_MESSAGE,
  saveFixedWorkerSchedules,
} from '../../lib/saveFixedWorkerSchedules'

vi.mock('@/features/manager/worker-schedule/api/fixedWorkerSchdule', () => ({
  deleteFixedWorkerSchdule: vi.fn(),
  patchFixedWorkerSchdule: vi.fn(),
  postFixedWorkerSchdules: vi.fn(),
}))

const remove = vi.mocked(deleteFixedWorkerSchdule)
const patch = vi.mocked(patchFixedWorkerSchdule)
const post = vi.mocked(postFixedWorkerSchdules)

const TODAY = '2026-11-08'

const mondaySlot: WorkerFixedSlotByWeekday = {
  id: 11,
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

function form(
  overrides: Partial<FixedScheduleRecurrenceForm> = {}
): FixedScheduleRecurrenceForm {
  return { ...defaultRecurrenceForm(TODAY), ...overrides }
}

function save(
  args: Partial<Parameters<typeof saveFixedWorkerSchedules>[0]> = {}
) {
  return saveFixedWorkerSchedules({
    workspaceId: 1,
    workspaceWorkerId: 7,
    loadedSlots: [mondaySlot],
    selectedDays: ['월'],
    startHour: '09',
    startMinute: '00',
    endHour: '18',
    endMinute: '00',
    recurrence: form(),
    today: TODAY,
    ...args,
  })
}

describe('saveFixedWorkerSchedules', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('요일·시간·반복이 그대로면 요청하지 않는다', async () => {
    await save()

    expect(patch).not.toHaveBeenCalled()
    expect(post).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
  })

  it('반복·기간만 바꿔도 기존 슬롯을 수정한다', async () => {
    await save({
      recurrence: form({
        recurrenceType: 'MONTHLY',
        weekOfMonth: 2,
        endDate: '2027-03-31',
        dirty: true,
      }),
    })

    expect(patch).toHaveBeenCalledWith(1, 11, {
      startDayOfWeek: 'MONDAY',
      startTime: '09:00:00',
      endDayOfWeek: 'MONDAY',
      endTime: '18:00:00',
      recurrenceType: 'MONTHLY',
      weekOfMonth: 2,
      startDate: TODAY,
      endDate: '2027-03-31',
    })
  })

  it('시간만 바꾸면 반복·기간 필드 없이 수정해 기존 값을 보존한다', async () => {
    await save({ endHour: '20' })

    expect(patch).toHaveBeenCalledWith(1, 11, {
      startDayOfWeek: 'MONDAY',
      startTime: '09:00:00',
      endDayOfWeek: 'MONDAY',
      endTime: '20:00:00',
    })
  })

  it('새 요일은 반복·기간을 담아 등록하고 빠진 요일은 삭제한다', async () => {
    await save({
      selectedDays: ['화'],
      recurrence: form({ endDate: '2026-12-31' }),
    })

    expect(remove).toHaveBeenCalledWith(1, 11)
    expect(post).toHaveBeenCalledWith(1, {
      workspaceWorkerId: 7,
      schedules: [
        {
          startDayOfWeek: 'TUESDAY',
          startTime: '09:00:00',
          endDayOfWeek: 'TUESDAY',
          endTime: '18:00:00',
          recurrenceType: 'WEEKLY',
          weekOfMonth: null,
          startDate: TODAY,
          endDate: '2026-12-31',
        },
      ],
    })
  })

  it('기존 무기한 매주 규칙을 그대로 두고 요일을 추가하면 반복 필드를 생략한다', async () => {
    await save({
      loadedSlots: [{ ...mondaySlot, startDate: null }],
      selectedDays: ['월', '수'],
      recurrence: form({ startDate: null }),
    })

    expect(patch).not.toHaveBeenCalled()
    expect(post).toHaveBeenCalledWith(1, {
      workspaceWorkerId: 7,
      schedules: [
        {
          startDayOfWeek: 'WEDNESDAY',
          startTime: '09:00:00',
          endDayOfWeek: 'WEDNESDAY',
          endTime: '18:00:00',
        },
      ],
    })
  })

  it('같은 요일의 슬롯이 여럿이면 모두 수정하고 각자의 반복·기간은 보존한다', async () => {
    const firstWeek = {
      ...mondaySlot,
      id: 11,
      recurrenceType: 'MONTHLY' as const,
      weekOfMonth: 1,
    }
    const thirdWeek = {
      ...mondaySlot,
      id: 12,
      recurrenceType: 'MONTHLY' as const,
      weekOfMonth: 3,
    }

    await save({ loadedSlots: [firstWeek, thirdWeek], endHour: '20' })

    const timeOnly = {
      startDayOfWeek: 'MONDAY',
      startTime: '09:00:00',
      endDayOfWeek: 'MONDAY',
      endTime: '20:00:00',
    }
    expect(patch).toHaveBeenCalledTimes(2)
    expect(patch).toHaveBeenCalledWith(1, 11, timeOnly)
    expect(patch).toHaveBeenCalledWith(1, 12, timeOnly)
    expect(post).not.toHaveBeenCalled()
  })

  it('같은 요일의 슬롯이 여럿인데 반복·기간을 바꾸면 요청 없이 막는다', async () => {
    await expect(
      save({
        loadedSlots: [mondaySlot, { ...mondaySlot, id: 12 }],
        recurrence: form({
          recurrenceType: 'MONTHLY',
          weekOfMonth: 2,
          dirty: true,
        }),
      })
    ).rejects.toThrow(MULTI_SLOT_RECURRENCE_CHANGE_MESSAGE)
    expect(patch).not.toHaveBeenCalled()
    expect(post).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
  })

  it('여러 슬롯이 있는 요일을 선택에서 빼면 반복·기간을 바꿔도 저장한다', async () => {
    await save({
      loadedSlots: [mondaySlot, { ...mondaySlot, id: 12 }],
      selectedDays: ['화'],
      recurrence: form({ endDate: '2026-12-31', dirty: true }),
    })

    expect(remove).toHaveBeenCalledTimes(2)
    expect(post).toHaveBeenCalledTimes(1)
  })

  it('같은 요일의 슬롯을 모두 빼면 모두 삭제한다', async () => {
    await save({
      loadedSlots: [mondaySlot, { ...mondaySlot, id: 12 }],
      selectedDays: ['화'],
    })

    expect(remove).toHaveBeenCalledWith(1, 11)
    expect(remove).toHaveBeenCalledWith(1, 12)
  })

  describe('적용 기간이 이미 끝난 경우', () => {
    const endedSlot = {
      ...mondaySlot,
      startDate: '2026-09-01',
      endDate: '2026-10-31',
    }
    const endedForm = form({ startDate: '2026-09-01', endDate: '2026-10-31' })

    it('바꾸지 않은 끝난 기간으로 새 요일을 등록하려 하면 요청 없이 막는다', async () => {
      await expect(
        save({
          loadedSlots: [endedSlot],
          selectedDays: ['월', '수'],
          recurrence: endedForm,
        })
      ).rejects.toThrow(ENDED_RECURRENCE_PERIOD_MESSAGE)
      expect(post).not.toHaveBeenCalled()
      expect(patch).not.toHaveBeenCalled()
    })

    it('기간을 끝난 날짜로 바꿔 저장하려 하면 막는다', async () => {
      await expect(
        save({ recurrence: form({ endDate: '2026-11-07', dirty: true }) })
      ).rejects.toThrow(ENDED_RECURRENCE_PERIOD_MESSAGE)
      expect(patch).not.toHaveBeenCalled()
    })

    it('끝난 근무의 요일을 빼는 삭제는 허용한다', async () => {
      await save({
        loadedSlots: [
          endedSlot,
          {
            ...endedSlot,
            id: 12,
            weekdayKo: '화',
            startDayOfWeek: 'TUESDAY',
            endDayOfWeek: 'TUESDAY',
          },
        ],
        selectedDays: ['월'],
        recurrence: endedForm,
      })

      expect(remove).toHaveBeenCalledWith(1, 12)
    })

    it('기간을 건드리지 않은 시간 수정은 허용한다', async () => {
      await save({
        loadedSlots: [endedSlot],
        endHour: '20',
        recurrence: endedForm,
      })

      expect(patch).toHaveBeenCalledWith(1, 11, {
        startDayOfWeek: 'MONDAY',
        startTime: '09:00:00',
        endDayOfWeek: 'MONDAY',
        endTime: '20:00:00',
      })
    })

    it('종료일이 오늘이면 끝나지 않은 기간으로 본다', async () => {
      await save({
        selectedDays: ['월', '수'],
        recurrence: form({ endDate: TODAY }),
      })

      expect(post).toHaveBeenCalledTimes(1)
    })
  })

  it('종료가 시작 이하인 야간 근무는 다음 요일에 끝난다', async () => {
    await save({
      loadedSlots: [],
      selectedDays: ['일'],
      startHour: '22',
      endHour: '04',
    })

    expect(post).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        schedules: [
          expect.objectContaining({
            startDayOfWeek: 'SUNDAY',
            endDayOfWeek: 'MONDAY',
          }),
        ],
      })
    )
  })

  it('수정·삭제가 실패하면 등록하지 않고 오류를 던진다', async () => {
    const conflict = {
      isAxiosError: true,
      response: { status: 409, data: { code: 'B020' } },
    }
    patch.mockRejectedValueOnce(conflict)

    await expect(
      save({ selectedDays: ['월', '화'], endHour: '20' })
    ).rejects.toBe(conflict)
    expect(post).not.toHaveBeenCalled()
  })
})
