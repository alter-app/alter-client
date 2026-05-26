import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  toDateKey,
  toTimeLabel,
} from '@/features/home/common/schedule/lib/date'
import { useWorkspaceStore } from '@/shared/stores/useWorkspaceStore'
import type { WorkerScheduleData } from '@/features/manager/worker-list/types/workerSchedule'
import type { ScheduleColor } from '@/features/manager'
import type { WorkerRole } from '@/shared/types/workerRole'
import { useWorkerListSchedulesQuery } from './query/useWorkerListSchedulesQuery'
import {
  useDeleteScheduleWorker,
  useDeleteSchedule,
} from '@/features/manager/schedule/hooks/mutation'
import { managerWorkerSchedulePath } from '@/shared/constants/routes'
import type { WorkerScheduleLocationState } from '@/features/manager'

const DELETE_WORKER_ERROR_MESSAGES: Record<string, string> = {
  B020: '요청한 리소스를 찾을 수 없습니다.',
  A002: '관리중인 업장이 아닙니다.',
}

function getDeleteWorkerErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const code = (error.response?.data as { code?: string } | undefined)?.code
    if (code && DELETE_WORKER_ERROR_MESSAGES[code]) {
      return DELETE_WORKER_ERROR_MESSAGES[code]
    }
  }
  return '삭제 중 오류가 발생했습니다. 다시 시도해 주세요.'
}

function positionToRole(position: string): WorkerRole {
  const lower = position.toLowerCase()
  if (lower === 'manager') return 'manager'
  if (lower === 'owner') return 'owner'
  return 'staff'
}

export interface WorkerListEntry {
  workerId: number
  shiftId: number
  name: string
  workspaceName: string
  nextShiftTime: string
  scheduleColor: ScheduleColor
  role: WorkerRole
}

export function useWorkerListViewModel() {
  const navigate = useNavigate()
  const { activeWorkspaceId } = useWorkspaceStore()
  const workspaceId = activeWorkspaceId ?? 0
  const [baseDate] = useState(() => new Date())

  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1

  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd')
  )
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data: rawData, isPending } = useWorkerListSchedulesQuery(
    activeWorkspaceId,
    year,
    month
  )

  const { mutateAsync: deleteWorker } = useDeleteScheduleWorker(workspaceId)
  const { mutateAsync: deleteShift } = useDeleteSchedule(workspaceId)

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
          shiftId: shift.shiftId,
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

  const handleDeleteWorker = useCallback(
    async (shiftId: number) => {
      try {
        setDeleteError(null)
        await deleteWorker(shiftId)
        await deleteShift(shiftId)
      } catch (error) {
        setDeleteError(getDeleteWorkerErrorMessage(error))
      }
    },
    [deleteWorker, deleteShift]
  )

  const handleEditWorker = useCallback(
    (worker: WorkerListEntry) => {
      navigate(managerWorkerSchedulePath(workspaceId, worker.workerId), {
        state: { editDate: selectedDate } satisfies WorkerScheduleLocationState,
      })
    },
    [navigate, workspaceId, selectedDate]
  )

  return {
    baseDate,
    scheduleData,
    visibleWorkers,
    selectedDate,
    isLoading: isPending && activeWorkspaceId !== null,
    deleteError,
    handleDateClick,
    handleDeleteWorker,
    handleEditWorker,
  }
}
