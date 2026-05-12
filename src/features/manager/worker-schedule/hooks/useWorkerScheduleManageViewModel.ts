import { useEffect, useMemo, useState } from 'react'
import { useWorkspaceWorkers } from './query'
import { useWorkspaceStore } from '@/shared/stores/useWorkspaceStore'
import type { StoreWorkerRole } from '@/features/manager/home/types/storeWorkerRole'
import { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import type { ScheduleColor as ScheduleColorType } from '@/features/manager/worker-schedule/types/scheduleColor'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'

export function useWorkerScheduleManageViewModel() {
  const activeWorkspaceId = useWorkspaceStore(state => state.activeWorkspaceId)
  const { data: workersResponse, isLoading } = useWorkspaceWorkers({
    workspaceId: activeWorkspaceId ?? undefined,
    status: 'ACTIVATED',
  })

  const workers = useMemo(() => {
    if (!workersResponse?.data.data) return []
    return workersResponse.data.data.map(worker => ({
      id: worker.id,
      name: worker.user.name,
      role: (worker.position.type.toLowerCase() === 'manager'
        ? 'manager'
        : 'staff') as StoreWorkerRole,
      colorCode: worker.colorCode,
    }))
  }, [workersResponse])

  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [startHour, setStartHour] = useState('')
  const [startMinute, setStartMinute] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMinute, setEndMinute] = useState('')
  const [selectedWorkerIndex, setSelectedWorkerIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<ScheduleColorType>(
    ScheduleColor.Pink
  )

  const validIndex = Math.min(
    selectedWorkerIndex,
    Math.max(0, workers.length - 1)
  )
  const selectedWorker = workers[validIndex] || {
    id: 0,
    name: '',
    role: 'staff' as const,
  }
  const selectedWorkerColorCode = selectedWorker.colorCode || undefined
  useEffect(() => {
    if (selectedWorkerColorCode) {
      const color = Object.entries(ScheduleColor).find(
        ([, value]) => value === selectedWorkerColorCode
      )
      if (color) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedColor(color[1] as ScheduleColorType)
      }
    }
  }, [selectedWorkerColorCode])

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
    isLoading,
    worker: selectedWorker,
    workers,
    selectedWorkerIndex,
    setSelectedWorkerIndex,
    selectedColor,
    setSelectedColor,
    workdayOptions: WEEKDAY_LABELS,
    selectedDays,
    toggleDay,
    workTime: {
      rangeLabel: workTimeRangeLabel,
      startHour,
      startMinute,
      endHour,
      endMinute,
      setStartHour,
      setStartMinute,
      setEndHour,
      setEndMinute,
    },
  }
}
