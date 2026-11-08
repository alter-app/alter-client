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
import { saveFixedWorkerSchedules } from '../../lib/saveFixedWorkerSchedules'

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
