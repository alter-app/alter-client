import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceStore } from '@/shared/stores/useWorkspaceStore'
import type { WorkerScheduleData } from '@/features/manager/worker-list/types/workerSchedule'
import {
  buildWorkerScheduleData,
  getVisibleWorkers,
} from '@/features/manager/worker-list/lib/workerSchedule'
import type { WorkerListEntry } from '@/features/manager/worker-list/lib/workerSchedule'
import { useWorkerListSchedulesQuery } from './query/useWorkerListSchedulesQuery'
import {
  useDeleteScheduleWorker,
  useDeleteSchedule,
} from '@/features/manager/schedule/hooks/mutation'
import { managerWorkerSchedulePath } from '@/shared/constants/routes'
import type { WorkerScheduleLocationState } from '@/features/manager'

export type { WorkerListEntry }

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

  const scheduleData = useMemo<WorkerScheduleData | null>(
    () => buildWorkerScheduleData(rawData),
    [rawData]
  )

  const visibleWorkers = useMemo<WorkerListEntry[]>(
    () => getVisibleWorkers(rawData, selectedDate),
    [rawData, selectedDate]
  )

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
