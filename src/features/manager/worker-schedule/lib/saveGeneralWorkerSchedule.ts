import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import {
  postAssignWorkerToSchedule,
  postManagerWorkSchedule,
  putManagerWorkSchedule,
} from '@/features/manager/worker-schedule/api/managerWorkSchedule'
import { toApiLocalDateTime } from '@/features/manager/worker-schedule/lib/scheduleDateTime'
import { isApiError } from '@/shared/lib/getApiErrorInfo'

export class ScheduleAssignPendingError extends Error {
  readonly shiftId: number

  constructor(shiftId: number, cause: unknown) {
    super('근무자 배정에 실패했습니다.', { cause })
    this.name = 'ScheduleAssignPendingError'
    this.shiftId = shiftId
  }
}

export class CreatedScheduleNotFoundError extends Error {
  constructor() {
    super('생성한 근무를 찾지 못했습니다.')
    this.name = 'CreatedScheduleNotFoundError'
  }
}

/**
 * 같은 근무에 다른 배정 요청이 먼저 반영돼 배정이 거절된 경우(409 B020).
 * 배정 API의 시간 겹침은 400 B001로 따로 온다.
 */
export function isShiftAlreadyAssignedError(error: unknown): boolean {
  return isApiError(error, 409, 'B020')
}

async function assignWorker(shiftId: number, workerId: number): Promise<void> {
  try {
    await postAssignWorkerToSchedule(shiftId, { workerId })
  } catch (error) {
    throw new ScheduleAssignPendingError(shiftId, error)
  }
}

type PendingShiftState = 'assignable' | 'assignedToWorker' | 'unavailable'

/**
 * 배정 대기 근무를 월간 목록에서 찾아 지금 상태를 돌려준다.
 * - `assignable`: 미배정이고 PLANNED
 * - `assignedToWorker`: 이 근무자에게 배정됐고 삭제·취소되지 않음
 * - `unavailable`: 다른 근무자에게 배정됐거나, 삭제·취소됐거나, 미배정인데 PLANNED가 아니거나, 목록에 없음
 */
async function checkPendingShift(args: {
  workspaceId: number
  date: Date
  shiftId: number
  workerId: number
}): Promise<PendingShiftState> {
  const { workspaceId, date, shiftId, workerId } = args
  const monthly = await fetchMonthlySchedules({
    workspaceId,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  })
  const shift = monthly.data.schedules.find(s => s.shiftId === shiftId)
  if (!shift) return 'unavailable'
  if (shift.assignedWorker) {
    const isActive =
      shift.status.value !== 'DELETED' && shift.status.value !== 'CANCELLED'
    return shift.assignedWorker.workerId === workerId && isActive
      ? 'assignedToWorker'
      : 'unavailable'
  }
  return shift.status.value === 'PLANNED' ? 'assignable' : 'unavailable'
}

/**
 * 일반(날짜 지정) 근무를 저장하고 근무자를 배정한 뒤 근무 ID를 돌려준다.
 * - `shiftId`가 있으면 그 근무의 시간만 수정한다.
 * - `pendingAssignShiftId`가 있으면 새로 만들지 않고 그 근무의 시간을 고친 뒤 배정만 다시 시도한다.
 *   그 근무가 이미 이 근무자에게 배정됐으면 시간만 고치고, 다른 근무자에게 배정됐거나 사라졌으면 건드리지 않고 새로 만든다.
 * - 둘 다 없으면 근무를 만들고 배정한다.
 * @throws {ScheduleAssignPendingError} 근무는 있지만 배정이 실패한 경우. 재시도 시 `shiftId`를 `pendingAssignShiftId`로 넘긴다.
 * @throws {CreatedScheduleNotFoundError} 생성한 근무를 월간 목록에서 찾지 못한 경우
 */
export async function saveGeneralWorkerSchedule(args: {
  workspaceId: number
  workerId: number
  position: string
  shiftId: number | null
  pendingAssignShiftId: number | null
  /** 다른 근무자·날짜의 배정 대기 근무. 생성한 근무를 찾을 때 후보에서 뺀다. */
  excludeShiftIds: readonly number[]
  date: Date
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
}): Promise<number> {
  const {
    workspaceId,
    workerId,
    position,
    shiftId,
    pendingAssignShiftId,
    excludeShiftIds,
    date,
    startHour,
    startMinute,
    endHour,
    endMinute,
  } = args

  const startDateTime = toApiLocalDateTime(date, startHour, startMinute)
  let endDate = date
  const startH = Number.parseInt(startHour || '0', 10)
  const endH = Number.parseInt(endHour || '0', 10)
  const startM = Number.parseInt(startMinute || '0', 10)
  const endM = Number.parseInt(endMinute || '0', 10)
  if (endH < startH || (endH === startH && endM <= startM)) {
    endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)
  }
  const endDateTime = toApiLocalDateTime(endDate, endHour, endMinute)

  if (shiftId !== null) {
    await putManagerWorkSchedule(shiftId, {
      startDateTime,
      endDateTime,
      position,
    })
    return shiftId
  }

  if (pendingAssignShiftId !== null) {
    // 배정 대기 중에 다른 요청이 그 근무에 배정했을 수 있어, 시간을 고치기 전에 지금 상태를 확인한다.
    // FIXME(ALT-328): 확인과 PUT 사이에 다른 배정이 끼면 그 근무의 시간을 한 번 고친다. 서버가 미배정일 때만 수정하거나 수정·배정을 한 번에 처리하는 API를 주면 제거한다.
    const state = await checkPendingShift({
      workspaceId,
      date,
      shiftId: pendingAssignShiftId,
      workerId,
    })
    if (state !== 'unavailable') {
      await putManagerWorkSchedule(pendingAssignShiftId, {
        startDateTime,
        endDateTime,
        position,
      })
      if (state === 'assignable') {
        await assignWorker(pendingAssignShiftId, workerId)
      }
      return pendingAssignShiftId
    }
  }

  await postManagerWorkSchedule({
    workspaceId,
    startDateTime,
    endDateTime,
    position,
  })

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const monthly = await fetchMonthlySchedules({ workspaceId, year, month })

  // 생성 API가 ID를 돌려주지 않아 같은 시각의 미배정 근무로 찾는다.
  // 다른 근무자의 배정 대기 근무는 빼고, 후보가 여럿이면 가장 최근에 생성된(ID가 큰) 근무를 고른다.
  // 응답의 position 형식이 요청 값과 같은지 확인되지 않아 직책은 비교하지 않는다.
  const excluded = new Set(excludeShiftIds)
  const created = monthly.data.schedules
    .filter(
      s =>
        s.startDateTime === startDateTime &&
        s.endDateTime === endDateTime &&
        s.status.value === 'PLANNED' &&
        !s.assignedWorker &&
        !excluded.has(s.shiftId)
    )
    .reduce<
      (typeof monthly.data.schedules)[number] | undefined
    >((latest, s) => (!latest || s.shiftId > latest.shiftId ? s : latest), undefined)

  if (!created) {
    throw new CreatedScheduleNotFoundError()
  }

  await assignWorker(created.shiftId, workerId)
  return created.shiftId
}
