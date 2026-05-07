import { useMemo, useState } from 'react'

const WORKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'] as const

const DEFAULT_SELECTED_DAYS = ['수', '금']

export function useWorkerScheduleManageViewModel() {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    DEFAULT_SELECTED_DAYS
  )
  const [startHour, setStartHour] = useState('')
  const [startMinute, setStartMinute] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMinute, setEndMinute] = useState('')

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
    setStartHour,
    setStartMinute,
    setEndHour,
    setEndMinute,
    toggleDay,
  }
}
