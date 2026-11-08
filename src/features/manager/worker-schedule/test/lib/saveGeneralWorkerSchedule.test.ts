import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import {
  postAssignWorkerToSchedule,
  postManagerWorkSchedule,
  putManagerWorkSchedule,
} from '@/features/manager/worker-schedule/api/managerWorkSchedule'

import {
  CreatedScheduleNotFoundError,
  ScheduleAssignPendingError,
  saveGeneralWorkerSchedule,
} from '../../lib/saveGeneralWorkerSchedule'

vi.mock('@/features/manager/api/schedule', () => ({
  fetchMonthlySchedules: vi.fn(),
}))
vi.mock('@/features/manager/worker-schedule/api/managerWorkSchedule', () => ({
  postManagerWorkSchedule: vi.fn(),
  putManagerWorkSchedule: vi.fn(),
  postAssignWorkerToSchedule: vi.fn(),
}))

const fetchMonthly = vi.mocked(fetchMonthlySchedules)
const postSchedule = vi.mocked(postManagerWorkSchedule)
const putSchedule = vi.mocked(putManagerWorkSchedule)
const assign = vi.mocked(postAssignWorkerToSchedule)

const conflict = {
  isAxiosError: true,
  response: { status: 400, data: { code: 'B001', message: '겹침' } },
}

function baseArgs(
  overrides: Partial<Parameters<typeof saveGeneralWorkerSchedule>[0]> = {}
) {
  return {
    workspaceId: 1,
    workerId: 7,
    position: 'STAFF',
    shiftId: null,
    pendingAssignShiftId: null,
    date: new Date(2026, 10, 20),
    startHour: '09',
    startMinute: '00',
    endHour: '18',
    endMinute: '00',
    ...overrides,
  }
}

function monthlyWith(
  schedules: {
    shiftId: number
    startDateTime: string
    endDateTime: string
    status: { value: string }
    assignedWorker: unknown
  }[]
) {
  return { data: { schedules } } as unknown as Awaited<
    ReturnType<typeof fetchMonthlySchedules>
  >
}

const createdShift = {
  shiftId: 30,
  startDateTime: '2026-11-20T09:00:00',
  endDateTime: '2026-11-20T18:00:00',
  status: { value: 'PLANNED' },
  assignedWorker: null,
}

describe('saveGeneralWorkerSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('기존 근무 수정의 B001은 그대로 던진다', async () => {
    putSchedule.mockRejectedValueOnce(conflict)

    await expect(
      saveGeneralWorkerSchedule(baseArgs({ shiftId: 10 }))
    ).rejects.toBe(conflict)
    expect(postSchedule).not.toHaveBeenCalled()
    expect(assign).not.toHaveBeenCalled()
  })

  it('생성 후 배정이 실패하면 생성된 근무 ID를 담아 던진다', async () => {
    fetchMonthly.mockResolvedValueOnce(monthlyWith([createdShift]))
    assign.mockRejectedValueOnce(conflict)

    const result = saveGeneralWorkerSchedule(baseArgs())

    await expect(result).rejects.toBeInstanceOf(ScheduleAssignPendingError)
    await expect(result).rejects.toMatchObject({
      shiftId: 30,
      cause: conflict,
    })
    expect(postSchedule).toHaveBeenCalledTimes(1)
  })

  it('생성한 근무를 찾지 못하면 성공으로 처리하지 않는다', async () => {
    fetchMonthly.mockResolvedValueOnce(monthlyWith([]))

    await expect(saveGeneralWorkerSchedule(baseArgs())).rejects.toBeInstanceOf(
      CreatedScheduleNotFoundError
    )
    expect(assign).not.toHaveBeenCalled()
  })

  it('배정 대기 근무가 있으면 새로 만들지 않고 시간을 고친 뒤 배정한다', async () => {
    await expect(
      saveGeneralWorkerSchedule(
        baseArgs({ pendingAssignShiftId: 30, startHour: '10' })
      )
    ).resolves.toBe(30)

    expect(postSchedule).not.toHaveBeenCalled()
    expect(fetchMonthly).not.toHaveBeenCalled()
    expect(putSchedule).toHaveBeenCalledWith(30, {
      startDateTime: '2026-11-20T10:00:00',
      endDateTime: '2026-11-20T18:00:00',
      position: 'STAFF',
    })
    expect(assign).toHaveBeenCalledWith(30, { workerId: 7 })
  })

  it('배정 대기 근무의 배정이 다시 실패해도 같은 근무 ID를 유지한다', async () => {
    assign.mockRejectedValueOnce(conflict)

    await expect(
      saveGeneralWorkerSchedule(baseArgs({ pendingAssignShiftId: 30 }))
    ).rejects.toMatchObject({ shiftId: 30 })
  })

  it('생성·배정이 성공하면 생성된 근무 ID를 돌려준다', async () => {
    fetchMonthly.mockResolvedValueOnce(monthlyWith([createdShift]))

    await expect(saveGeneralWorkerSchedule(baseArgs())).resolves.toBe(30)
    expect(assign).toHaveBeenCalledWith(30, { workerId: 7 })
  })

  it('종료가 시작 이하이면 다음 날 종료로 보낸다', async () => {
    await saveGeneralWorkerSchedule(
      baseArgs({ shiftId: 10, startHour: '22', endHour: '04' })
    )

    expect(putSchedule).toHaveBeenCalledWith(10, {
      startDateTime: '2026-11-20T22:00:00',
      endDateTime: '2026-11-21T04:00:00',
      position: 'STAFF',
    })
  })
})
