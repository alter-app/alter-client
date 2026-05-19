import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import type { FixedWorkerScheduleDto } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'
import {
  nextWeekdayKoToApi,
  sortWeekdaysKo,
  weekdayApiToKo,
  weekdayKoToApi,
} from '@/features/manager/worker-schedule/lib/weekdayMapping'
import {
  fromApiLocalTime,
  toApiLocalTime,
} from '@/features/manager/worker-schedule/lib/scheduleDateTime'
import type { FixedWorkerScheduleSlotInput } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'

export type WorkerFixedSlotByWeekday = {
  id: number
  weekdayKo: ManagerWeekdayKo
  startDayOfWeek: FixedWorkerScheduleDto['startDayOfWeek']
  endDayOfWeek: FixedWorkerScheduleDto['endDayOfWeek']
  startTime: string
  endTime: string
}

export function listFixedSchedulesForWorker(
  all: FixedWorkerScheduleDto[],
  workspaceWorkerId: number
): WorkerFixedSlotByWeekday[] {
  return all
    .filter(
      s => s.workspaceWorkerId === workspaceWorkerId && s.status === 'ACTIVATED'
    )
    .map(s => {
      const weekdayKo = weekdayApiToKo(s.startDayOfWeek)
      if (!weekdayKo) return null
      return {
        id: s.id,
        weekdayKo,
        startDayOfWeek: s.startDayOfWeek,
        endDayOfWeek: s.endDayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }
    })
    .filter((s): s is WorkerFixedSlotByWeekday => s !== null)
}

export function primaryWeekdayAmongSelected(
  selectedDays: ManagerWeekdayKo[]
): ManagerWeekdayKo | null {
  for (const d of MANAGER_WEEKDAY_KO_ORDER) {
    if (selectedDays.includes(d)) return d
  }
  return null
}

export function displayTimesFromSlots(
  slots: WorkerFixedSlotByWeekday[],
  selectedDays: ManagerWeekdayKo[]
): {
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
} {
  const primary = primaryWeekdayAmongSelected(selectedDays)
  if (!primary) {
    return {
      startHour: '00',
      startMinute: '00',
      endHour: '00',
      endMinute: '00',
    }
  }
  const slot = slots.find(s => s.weekdayKo === primary)
  if (!slot) {
    return {
      startHour: '00',
      startMinute: '00',
      endHour: '00',
      endMinute: '00',
    }
  }
  const start = fromApiLocalTime(slot.startTime)
  const end = fromApiLocalTime(slot.endTime)
  return {
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
  }
}

export function buildSlotInputForWeekday(
  weekdayKo: ManagerWeekdayKo,
  startHour: string,
  startMinute: string,
  endHour: string,
  endMinute: string
): FixedWorkerScheduleSlotInput {
  const startDayOfWeek = weekdayKoToApi(weekdayKo)
  const startTime = toApiLocalTime(startHour, startMinute)
  const endTime = toApiLocalTime(endHour, endMinute)
  const endDayOfWeek =
    endTime <= startTime ? nextWeekdayKoToApi(weekdayKo) : startDayOfWeek

  return {
    startDayOfWeek,
    startTime,
    endDayOfWeek,
    endTime,
  }
}

export function selectedDaysFromSlots(
  slots: WorkerFixedSlotByWeekday[]
): ManagerWeekdayKo[] {
  return sortWeekdaysKo(slots.map(s => s.weekdayKo))
}
