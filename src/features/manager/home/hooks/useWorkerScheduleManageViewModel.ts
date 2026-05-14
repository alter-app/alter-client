import { useMemo, useState } from 'react'
import { splitClockToParts } from '@/features/home/common/schedule/lib/date'

const WORKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'] as const

type WeekdayKo = (typeof WORKDAY_OPTIONS)[number]

const DEFAULT_SELECTED_DAYS: WeekdayKo[] = ['수', '금']

const MOCK_WORKERS = [
  { name: '이름임', role: 'manager' as const },
  { name: '김민준', role: 'staff' as const },
  { name: '박지은', role: 'staff' as const },
  { name: '이수호', role: 'staff' as const },
  { name: '정하나', role: 'manager' as const },
]

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
  }
}

export function useWorkerScheduleManageViewModel() {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DEFAULT_SELECTED_DAYS
  )
  const [startHour, setStartHour] = useState('')
  const [startMinute, setStartMinute] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMinute, setEndMinute] = useState('')
  const [selectedWorkerIndex, setSelectedWorkerIndex] = useState(0)

  const templateTimes = useMemo(() => {
    if (selectedDays.length === 0) return ZERO_DISPLAY
    const primary = primaryWeekdayAmongSelected(selectedDays, WORKDAY_OPTIONS)
    if (!primary) return ZERO_DISPLAY
    const slot = MOCK_WEEKLY_SCHEDULE[primary]
    if (!slot) return ZERO_DISPLAY
    return displayFromSchedule(slot)
  }, [selectedDays])

  const templateKey = `${templateTimes.startHour}:${templateTimes.startMinute}:${templateTimes.endHour}:${templateTimes.endMinute}`
  const [syncedTemplateKey, setSyncedTemplateKey] = useState<string | null>(
    null
  )
  if (syncedTemplateKey !== templateKey) {
    setSyncedTemplateKey(templateKey)
    setStartHour(templateTimes.startHour)
    setStartMinute(templateTimes.startMinute)
    setEndHour(templateTimes.endHour)
    setEndMinute(templateTimes.endMinute)
  }

  const workTimeRangeLabel = useMemo(() => {
    const sh = startHour || '00'
    const sm = startMinute || '00'
    const eh = endHour || '00'
    const em = endMinute || '00'
    return `${sh}:${sm} ~ ${eh}:${em}`
  }, [startHour, startMinute, endHour, endMinute])

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(item => item !== day) : [...prev, day]
    )
  }

  return {
    worker: MOCK_WORKERS[selectedWorkerIndex],
    workers: MOCK_WORKERS,
    selectedWorkerIndex,
    setSelectedWorkerIndex,
    workdayOptions: WORKDAY_OPTIONS,
    selectedDays,
    workTimeRangeLabel,
    startHour,
    startMinute,
    endHour,
    endMinute,
    setStartHour,
    setStartMinute,
    setEndHour,
    setEndMinute,
    toggleDay,
  }
}
