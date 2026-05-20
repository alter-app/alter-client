import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parse } from 'date-fns'

import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'
import { DATE_KEY_FORMAT } from '@/features/home/common/schedule/constants/calendar'
import {
  adaptExchangeableSchedulesToCalendar,
  getExchangeableSchedules,
} from '@/features/user/substitute'
import { getExchangeableWorkers } from '@/features/user/home/workspace/api/exchangeableWorkers'
import { createSubstituteRequest } from '@/features/user/home/workspace/api/substituteRequests'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'

export type SubstituteRequestStepId = 1 | 2 | 3 | 4 | 5

const EXCHANGEABLE_WORKERS_PAGE_SIZE = 50

export function timeDigits(raw: string, maxLen: number) {
  return raw.replace(/\D/g, '').slice(0, maxLen)
}

export function normalizeHourInput(raw: string) {
  const d = timeDigits(raw, 2)
  if (d === '') return '00'
  const n = parseInt(d, 10)
  if (Number.isNaN(n)) return '00'
  return String(Math.min(23, Math.max(0, n))).padStart(2, '0')
}

export function normalizeMinuteInput(raw: string) {
  const d = timeDigits(raw, 2)
  if (d === '') return '00'
  const n = parseInt(d, 10)
  if (Number.isNaN(n)) return '00'
  return String(Math.min(59, Math.max(0, n))).padStart(2, '0')
}

function workerIdFromCandidateKey(key: string): number | undefined {
  if (!key.startsWith('ew-')) return undefined
  const id = Number(key.slice(3))
  return Number.isFinite(id) ? id : undefined
}

function pickScheduleIdForSelectedDate(
  calendarData: CalendarViewData | null | undefined,
  selected: Date | null
): number | null {
  if (selected == null || !calendarData?.events?.length) return null
  const key = format(selected, DATE_KEY_FORMAT)
  const sameDay = calendarData.events.filter(e => e.dateKey === key)
  if (sameDay.length === 0) return null
  sameDay.sort(
    (a, b) =>
      new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  )
  const first = sameDay[0]
  return first != null &&
    typeof first.shiftId === 'number' &&
    Number.isFinite(first.shiftId)
    ? first.shiftId
    : null
}

interface UseSubstituteRequestFlowParams {
  /** workspaceId 없을 때만 사용 (레거시) */
  calendarData?: CalendarViewData | null
  initialMonth?: Date
  summarySelfIntroduction?: string
  workspaceId?: number
  onClose: () => void
}

export function useSubstituteRequestFlow({
  calendarData,
  initialMonth,
  summarySelfIntroduction,
  workspaceId,
  onClose,
}: UseSubstituteRequestFlowParams) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<SubstituteRequestStepId>(1)
  const [substituteReason, setSubstituteReason] = useState('')
  const [substituteSubmitLocalError, setSubstituteSubmitLocalError] = useState<
    string | null
  >(null)
  const [selfIntroduction, setSelfIntroduction] = useState(
    () => summarySelfIntroduction?.trim() ?? ''
  )
  const [substituteCalendarBaseDate, setSubstituteCalendarBaseDate] = useState(
    () => initialMonth ?? new Date()
  )
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(
    null
  )
  const [startHour, setStartHour] = useState('18')
  const [startMin, setStartMin] = useState('00')
  const [endHour, setEndHour] = useState('20')
  const [endMin, setEndMin] = useState('00')
  const [selectedCandidateKeys, setSelectedCandidateKeys] = useState<
    Set<string>
  >(new Set())

  const calendarQueryParams = useMemo(
    () => ({
      year: substituteCalendarBaseDate.getFullYear(),
      month: substituteCalendarBaseDate.getMonth() + 1,
    }),
    [substituteCalendarBaseDate]
  )

  const { data: exchangeableSchedulesResponse } = useQuery({
    queryKey:
      workspaceId != null && workspaceId > 0
        ? queryKeys.workspace.exchangeableSchedules(
            workspaceId,
            calendarQueryParams
          )
        : ['workspace', 'exchangeableSchedules', 'disabled'],
    queryFn: () => getExchangeableSchedules(workspaceId!, calendarQueryParams),
    enabled: workspaceId != null && workspaceId > 0,
  })

  const resolvedCalendarData = useMemo(() => {
    if (
      workspaceId != null &&
      workspaceId > 0 &&
      exchangeableSchedulesResponse
    ) {
      return adaptExchangeableSchedulesToCalendar(exchangeableSchedulesResponse)
    }
    return calendarData ?? null
  }, [workspaceId, exchangeableSchedulesResponse, calendarData])

  const selectedWeekdayLabel = useMemo(() => {
    if (selectedCalendarDate == null) return null
    return WEEKDAY_LABELS[selectedCalendarDate.getDay()]
  }, [selectedCalendarDate])

  const summarySelectedTimeLabel = useMemo(() => {
    const sh = normalizeHourInput(startHour)
    const sm = normalizeMinuteInput(startMin)
    const eh = normalizeHourInput(endHour)
    const em = normalizeMinuteInput(endMin)
    return `${sh}:${sm} ~ ${eh}:${em}`
  }, [startHour, startMin, endHour, endMin])

  const substituteScheduleId = useMemo(
    () =>
      pickScheduleIdForSelectedDate(resolvedCalendarData, selectedCalendarDate),
    [resolvedCalendarData, selectedCalendarDate]
  )

  const {
    data: exchangeableResponse,
    isPending: exchangeableLoading,
    isError: exchangeableError,
    refetch: refetchExchangeable,
  } = useQuery({
    queryKey:
      substituteScheduleId != null
        ? queryKeys.workspace.exchangeableWorkers(
            substituteScheduleId,
            EXCHANGEABLE_WORKERS_PAGE_SIZE
          )
        : ['workspace', 'exchangeableWorkers', 'disabled'],
    queryFn: () =>
      getExchangeableWorkers({
        scheduleId: substituteScheduleId!,
        pageSize: EXCHANGEABLE_WORKERS_PAGE_SIZE,
      }),
    enabled:
      step === 4 && substituteScheduleId != null && substituteScheduleId > 0,
  })

  const exchangeableWorkers = exchangeableResponse?.data.data ?? []

  const substituteRequestMutation = useMutation({
    mutationFn: (vars: {
      scheduleId: number
      targetId: number
      requestReason: string
    }) =>
      createSubstituteRequest({
        scheduleId: vars.scheduleId,
        body: {
          requestType: 'SPECIFIC',
          targetId: vars.targetId,
          requestReason: vars.requestReason,
        },
      }),
    onSuccess: async (_, vars) => {
      if (workspaceId != null && workspaceId > 0) {
        await queryClient.invalidateQueries({
          queryKey: ['workspace', 'exchangeableSchedules', workspaceId],
        })
      }
      await queryClient.invalidateQueries({
        queryKey: ['workspace', 'exchangeableWorkers', vars.scheduleId],
      })
      await queryClient.invalidateQueries({
        queryKey: ['userSubstitute', 'list'],
      })
      onClose()
    },
  })

  const goNext = () => {
    setStep(s => (s < 5 ? ((s + 1) as SubstituteRequestStepId) : s))
  }

  const goBack = () => {
    setStep(s => {
      if (s <= 1) return s
      return (s - 1) as SubstituteRequestStepId
    })
  }

  const clearSubstituteSubmitFeedback = () => {
    setSubstituteSubmitLocalError(null)
    substituteRequestMutation.reset()
  }

  const onSubstituteReasonChange = (value: string) => {
    setSubstituteReason(value)
    clearSubstituteSubmitFeedback()
  }

  const submitSubstituteRequest = () => {
    setSubstituteSubmitLocalError(null)
    substituteRequestMutation.reset()

    if (substituteScheduleId == null || substituteScheduleId <= 0) {
      setSubstituteSubmitLocalError('스케줄 정보를 찾을 수 없습니다.')
      return
    }

    const reasonTrim = substituteReason.trim()
    if (reasonTrim === '') {
      setSubstituteSubmitLocalError('대타 사유를 입력해 주세요.')
      return
    }

    if (selectedCandidateKeys.size !== 1) {
      setSubstituteSubmitLocalError(
        selectedCandidateKeys.size === 0
          ? '교환할 근무자를 선택해 주세요.'
          : '교환 근무자는 한 명만 선택해 주세요.'
      )
      return
    }

    const [onlyKey] = [...selectedCandidateKeys]
    const targetId =
      onlyKey != null ? workerIdFromCandidateKey(onlyKey) : undefined
    if (targetId == null) {
      setSubstituteSubmitLocalError('선택한 근무자 정보가 올바르지 않습니다.')
      return
    }

    substituteRequestMutation.mutate({
      scheduleId: substituteScheduleId,
      targetId,
      requestReason: reasonTrim,
    })
  }

  const substituteSubmitErrorDisplay =
    substituteSubmitLocalError ??
    (substituteRequestMutation.isError
      ? getAxiosErrorMessage(
          substituteRequestMutation.error,
          '대타 요청에 실패했습니다.'
        )
      : null)

  const toggleCandidate = (key: string) => {
    setSelectedCandidateKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const modalMaxWidthClass =
    step === 1 ? 'max-w-[min(358px,calc(100vw-32px))]' : 'max-w-[318px]'

  const selectedDateKey =
    selectedCalendarDate == null
      ? ''
      : format(selectedCalendarDate, DATE_KEY_FORMAT)

  const onSubstituteCalendarDaySelect = (dateKey: string) => {
    setSelectedCalendarDate(parse(dateKey, DATE_KEY_FORMAT, new Date()))
  }

  const clearCandidatesAndGoNextFromSummary = () => {
    setSelectedCandidateKeys(new Set())
    goNext()
  }

  return {
    step,
    goNext,
    goBack,
    substituteReason,
    onSubstituteReasonChange,
    selfIntroduction,
    setSelfIntroduction,
    substituteCalendarBaseDate,
    setSubstituteCalendarBaseDate,
    selectedCalendarDate,
    selectedDateKey,
    onSubstituteCalendarDaySelect,
    startHour,
    setStartHour,
    startMin,
    setStartMin,
    endHour,
    setEndHour,
    endMin,
    setEndMin,
    selectedWeekdayLabel,
    summarySelectedTimeLabel,
    substituteScheduleId,
    exchangeableWorkers,
    exchangeableLoading,
    exchangeableError,
    refetchExchangeable,
    selectedCandidateKeys,
    toggleCandidate,
    substituteSubmitErrorDisplay,
    substituteRequestPending: substituteRequestMutation.isPending,
    submitSubstituteRequest,
    modalMaxWidthClass,
    clearCandidatesAndGoNextFromSummary,
  }
}
