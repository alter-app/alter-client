import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  toDateKey,
  toTimeLabel,
} from '@/features/home/common/schedule/lib/date'
import { useWorkspaceStore } from '@/shared/stores/useWorkspaceStore'
import type { WorkerScheduleData } from '@/features/manager/worker-list/types/workerSchedule'
import type { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import type { WorkerRole } from '@/shared/types/workerRole'
import { useWorkerListSchedulesQuery } from './query/useWorkerListSchedulesQuery'

function positionToRole(position: string): WorkerRole {
  const lower = position.toLowerCase()
  if (lower === 'manager') return 'manager'
  if (lower === 'owner') return 'owner'
  return 'staff'
}

export interface WorkerListEntry {
  workerId: number
  name: string
  workspaceName: string
  nextShiftTime: string
  scheduleColor: ScheduleColor
  role: WorkerRole
}

export function useWorkerListViewModel() {
  const { activeWorkspaceId } = useWorkspaceStore()
  const [baseDate] = useState(() => new Date())

  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1

  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd')
  )

  const { data: rawData, isPending } = useWorkerListSchedulesQuery(
    activeWorkspaceId,
    year,
    month
  )

  const scheduleData = useMemo<WorkerScheduleData | null>(() => {
    if (!rawData) return null
    const result: WorkerScheduleData = {}
    rawData.data.schedules.forEach(shift => {
      const colorCode = shift.assignedWorker?.colorCode
      if (!colorCode) return
      const dateKey = toDateKey(shift.startDateTime)
      if (!result[dateKey]) result[dateKey] = []
      if (!result[dateKey].includes(colorCode)) result[dateKey].push(colorCode)
    })
    return result
  }, [rawData])

  const visibleWorkers = useMemo<WorkerListEntry[]>(() => {
    if (!rawData) return []
    const seen = new Set<number>()
    return rawData.data.schedules
      .filter(
        shift =>
          toDateKey(shift.startDateTime) === selectedDate &&
          shift.assignedWorker != null
      )
      .reduce<WorkerListEntry[]>((acc, shift) => {
        const worker = shift.assignedWorker!
        if (seen.has(worker.workerId)) return acc
        seen.add(worker.workerId)
        acc.push({
          workerId: worker.workerId,
          name: worker.workerName,
          workspaceName: shift.workspace.workspaceName,
          nextShiftTime: `${toTimeLabel(shift.startDateTime)} ~ ${toTimeLabel(shift.endDateTime)}`,
          scheduleColor: worker.colorCode as ScheduleColor,
          role: positionToRole(shift.position),
        })
        return acc
      }, [])
  }, [rawData, selectedDate])

  const handleDateClick = useCallback((dateKey: string) => {
    setSelectedDate(dateKey)
  }, [])

  return {
    baseDate,
    scheduleData,
    visibleWorkers,
    selectedDate,
    isLoading: isPending && activeWorkspaceId !== null,
    handleDateClick,
  }
}
