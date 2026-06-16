import { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useWorkerListSchedulesQuery } from '@/features/manager/worker-list/hooks/query/useWorkerListSchedulesQuery'
import {
  buildWorkerScheduleData,
  getVisibleWorkers,
} from '@/features/manager/worker-list/lib/workerSchedule'
import {
  formatEstimatedEarningsText,
  formatTotalWorkHoursText,
} from '@/features/home/common/schedule/lib/summaryFormat'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

export function useWorkerScheduleCalendarViewModel(workspaceId: number | null) {
  const [baseDate, setBaseDate] = useState(() => new Date())
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    format(new Date(), DATE_KEY_FORMAT)
  )
  const [modalDateKey, setModalDateKey] = useState<string | null>(null)

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
    handleDateClick,
    closeModal,
  }
}
