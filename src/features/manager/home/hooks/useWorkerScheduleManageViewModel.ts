import { useMemo, useState } from 'react'

const WORKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'] as const

const DEFAULT_SELECTED_DAYS = ['수', '금']

const DEFAULT_TIME = {
  startHour: '00',
  startMinute: '00',
  endHour: '00',
  endMinute: '00',
}

export function useWorkerScheduleManageViewModel() {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DEFAULT_SELECTED_DAYS
  )

  const workTimeRangeLabel = useMemo(
    () =>
      `${DEFAULT_TIME.startHour}:${DEFAULT_TIME.startMinute} ~ ${DEFAULT_TIME.endHour}:${DEFAULT_TIME.endMinute}`,
    []
  )

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
    startHour: DEFAULT_TIME.startHour,
    startMinute: DEFAULT_TIME.startMinute,
    endHour: DEFAULT_TIME.endHour,
    endMinute: DEFAULT_TIME.endMinute,
    toggleDay,
  }
}
