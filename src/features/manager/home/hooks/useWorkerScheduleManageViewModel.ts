import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { splitClockToParts } from '@/features/home/common/schedule/lib/date'
import { fetchWorkerFixedSchedules } from '@/features/manager/home/api/workerFixedSchedule'
import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import { mapFixedScheduleSlotsToByWeekdayKo } from '@/features/manager/home/lib/mapWorkerFixedScheduleSlots'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'
import { queryKeys } from '@/shared/lib/queryKeys'

const DEFAULT_SELECTED_DAYS: ManagerWeekdayKo[] = ['수', '금']

const ZERO_DISPLAY = {
  startHour: '00',
  startMinute: '00',
  endHour: '00',
  endMinute: '00',
}

function primaryWeekdayAmongSelected(
  selectedDays: string[],
  order: readonly ManagerWeekdayKo[]
): ManagerWeekdayKo | null {
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

  const {
    data: fixedScheduleApi,
    isPending: fixedScheduleLoading,
    isError: fixedScheduleError,
  } = useQuery({
    queryKey: queryKeys.managerWorkspace.workerFixedSchedule(
      workspaceId,
      workerId
    ),
    queryFn: () => fetchWorkerFixedSchedules(workspaceId, workerId),
    enabled: workspaceId > 0 && workerId > 0,
  })

  const scheduleByWeekday = useMemo(
    () => mapFixedScheduleSlotsToByWeekdayKo(fixedScheduleApi?.data ?? []),
    [fixedScheduleApi]
  )

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
    const primary = primaryWeekdayAmongSelected(
      selectedDays,
      MANAGER_WEEKDAY_KO_ORDER
    )
    if (!primary) return ZERO_DISPLAY
    const slot = scheduleByWeekday[primary]
    if (!slot) return ZERO_DISPLAY
    return displayFromSchedule(slot)
  }, [scheduleByWeekday, selectedDays])

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
    fixedScheduleLoading,
    fixedScheduleError,
    goToWorker,
    workdayOptions: MANAGER_WEEKDAY_KO_ORDER,
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
