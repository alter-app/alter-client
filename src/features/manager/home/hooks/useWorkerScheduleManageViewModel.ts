import { useMemo, useState } from 'react'
import {
  formatClockRangeLabel,
  splitClockToParts,
} from '@/features/home/common/schedule/lib/date'

const WORKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'] as const

type WeekdayKo = (typeof WORKDAY_OPTIONS)[number]

const DEFAULT_SELECTED_DAYS: WeekdayKo[] = ['수', '금']

/** API 연동 전: 근무자 주간 템플릿 (추후 서버 DTO로 교체) */
const MOCK_WEEKLY_SCHEDULE: Partial<
  Record<WeekdayKo, { startTime: string; endTime: string }>
> = {
  월: { startTime: '09:00', endTime: '18:00' },
  화: { startTime: '10:00', endTime: '19:00' },
  수: { startTime: '08:30', endTime: '14:00' },
  목: { startTime: '13:00', endTime: '22:00' },
  금: { startTime: '09:00', endTime: '17:00' },
  토: { startTime: '12:00', endTime: '21:00' },
  일: { startTime: '11:00', endTime: '16:00' },
}

const ZERO_DISPLAY = {
  startHour: '00',
  startMinute: '00',
  endHour: '00',
  endMinute: '00',
  workTimeRangeLabel: '00:00 ~ 00:00',
}

function primaryWeekdayAmongSelected(
  selectedDays: string[],
  order: readonly WeekdayKo[]
): WeekdayKo | null {
  for (const d of order) {
    if (selectedDays.includes(d)) return d
  }
  return null
}

function displayFromSchedule(slot: { startTime: string; endTime: string }) {
  const sh = splitClockToParts(slot.startTime)
  const eh = splitClockToParts(slot.endTime)
  return {
    startHour: sh.hour,
    startMinute: sh.minute,
    endHour: eh.hour,
    endMinute: eh.minute,
    workTimeRangeLabel: formatClockRangeLabel(slot.startTime, slot.endTime),
  }
}

export function useWorkerScheduleManageViewModel() {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DEFAULT_SELECTED_DAYS
  )

  const { startHour, startMinute, endHour, endMinute, workTimeRangeLabel } =
    useMemo(() => {
      if (selectedDays.length === 0) return ZERO_DISPLAY
      const primary = primaryWeekdayAmongSelected(selectedDays, WORKDAY_OPTIONS)
      if (!primary) return ZERO_DISPLAY
      const slot = MOCK_WEEKLY_SCHEDULE[primary]
      if (!slot) return ZERO_DISPLAY
      return displayFromSchedule(slot)
    }, [selectedDays])

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]
    )
  }

  return {
    worker: {
      name: '이름임',
      role: 'manager' as const,
    },
    workdayOptions: WORKDAY_OPTIONS,
    selectedDays,
    workTimeRangeLabel,
    startHour,
    startMinute,
    endHour,
    endMinute,
    toggleDay,
  }
}
