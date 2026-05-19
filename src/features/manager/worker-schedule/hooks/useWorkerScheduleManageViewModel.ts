import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchMonthlySchedules } from '@/features/manager/api/schedule'
import { patchWorkspaceWorkerColor } from '@/features/manager/api/worker'
import { getFixedWorkerSchdules } from '@/features/manager/worker-schedule/api/fixedWorkerSchdule'
import type { ScheduleTab } from '@/features/manager/schedule/types/workerSchedule'
import { useWorkspaceWorkersViewModel } from '@/features/manager/home/hooks/useWorkspaceWorkersViewModel'
import type { ManagerWeekdayKo } from '@/features/manager/home/constants/managerWeekdayKo'
import { MANAGER_WEEKDAY_KO_ORDER } from '@/features/manager/home/constants/managerWeekdayKo'
import {
  displayTimesFromSlots,
  listFixedSchedulesForWorker,
  selectedDaysFromSlots,
  type WorkerFixedSlotByWeekday,
} from '@/features/manager/worker-schedule/lib/fixedScheduleForWorker'
import { invalidateManagerScheduleQueries } from '@/features/manager/worker-schedule/lib/invalidateScheduleQueries'
import { saveFixedWorkerSchedules } from '@/features/manager/worker-schedule/lib/saveFixedWorkerSchedules'
import { saveGeneralWorkerSchedule } from '@/features/manager/worker-schedule/lib/saveGeneralWorkerSchedule'
import { dateTimeToHourMinute } from '@/features/manager/worker-schedule/lib/scheduleDateTime'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { toDateKey } from '@/features/home/common/schedule/lib/date'
import type { ManagerScheduleShiftDto } from '@/features/manager/home/types/schedule'
import type { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import {
  colorCodesEqual,
  isValidWorkerColorCode,
  normalizeColorCodeForApi,
  resolveSchedulePickerColor,
} from '@/features/manager/worker-schedule/types/workerColor'

const DEFAULT_SELECTED_DAYS: ManagerWeekdayKo[] = ['수', '금']

function findWorkerShiftOnDate(
  schedules: ManagerScheduleShiftDto[],
  workerId: number,
  date: Date
): ManagerScheduleShiftDto | null {
  const dateKey = format(date, 'yyyy-MM-dd')
  return (
    schedules.find(
      s =>
        toDateKey(s.startDateTime) === dateKey &&
        s.assignedWorker?.workerId === workerId &&
        s.status.value !== 'DELETED' &&
        s.status.value !== 'CANCELLED'
    ) ?? null
  )
}

export function useWorkerScheduleManageViewModel(args: {
  workspaceId: number
  workerId: number
  activeTab: ScheduleTab
  generalSelectedDate: Date | null
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { workspaceId, workerId, activeTab, generalSelectedDate } = args

  const { workers, isLoading: workersLoading } =
    useWorkspaceWorkersViewModel(workspaceId)

  const selectedWorkerIndex = useMemo(() => {
    const idx = workers.findIndex(w => w.id === workerId)
    return idx >= 0 ? idx : 0
  }, [workers, workerId])

  const worker = workers[selectedWorkerIndex]

  const {
    data: fixedScheduleResponse,
    isPending: fixedScheduleLoading,
    isError: fixedScheduleError,
  } = useQuery({
    queryKey: queryKeys.fixedWorkerSchedule.list(workspaceId),
    queryFn: () => getFixedWorkerSchdules(workspaceId),
    enabled: workspaceId > 0,
  })

  const generalYear =
    generalSelectedDate?.getFullYear() ?? new Date().getFullYear()
  const generalMonth =
    (generalSelectedDate?.getMonth() ?? new Date().getMonth()) + 1

  const { data: monthlyScheduleResponse, isPending: monthlyScheduleLoading } =
    useQuery({
      queryKey: queryKeys.manager.schedules(
        workspaceId,
        generalYear,
        generalMonth
      ),
      queryFn: () =>
        fetchMonthlySchedules({
          workspaceId,
          year: generalYear,
          month: generalMonth,
        }),
      enabled:
        workspaceId > 0 && activeTab === '일반' && generalSelectedDate !== null,
    })

  const loadedFixedSlots = useMemo((): WorkerFixedSlotByWeekday[] => {
    const list = fixedScheduleResponse?.data ?? []
    return listFixedSchedulesForWorker(list, workerId)
  }, [fixedScheduleResponse, workerId])

  const [selectedDays, setSelectedDays] = useState<ManagerWeekdayKo[]>(
    DEFAULT_SELECTED_DAYS
  )
  const [startHour, setStartHour] = useState('')
  const [startMinute, setStartMinute] = useState('')
  const [endHour, setEndHour] = useState('')
  const [endMinute, setEndMinute] = useState('')
  const [generalShiftId, setGeneralShiftId] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<ScheduleColor>(
    resolveSchedulePickerColor('')
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  const [syncedWorkerId, setSyncedWorkerId] = useState<number | null>(null)
  const [syncedColorWorkerId, setSyncedColorWorkerId] = useState<number | null>(
    null
  )
  const [syncedFixedKey, setSyncedFixedKey] = useState<string | null>(null)
  const [syncedGeneralKey, setSyncedGeneralKey] = useState<string | null>(null)

  if (worker && !workersLoading && syncedColorWorkerId !== worker.id) {
    setSyncedColorWorkerId(worker.id)
    setSelectedColor(resolveSchedulePickerColor(worker.colorCode))
  }

  const fixedDataKey = `${workerId}:${loadedFixedSlots.map(s => s.id).join(',')}`
  if (
    !fixedScheduleLoading &&
    (syncedWorkerId !== workerId || syncedFixedKey !== fixedDataKey)
  ) {
    setSyncedWorkerId(workerId)
    setSyncedFixedKey(fixedDataKey)
    const days =
      loadedFixedSlots.length > 0
        ? selectedDaysFromSlots(loadedFixedSlots)
        : DEFAULT_SELECTED_DAYS
    setSelectedDays(days)
    const times = displayTimesFromSlots(loadedFixedSlots, days)
    setStartHour(times.startHour)
    setStartMinute(times.startMinute)
    setEndHour(times.endHour)
    setEndMinute(times.endMinute)
  }

  const generalDataKey = useMemo(() => {
    if (!generalSelectedDate) return null
    const shift = findWorkerShiftOnDate(
      monthlyScheduleResponse?.data.schedules ?? [],
      workerId,
      generalSelectedDate
    )
    return `${workerId}:${format(generalSelectedDate, 'yyyy-MM-dd')}:${shift?.shiftId ?? 'none'}`
  }, [generalSelectedDate, monthlyScheduleResponse, workerId])

  if (
    activeTab === '일반' &&
    generalSelectedDate &&
    !monthlyScheduleLoading &&
    generalDataKey !== null &&
    syncedGeneralKey !== generalDataKey
  ) {
    setSyncedGeneralKey(generalDataKey)
    const shift = findWorkerShiftOnDate(
      monthlyScheduleResponse?.data.schedules ?? [],
      workerId,
      generalSelectedDate
    )
    if (shift) {
      setGeneralShiftId(shift.shiftId)
      const start = dateTimeToHourMinute(shift.startDateTime)
      const end = dateTimeToHourMinute(shift.endDateTime)
      setStartHour(start.hour)
      setStartMinute(start.minute)
      setEndHour(end.hour)
      setEndMinute(end.minute)
    } else {
      setGeneralShiftId(null)
      const times = displayTimesFromSlots(loadedFixedSlots, selectedDays)
      setStartHour(times.startHour)
      setStartMinute(times.startMinute)
      setEndHour(times.endHour)
      setEndMinute(times.endMinute)
    }
  }

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

  const workTimeRangeLabel = useMemo(() => {
    const sh = startHour || '00'
    const sm = startMinute || '00'
    const eh = endHour || '00'
    const em = endMinute || '00'
    return `${sh}:${sm} ~ ${eh}:${em}`
  }, [startHour, startMinute, endHour, endMinute])

  function toggleDay(day: string) {
    setSelectedDays(prev => {
      const ko = day as ManagerWeekdayKo
      return prev.includes(ko)
        ? prev.filter(item => item !== ko)
        : [...prev, ko]
    })
  }

  function goToWorker(nextWorkerId: number) {
    setSyncedFixedKey(null)
    setSyncedGeneralKey(null)
    setSyncedColorWorkerId(null)
    navigate(managerWorkerSchedulePath(workspaceId, nextWorkerId))
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      setSaveError(null)
      if (!worker) throw new Error('근무자 정보를 불러오지 못했습니다.')

      if (activeTab === '고정') {
        if (selectedDays.length === 0) {
          throw new Error('최소 한 개의 요일을 선택해 주세요.')
        }
        await saveFixedWorkerSchedules({
          workspaceId,
          workspaceWorkerId: workerId,
          loadedSlots: loadedFixedSlots,
          selectedDays,
          startHour,
          startMinute,
          endHour,
          endMinute,
        })
      } else {
        if (!generalSelectedDate) {
          throw new Error('날짜를 선택해 주세요.')
        }

        const shiftId = await saveGeneralWorkerSchedule({
          workspaceId,
          workerId,
          position: worker.position,
          shiftId: generalShiftId,
          date: generalSelectedDate,
          startHour,
          startMinute,
          endHour,
          endMinute,
        })
        if (shiftId !== null) {
          setGeneralShiftId(shiftId)
        }
      }

      const nextColorCode = normalizeColorCodeForApi(selectedColor)
      if (!isValidWorkerColorCode(nextColorCode)) {
        throw new Error('올바른 색상 형식이 아닙니다.')
      }
      if (!colorCodesEqual(nextColorCode, worker.colorCode)) {
        await patchWorkspaceWorkerColor(workspaceId, workerId, {
          colorCode: nextColorCode,
        })
      }
    },
    onSuccess: () => {
      const year =
        generalSelectedDate?.getFullYear() ?? new Date().getFullYear()
      const month =
        (generalSelectedDate?.getMonth() ?? new Date().getMonth()) + 1
      invalidateManagerScheduleQueries(queryClient, workspaceId, year, month)
      void queryClient.invalidateQueries({
        queryKey: ['managerWorkspace', 'workers', workspaceId],
      })
      setSyncedFixedKey(null)
      setSyncedGeneralKey(null)
      setSyncedColorWorkerId(null)
    },
    onError: (error: unknown) => {
      setSaveError(getAxiosErrorMessage(error, '저장에 실패했습니다.'))
    },
  })

  const handleSave = useCallback(() => {
    saveMutation.mutate()
  }, [saveMutation])

  return {
    workersLoading,
    worker,
    workers,
    fixedScheduleLoading,
    fixedScheduleError,
    monthlyScheduleLoading,
    goToWorker,
    workdayOptions: MANAGER_WEEKDAY_KO_ORDER,
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
    handleSave,
    isSaving: saveMutation.isPending,
    saveError,
    selectedColor,
    setSelectedColor,
  }
}
