import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import {
  postAssignWorkerToSchedule,
  postManagerWorkSchedule,
  putManagerWorkSchedule,
} from '@/features/manager/worker-schedule/api/managerWorkSchedule'
import { toApiLocalDateTime } from '@/features/manager/worker-schedule/lib/scheduleDateTime'

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

async function assignWorker(shiftId: number, workerId: number): Promise<void> {
  try {
    await postAssignWorkerToSchedule(shiftId, { workerId })
  } catch (error) {
    throw new ScheduleAssignPendingError(shiftId, error)
  }
}

/**
 * 일반(날짜 지정) 근무를 저장하고 근무자를 배정한 뒤 근무 ID를 돌려준다.
 * - `shiftId`가 있으면 그 근무의 시간만 수정한다.
 * - `pendingAssignShiftId`가 있으면 새로 만들지 않고 그 근무의 시간을 고친 뒤 배정만 다시 시도한다.
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
    await putManagerWorkSchedule(pendingAssignShiftId, {
      startDateTime,
      endDateTime,
      position,
    })
    await assignWorker(pendingAssignShiftId, workerId)
    return pendingAssignShiftId
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
