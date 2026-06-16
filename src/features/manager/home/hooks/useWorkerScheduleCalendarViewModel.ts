import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useWorkerListSchedulesQuery } from '@/features/manager/worker-list/hooks/query/useWorkerListSchedulesQuery'
import {
  buildWorkerScheduleData,
  getVisibleWorkers,
} from '@/features/manager/worker-list/lib/workerSchedule'
import type { WorkerListEntry } from '@/features/manager/worker-list/lib/workerSchedule'
import {
  formatEstimatedEarningsText,
  formatTotalWorkHoursText,
} from '@/features/home/common/schedule/lib/summaryFormat'
import {
  useDeleteScheduleWorker,
  useDeleteSchedule,
} from '@/features/manager/schedule/hooks/mutation'
import { managerWorkerSchedulePath } from '@/shared/constants/routes'
import type { WorkerScheduleLocationState } from '@/features/manager'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

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

export function useWorkerScheduleCalendarViewModel(workspaceId: number | null) {
  const [baseDate, setBaseDate] = useState(() => new Date())
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    format(new Date(), DATE_KEY_FORMAT)
  )
  const [modalDateKey, setModalDateKey] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { mutateAsync: deleteWorker } = useDeleteScheduleWorker(
    workspaceId ?? 0
  )
  const { mutateAsync: deleteShift } = useDeleteSchedule(workspaceId ?? 0)

  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1

  const { data: rawData, isPending } = useWorkerListSchedulesQuery(
    workspaceId,
    year,
    month
  )

  const scheduleData = useMemo(
    () => buildWorkerScheduleData(rawData),
    [rawData]
  )

  const totalWorkHoursText = useMemo(
    () => formatTotalWorkHoursText(rawData?.data.totalWorkHours),
    [rawData]
  )

  const estimatedEarningsText = useMemo(
    () => formatEstimatedEarningsText(rawData?.data.estimatedLaborCost),
    [rawData]
  )

  const visibleWorkers = useMemo(
    () => (modalDateKey ? getVisibleWorkers(rawData, modalDateKey) : []),
    [rawData, modalDateKey]
  )

  const onMonthChange = useCallback((date: Date) => setBaseDate(date), [])

  const handleDateClick = useCallback((dateKey: string) => {
    setSelectedDateKey(dateKey)
    setModalDateKey(dateKey)
  }, [])

  const closeModal = useCallback(() => setModalDateKey(null), [])

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
      navigate(managerWorkerSchedulePath(workspaceId ?? 0, worker.workerId), {
        state: {
          editDate: modalDateKey ?? selectedDateKey,
        } satisfies WorkerScheduleLocationState,
      })
    },
    [navigate, workspaceId, modalDateKey, selectedDateKey]
  )

  return {
    baseDate,
    scheduleData,
    totalWorkHoursText,
    estimatedEarningsText,
    selectedDateKey,
    isLoading: isPending && workspaceId !== null,
    onMonthChange,
    isModalOpen: modalDateKey !== null,
    modalDateKey,
    visibleWorkers,
    deleteError,
    handleDateClick,
    closeModal,
    handleDeleteWorker,
    handleEditWorker,
  }
}
