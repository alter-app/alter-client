import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import type { ManagerFixedScheduleWorkingDay } from '@/features/manager/home/types/workerFixedSchedule'

const API_DAY_TO_KO: Record<ManagerFixedScheduleWorkingDay, ManagerWeekdayKo> =
  {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일',
  }

const KO_TO_API: Record<ManagerWeekdayKo, ManagerFixedScheduleWorkingDay> = {
  월: 'MONDAY',
  화: 'TUESDAY',
  수: 'WEDNESDAY',
  목: 'THURSDAY',
  금: 'FRIDAY',
  토: 'SATURDAY',
  일: 'SUNDAY',
}

export function weekdayKoToApi(
  ko: ManagerWeekdayKo
): ManagerFixedScheduleWorkingDay {
  return KO_TO_API[ko]
}

export function weekdayApiToKo(
  day: ManagerFixedScheduleWorkingDay
): ManagerWeekdayKo | null {
  return API_DAY_TO_KO[day] ?? null
}

export function sortWeekdaysKo(days: ManagerWeekdayKo[]): ManagerWeekdayKo[] {
  const set = new Set(days)
  return MANAGER_WEEKDAY_KO_ORDER.filter(d => set.has(d))
}
