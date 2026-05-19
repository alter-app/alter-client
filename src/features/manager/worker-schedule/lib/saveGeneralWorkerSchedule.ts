import { format } from 'date-fns'
import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import {
  postAssignWorkerToSchedule,
  postManagerWorkSchedule,
  putManagerWorkSchedule,
} from '@/features/manager/worker-schedule/api/managerWorkSchedule'
import { toApiLocalDateTime } from '@/features/manager/worker-schedule/lib/scheduleDateTime'

export async function saveGeneralWorkerSchedule(args: {
  workspaceId: number
  workerId: number
  position: string
  shiftId: number | null
  date: Date
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
}): Promise<number | null> {
  const {
    workspaceId,
    workerId,
    position,
    shiftId,
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

  await postManagerWorkSchedule({
    workspaceId,
    startDateTime,
    endDateTime,
    position,
  })

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const monthly = await fetchMonthlySchedules({ workspaceId, year, month })
  const dateKey = format(date, 'yyyy-MM-dd')

  const created = monthly.data.schedules.find(
    s =>
      s.startDateTime === startDateTime &&
      s.endDateTime === endDateTime &&
      s.status.value === 'PLANNED'
  )

  if (!created) {
    const sameDay = monthly.data.schedules.find(
      s =>
        s.startDateTime.startsWith(dateKey) &&
        s.status.value === 'PLANNED' &&
        !s.assignedWorker
    )
    if (sameDay) {
      await postAssignWorkerToSchedule(sameDay.shiftId, { workerId })
      return sameDay.shiftId
    }
    return null
  }

  await postAssignWorkerToSchedule(created.shiftId, { workerId })
  return created.shiftId
}
