import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import type { WorkerFixedScheduleSlotDto } from '@/features/manager/home/types/workerFixedSchedule'

const API_WORKING_DAY_TO_KO: Record<string, ManagerWeekdayKo | undefined> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

export type WeekdayTimeSlot = { startTime: string; endTime: string }

/**
 * 고정 근무 슬롯을 요일(한글) → 대표 시간대로 묶는다.
 * 같은 요일에 여러 슬롯이 있으면 시작 시각이 가장 이른 것을 대표로 쓴다 (UI는 단일 구간만 지원).
 */
export function mapFixedScheduleSlotsToByWeekdayKo(
  slots: WorkerFixedScheduleSlotDto[]
): Partial<Record<ManagerWeekdayKo, WeekdayTimeSlot>> {
  const buckets = new Map<ManagerWeekdayKo, WorkerFixedScheduleSlotDto[]>()

  for (const slot of slots) {
    const ko = API_WORKING_DAY_TO_KO[slot.workingDay]
    if (!ko) continue
    const list = buckets.get(ko) ?? []
    list.push(slot)
    buckets.set(ko, list)
  }

  const result: Partial<Record<ManagerWeekdayKo, WeekdayTimeSlot>> = {}

  for (const ko of MANAGER_WEEKDAY_KO_ORDER) {
    const list = buckets.get(ko)
    if (!list?.length) continue
    const sorted = [...list].sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    )
    const first = sorted[0]
    result[ko] = { startTime: first.startTime, endTime: first.endTime }
  }

  return result
}
