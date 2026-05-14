import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { splitClockToParts } from '@/features/home/common/schedule/lib/date'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'

const WORKDAY_OPTIONS = ['월', '화', '수', '목', '금', '토', '일'] as const

type WeekdayKo = (typeof WORKDAY_OPTIONS)[number]

const DEFAULT_SELECTED_DAYS: WeekdayKo[] = ['수', '금']

/** Step 5-2에서 API 응답으로 교체 예정 */
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

export function useWorkerScheduleManageViewModel(args: {
  workspaceId: number
  workerId: number
}) {
  const navigate = useNavigate()
  const { workspaceId, workerId } = args

  const { workers, isLoading: workersLoading } =
    useWorkspaceWorkersViewModel(workspaceId)

  const selectedWorkerIndex = useMemo(() => {
    const idx = workers.findIndex(w => w.id === workerId)
    return idx >= 0 ? idx : 0
  }, [workers, workerId])

  const worker = workers[selectedWorkerIndex]

  useEffect(() => {
    if (workersLoading) return
    if (workers.length === 0) {
      navigate(ROUTES.MANAGER.HOME, { replace: true })
      return
    }
    if (workers.some(w => w.id === workerId)) return
    navigate(managerWorkerSchedulePath(workspaceId, workers[0].id), {
      replace: true,
    })
  }, [navigate, workerId, workers, workersLoading, workspaceId])

  const [selectedDays, setSelectedDays] = useState<string[]>(
    DEFAULT_SELECTED_DAYS
  )
  const [startHour, setStartHour] = useState('')
  const [startMinute, setStartMinute] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMinute, setEndMinute] = useState('')

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

  function goToWorker(nextWorkerId: number) {
    navigate(managerWorkerSchedulePath(workspaceId, nextWorkerId))
  }

  return {
    worker,
    workers,
    workersLoading,
    goToWorker,
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
