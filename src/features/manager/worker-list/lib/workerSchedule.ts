import { toDateKey, toTimeLabel } from '@/shared/lib/calendarUtils'
import type { ManagerScheduleApiResponse } from '@/features/manager/home/types/schedule'
import type { WorkerScheduleData } from '@/features/manager/worker-list/types/workerSchedule'
import type { ScheduleColor } from '@/features/manager'
import { resolveSchedulePickerColor } from '@/features/manager'
import type { WorkerRole } from '@/shared/types/workerRole'

export interface WorkerListEntry {
  workerId: number
  shiftId: number
  name: string
  workspaceName: string
  nextShiftTime: string
  scheduleColor: ScheduleColor
  role: WorkerRole
}

export function positionToRole(position: string): WorkerRole {
  const lower = position.toLowerCase()
  if (lower === 'manager') return 'manager'
  if (lower === 'owner') return 'owner'
  return 'staff'
}

export function buildWorkerScheduleData(
  rawData: ManagerScheduleApiResponse | undefined
): WorkerScheduleData | null {
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
}

export function getVisibleWorkers(
  rawData: ManagerScheduleApiResponse | undefined,
  selectedDate: string
): WorkerListEntry[] {
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
        shiftId: shift.shiftId,
        name: worker.workerName,
        workspaceName: shift.workspace.workspaceName,
        nextShiftTime: `${toTimeLabel(shift.startDateTime)} ~ ${toTimeLabel(shift.endDateTime)}`,
        scheduleColor: resolveSchedulePickerColor(worker.colorCode),
        role: positionToRole(shift.position),
      })
      return acc
    }, [])
}
