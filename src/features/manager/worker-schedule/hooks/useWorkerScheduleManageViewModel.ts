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
import {
  recurrenceFormFromSlots,
  validateRecurrenceForm,
  type FixedScheduleRecurrenceForm,
} from '@/features/manager/worker-schedule/lib/fixedScheduleRecurrence'
import type { FixedScheduleRecurrenceType } from '@/features/manager/worker-schedule/types/fixedWorkerSchdules'
import { saveGeneralWorkerSchedule } from '@/features/manager/worker-schedule/lib/saveGeneralWorkerSchedule'
import {
  pendingAfterGeneralSaveError,
  pendingAfterGeneralSaveSuccess,
  pendingAssignKey,
  pendingAssignShiftIdFor,
  type PendingAssignShifts,
} from '@/features/manager/worker-schedule/lib/pendingAssignShifts'
import {
  patchWorkerForm,
  selectWorkerForm,
  type WorkerFormOverride,
} from '@/features/manager/worker-schedule/lib/workerFormOverride'
import {
  resolveFixedScheduleSaveError,
  resolveGeneralScheduleSaveError,
} from '@/features/manager/worker-schedule/lib/scheduleSaveError'
import { dateTimeToHourMinute } from '@/features/manager/worker-schedule/lib/scheduleDateTime'
import { ROUTES, managerWorkerSchedulePath } from '@/shared/constants/routes'
import { queryKeys } from '@/shared/lib/queryKeys'
import { toDateKey } from '@/shared/lib/calendarUtils'
import type { ManagerScheduleShiftDto } from '@/features/manager/home/types/schedule'
import type { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import {
  colorCodesEqual,
  isValidWorkerColorCode,
  normalizeColorCodeForApi,
  resolveSchedulePickerColor,
} from '@/features/manager/worker-schedule/types/workerColor'

const DEFAULT_SELECTED_DAYS: ManagerWeekdayKo[] = ['수', '금']

type SaveVariables = {
  tab: ScheduleTab
  date: Date | null
  pendingKey: string | null
}

type ScheduleFormState = {
  selectedDays: ManagerWeekdayKo[]
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  generalShiftId: number | null
}

const EMPTY_SCHEDULE_FORM: ScheduleFormState = {
  selectedDays: DEFAULT_SELECTED_DAYS,
  startHour: '00',
  startMinute: '00',
  endHour: '00',
  endMinute: '00',
  generalShiftId: null,
}

function buildFixedFormFromSlots(
  slots: WorkerFixedSlotByWeekday[]
): ScheduleFormState {
  const selectedDays =
    slots.length > 0 ? selectedDaysFromSlots(slots) : DEFAULT_SELECTED_DAYS
  const times = displayTimesFromSlots(slots, selectedDays)
  return { selectedDays, ...times, generalShiftId: null }
}

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
  onSaveSuccess?: () => void
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {
    workspaceId,
    workerId,
    activeTab,
    generalSelectedDate,
    onSaveSuccess,
  } = args

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

  const [fixedFormOverride, setFixedFormOverride] =
    useState<WorkerFormOverride<ScheduleFormState>>(null)
  const [generalFormOverride, setGeneralFormOverride] = useState<{
    key: string
    form: ScheduleFormState
  } | null>(null)
  const [colorOverride, setColorOverride] = useState<{
    workerId: number
    color: ScheduleColor
  } | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [pendingAssign, setPendingAssign] = useState<PendingAssignShifts>({})
  const currentPendingKey = generalSelectedDate
    ? pendingAssignKey(workerId, generalSelectedDate)
    : null

  const serverFixedForm = useMemo((): ScheduleFormState | null => {
    if (fixedScheduleLoading) return null
    return buildFixedFormFromSlots(loadedFixedSlots)
  }, [fixedScheduleLoading, loadedFixedSlots])

  const today = format(new Date(), 'yyyy-MM-dd')
  const serverRecurrence = useMemo(
    () => recurrenceFormFromSlots(loadedFixedSlots, today),
    [loadedFixedSlots, today]
  )
  const [recurrenceOverride, setRecurrenceOverride] =
    useState<WorkerFormOverride<FixedScheduleRecurrenceForm>>(null)
  const recurrence = selectWorkerForm(
    recurrenceOverride,
    workerId,
    serverRecurrence
  )

  const patchRecurrence = useCallback(
    (patch: Partial<FixedScheduleRecurrenceForm>) => {
      const next = patchWorkerForm(
        recurrence,
        workerId,
        { ...patch, dirty: true },
        fixedScheduleLoading
      )
      if (next) setRecurrenceOverride(next)
    },
    [recurrence, workerId, fixedScheduleLoading]
  )

  const fixedForm = selectWorkerForm(
    fixedFormOverride,
    workerId,
    serverFixedForm ?? EMPTY_SCHEDULE_FORM
  )

  const generalDataKey = useMemo(() => {
    if (!generalSelectedDate) return null
    const shift = findWorkerShiftOnDate(
      monthlyScheduleResponse?.data.schedules ?? [],
      workerId,
      generalSelectedDate
    )
    return `${workerId}:${format(generalSelectedDate, 'yyyy-MM-dd')}:${shift?.shiftId ?? 'none'}`
  }, [generalSelectedDate, monthlyScheduleResponse, workerId])

  const serverGeneralForm = useMemo((): ScheduleFormState | null => {
    if (
      activeTab !== '일반' ||
      !generalSelectedDate ||
      monthlyScheduleLoading ||
      generalDataKey === null
    ) {
      return null
    }
    const shift = findWorkerShiftOnDate(
      monthlyScheduleResponse?.data.schedules ?? [],
      workerId,
      generalSelectedDate
    )
    if (shift) {
      const start = dateTimeToHourMinute(shift.startDateTime)
      const end = dateTimeToHourMinute(shift.endDateTime)
      return {
        selectedDays: fixedForm.selectedDays,
        startHour: start.hour,
        startMinute: start.minute,
        endHour: end.hour,
        endMinute: end.minute,
        generalShiftId: shift.shiftId,
      }
    }
    const times = displayTimesFromSlots(
      loadedFixedSlots,
      fixedForm.selectedDays
    )
    return {
      selectedDays: fixedForm.selectedDays,
      ...times,
      generalShiftId: null,
    }
  }, [
    activeTab,
    generalSelectedDate,
    monthlyScheduleLoading,
    generalDataKey,
    monthlyScheduleResponse,
    workerId,
    loadedFixedSlots,
    fixedForm.selectedDays,
  ])

  const generalForm = useMemo((): ScheduleFormState => {
    if (generalDataKey === null) return fixedForm
    if (generalFormOverride?.key === generalDataKey) {
      return generalFormOverride.form
    }
    return serverGeneralForm ?? fixedForm
  }, [generalDataKey, generalFormOverride, serverGeneralForm, fixedForm])

  const activeForm = activeTab === '고정' ? fixedForm : generalForm

  const serverColor = useMemo(
    () =>
      worker
        ? resolveSchedulePickerColor(worker.colorCode)
        : resolveSchedulePickerColor(''),
    [worker]
  )

  const selectedColor =
    worker && colorOverride?.workerId === worker.id
      ? colorOverride.color
      : serverColor

  const {
    selectedDays,
    startHour,
    startMinute,
    endHour,
    endMinute,
    generalShiftId,
  } = activeForm

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

  const patchFixedForm = useCallback(
    (patch: Partial<ScheduleFormState>) => {
      const next = patchWorkerForm(
        fixedForm,
        workerId,
        patch,
        fixedScheduleLoading
      )
      if (next) setFixedFormOverride(next)
    },
    [fixedForm, workerId, fixedScheduleLoading]
  )

  const patchGeneralForm = useCallback(
    (patch: Partial<ScheduleFormState>) => {
      if (generalDataKey === null) return
      setGeneralFormOverride({
        key: generalDataKey,
        form: { ...generalForm, ...patch },
      })
    },
    [generalDataKey, generalForm]
  )

  const patchActiveForm = useCallback(
    (patch: Partial<ScheduleFormState>) => {
      if (activeTab === '고정') {
        patchFixedForm(patch)
      } else {
        patchGeneralForm(patch)
      }
    },
    [activeTab, patchFixedForm, patchGeneralForm]
  )

  function toggleDay(day: string) {
    const ko = day as ManagerWeekdayKo
    patchFixedForm({
      selectedDays: selectedDays.includes(ko)
        ? selectedDays.filter(item => item !== ko)
        : [...selectedDays, ko],
    })
  }

  function goToWorker(nextWorkerId: number) {
    setFixedFormOverride(null)
    setGeneralFormOverride(null)
    setColorOverride(null)
    setRecurrenceOverride(null)
    setSaveError(null)
    navigate(managerWorkerSchedulePath(workspaceId, nextWorkerId))
  }

  const setSelectedColor = useCallback(
    (color: ScheduleColor) => {
      setColorOverride({ workerId, color })
    },
    [workerId]
  )

  const saveMutation = useMutation({
    mutationFn: async ({ tab, date, pendingKey }: SaveVariables) => {
      setSaveError(null)
      if (!worker) throw new Error('근무자 정보를 불러오지 못했습니다.')

      if (tab === '고정') {
        if (selectedDays.length === 0) {
          throw new Error('최소 한 개의 요일을 선택해 주세요.')
        }
        const recurrenceError = validateRecurrenceForm(recurrence)
        if (recurrenceError) throw new Error(recurrenceError)
        await saveFixedWorkerSchedules({
          workspaceId,
          workspaceWorkerId: workerId,
          loadedSlots: loadedFixedSlots,
          selectedDays,
          startHour,
          startMinute,
          endHour,
          endMinute,
          recurrence,
          today,
        })
      } else {
        if (!date || !pendingKey) {
          throw new Error('날짜를 선택해 주세요.')
        }

        const shiftId = await saveGeneralWorkerSchedule({
          workspaceId,
          workerId,
          position: worker.position,
          shiftId: generalShiftId,
          pendingAssignShiftId: pendingAssignShiftIdFor(
            pendingAssign,
            pendingKey
          ),
          excludeShiftIds: Object.values(pendingAssign),
          date,
          startHour,
          startMinute,
          endHour,
          endMinute,
        })
        setPendingAssign(prev =>
          pendingAfterGeneralSaveSuccess(prev, pendingKey, shiftId)
        )
        if (generalDataKey !== null) {
          setGeneralFormOverride({
            key: generalDataKey,
            form: { ...generalForm, generalShiftId: shiftId },
          })
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
    onSuccess: async (_data, { date }) => {
      const baseDate = date ?? new Date()
      await invalidateManagerScheduleQueries(
        queryClient,
        workspaceId,
        baseDate.getFullYear(),
        baseDate.getMonth() + 1
      )
      await queryClient.invalidateQueries({
        queryKey: ['managerWorkspace', 'workers', workspaceId],
      })
      setFixedFormOverride(null)
      setGeneralFormOverride(null)
      setColorOverride(null)
      setRecurrenceOverride(null)

      if (onSaveSuccess) {
        onSaveSuccess()
      } else {
        navigate(ROUTES.MANAGER.HOME, { replace: true })
      }
    },
    // 저장 중 날짜·탭이 바뀔 수 있어 저장을 시작한 시점의 값(variables)을 기준으로 처리한다.
    onError: async (error: unknown, { tab, date, pendingKey }) => {
      if (tab === '고정') {
        setSaveError(resolveFixedScheduleSaveError(error))
        // 일부 삭제·수정이 이미 반영됐을 수 있어 고정 목록과 일정을 함께 다시 조회한다.
        const baseDate = date ?? new Date()
        await invalidateManagerScheduleQueries(
          queryClient,
          workspaceId,
          baseDate.getFullYear(),
          baseDate.getMonth() + 1
        )
        return
      }

      setSaveError(resolveGeneralScheduleSaveError(error))
      if (pendingKey !== null) {
        setPendingAssign(prev =>
          pendingAfterGeneralSaveError(prev, pendingKey, error)
        )
      }
      if (date) {
        await invalidateManagerScheduleQueries(
          queryClient,
          workspaceId,
          date.getFullYear(),
          date.getMonth() + 1
        )
      }
    },
  })

  const handleSave = useCallback(() => {
    saveMutation.mutate({
      tab: activeTab,
      date: generalSelectedDate,
      pendingKey: currentPendingKey,
    })
  }, [saveMutation, activeTab, generalSelectedDate, currentPendingKey])

  return {
    fixedRecurrence: {
      form: recurrence,
      setRecurrenceType: (recurrenceType: FixedScheduleRecurrenceType) =>
        patchRecurrence({
          recurrenceType,
          weekOfMonth:
            recurrenceType === 'MONTHLY' ? recurrence.weekOfMonth : null,
        }),
      setWeekOfMonth: (weekOfMonth: number) => patchRecurrence({ weekOfMonth }),
      setStartDate: (date: Date) =>
        patchRecurrence({ startDate: format(date, 'yyyy-MM-dd') }),
      setEndDate: (date: Date | null) =>
        patchRecurrence({
          endDate: date === null ? null : format(date, 'yyyy-MM-dd'),
        }),
    },
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
      setStartTime: (hour: string, minute: string) =>
        patchActiveForm({ startHour: hour, startMinute: minute }),
      setEndTime: (hour: string, minute: string) =>
        patchActiveForm({ endHour: hour, endMinute: minute }),
    },
    handleSave,
    isSaving: saveMutation.isPending,
    saveError,
    selectedColor,
    setSelectedColor,
  }
}
