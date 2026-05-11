import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parse } from 'date-fns'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'

import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'
import { getExchangeableWorkers } from '@/features/user/home/workspace/api/exchangeableWorkers'
import { createSubstituteRequest } from '@/features/user/home/workspace/api/substituteRequests'
import { WEEKDAY_LABELS } from '@/features/user/home/applied-stores/types/appliedStore'
import { DATE_KEY_FORMAT } from '@/features/home/common/schedule/constants/calendar'
import { SubstituteCalendarPickerPanel } from './SubstituteCalendarPickerPanel'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { cn } from '@/shared/lib/utils'

type StepId = 1 | 2 | 3 | 4 | 5

const DEFAULT_INTRO =
  '저는 카페 근처에 거주 하고 있으며, 카페에서 근무한 경험이 있어서 카페에 지원하였습니다.'

function timeDigits(raw: string, maxLen: number) {
  return raw.replace(/\D/g, '').slice(0, maxLen)
}

function normalizeHourInput(raw: string) {
  const d = timeDigits(raw, 2)
  if (d === '') return '00'
  const n = parseInt(d, 10)
  if (Number.isNaN(n)) return '00'
  return String(Math.min(23, Math.max(0, n))).padStart(2, '0')
}

function normalizeMinuteInput(raw: string) {
  const d = timeDigits(raw, 2)
  if (d === '') return '00'
  const n = parseInt(d, 10)
  if (Number.isNaN(n)) return '00'
  return String(Math.min(59, Math.max(0, n))).padStart(2, '0')
}

const timeFieldInputClass =
  'min-w-0 flex-1 bg-transparent text-center tabular-nums typography-body01-semibold text-text-90 outline-none placeholder:text-text-50'

const timeSegmentLabelClass =
  'flex h-[50px] min-w-0 flex-1 cursor-text items-center justify-center gap-1.5 rounded-2xl bg-bg-dark px-3 outline-none transition focus-within:ring-2 focus-within:ring-main'

const EXCHANGEABLE_WORKERS_PAGE_SIZE = 50

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

interface SubstituteRequestModalFlowProps {
  onClose: () => void
  /** 모달 상단에 표시할 업장명 */
  storeName: string
  /** 스케줄 ID(교환 가능 근무자 API) — 선택일에 맞는 이벤트는 캘린더 데이터에서 매칭 */
  calendarData: CalendarViewData | null
  /** 캘린더 단계 초기 표시 월(페이지 스케줄 `baseDate`와 동기) */
  initialMonth?: Date
  /** 요약(3단계) 자기소개 초기값(비워 두면 textarea는 비우고 플레이스홀더로 `DEFAULT_INTRO` 노출) */
  summarySelfIntroduction?: string
  /** 대타 생성 성공 시 스케줄 목록 무효화용 */
  workspaceId?: number
}

/** 대타 요청 다단계 모달: 일 선택 달력 → 근무 시간 → 요약 → 근무자 → 사유 */
export function SubstituteRequestModalFlow({
  onClose,
  storeName,
  calendarData,
  initialMonth,
  summarySelfIntroduction,
  workspaceId,
}: SubstituteRequestModalFlowProps) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState<StepId>(1)
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

  /** step1 달력 선택일 → 월~일 라벨 (WEEKDAY_LABELS 순서와 동일: 월=인덱스0) */
  const selectedWeekdayLabel = useMemo(() => {
    if (selectedCalendarDate == null) return null
    const idx = (selectedCalendarDate.getDay() + 6) % 7
    return WEEKDAY_LABELS[idx]
  }, [selectedCalendarDate])

  const summarySelectedTimeLabel = useMemo(() => {
    const sh = normalizeHourInput(startHour)
    const sm = normalizeMinuteInput(startMin)
    const eh = normalizeHourInput(endHour)
    const em = normalizeMinuteInput(endMin)
    return `${sh}:${sm} ~ ${eh}:${em}`
  }, [startHour, startMin, endHour, endMin])

  const substituteScheduleId = useMemo(
    () => pickScheduleIdForSelectedDate(calendarData, selectedCalendarDate),
    [calendarData, selectedCalendarDate]
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
          queryKey: ['workspace', 'schedules', workspaceId],
        })
      }
      await queryClient.invalidateQueries({
        queryKey: ['workspace', 'exchangeableWorkers', vars.scheduleId],
      })
      onClose()
    },
  })

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const goNext = () => {
    setStep(s => (s < 5 ? ((s + 1) as StepId) : s))
  }

  const goBack = () => {
    setStep(s => {
      if (s <= 1) return s
      return (s - 1) as StepId
    })
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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="닫기"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-white shadow-lg',
          modalMaxWidthClass
        )}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {/* 1 — 일 선택 (Figma 1:546 업장 변경/추가 달력) */}
        {step === 1 ? (
          <>
            <SubstituteCalendarPickerPanel
              baseDate={substituteCalendarBaseDate}
              selectedDateKey={selectedDateKey}
              onMonthChange={setSubstituteCalendarBaseDate}
              onSelectDateKey={onSubstituteCalendarDaySelect}
            />

            <div className="px-5 pb-5 pt-4">
              <button
                type="button"
                disabled={selectedCalendarDate == null}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:opacity-50"
                onClick={goNext}
              >
                다음
              </button>
            </div>
          </>
        ) : null}

        {/* 2 — 근무 시간 (Figma 1:815 — 출근·퇴근 시간 시:분 단위 표기) */}
        {step === 2 ? (
          <>
            <div className="flex min-h-[56px] items-center gap-1 px-4 pb-2 pt-6">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={goBack}
              >
                <img src={ChevronLeftIcon} alt="" className="size-5" />
              </button>
              <h2 className="min-w-0 flex-1 text-center typography-headline03 tracking-[-0.01em] text-text-100">
                근무 시간 선택
              </h2>
              <div className="size-10 shrink-0" aria-hidden />
            </div>

            <div className="flex flex-col gap-8 px-5 pb-2 pt-2">
              <div>
                <p className="mb-3 typography-body03-regular text-text-70">
                  출근 시간
                </p>
                <div className="flex items-center gap-3">
                  <label
                    className={timeSegmentLabelClass}
                    htmlFor="substitute-start-hour"
                  >
                    <input
                      id="substitute-start-hour"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={2}
                      placeholder="00"
                      aria-label="출근 시"
                      className={timeFieldInputClass}
                      value={startHour}
                      onChange={e =>
                        setStartHour(timeDigits(e.target.value, 2))
                      }
                      onBlur={() => setStartHour(h => normalizeHourInput(h))}
                      onFocus={e => e.currentTarget.select()}
                    />
                    <span className="pointer-events-none shrink-0 typography-body02-regular text-text-70">
                      시
                    </span>
                  </label>
                  <span
                    className="shrink-0 typography-headline01 tabular-nums leading-none tracking-[-0.01em] text-text-100"
                    aria-hidden
                  >
                    :
                  </span>
                  <label
                    className={timeSegmentLabelClass}
                    htmlFor="substitute-start-minute"
                  >
                    <input
                      id="substitute-start-minute"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={2}
                      placeholder="00"
                      aria-label="출근 분"
                      className={timeFieldInputClass}
                      value={startMin}
                      onChange={e => setStartMin(timeDigits(e.target.value, 2))}
                      onBlur={() => setStartMin(m => normalizeMinuteInput(m))}
                      onFocus={e => e.currentTarget.select()}
                    />
                    <span className="pointer-events-none shrink-0 typography-body02-regular text-text-70">
                      분
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <p className="mb-3 typography-body03-regular text-text-70">
                  퇴근 시간
                </p>
                <div className="flex items-center gap-3">
                  <label
                    className={timeSegmentLabelClass}
                    htmlFor="substitute-end-hour"
                  >
                    <input
                      id="substitute-end-hour"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={2}
                      placeholder="00"
                      aria-label="퇴근 시"
                      className={timeFieldInputClass}
                      value={endHour}
                      onChange={e => setEndHour(timeDigits(e.target.value, 2))}
                      onBlur={() => setEndHour(h => normalizeHourInput(h))}
                      onFocus={e => e.currentTarget.select()}
                    />
                    <span className="pointer-events-none shrink-0 typography-body02-regular text-text-70">
                      시
                    </span>
                  </label>
                  <span
                    className="shrink-0 typography-headline01 tabular-nums leading-none tracking-[-0.01em] text-text-100"
                    aria-hidden
                  >
                    :
                  </span>
                  <label
                    className={timeSegmentLabelClass}
                    htmlFor="substitute-end-minute"
                  >
                    <input
                      id="substitute-end-minute"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={2}
                      placeholder="00"
                      aria-label="퇴근 분"
                      className={timeFieldInputClass}
                      value={endMin}
                      onChange={e => setEndMin(timeDigits(e.target.value, 2))}
                      onBlur={() => setEndMin(m => normalizeMinuteInput(m))}
                      onFocus={e => e.currentTarget.select()}
                    />
                    <span className="pointer-events-none shrink-0 typography-body02-regular text-text-70">
                      분
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-5 pb-6 pt-4">
              <button
                type="button"
                className="flex h-[48px] w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
                onClick={goNext}
              >
                선택 완료
              </button>
            </div>
          </>
        ) : null}

        {/* 3 — 요약 (지원 상세와 동일 패턴) */}
        {step === 3 ? (
          <>
            <div className="flex h-[52px] items-center gap-1 px-4 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={goBack}
              >
                <img src={ChevronLeftIcon} alt="" className="size-5" />
              </button>
              <h2 className="min-w-0 flex-1 truncate text-center typography-body01-semibold text-text-100">
                {storeName}
              </h2>
              <div className="size-10 shrink-0" aria-hidden />
            </div>

            <div className="px-5 pt-4">
              <p className="mb-2 typography-body03-regular text-text-70">
                요일
              </p>
              <div className="flex h-[50px] items-center rounded-2xl bg-bg-dark px-1 py-[5px]">
                {WEEKDAY_LABELS.map(day => {
                  const selected =
                    selectedWeekdayLabel != null && day === selectedWeekdayLabel
                  return (
                    <div
                      key={day}
                      className="flex min-w-0 flex-1 items-center justify-center"
                    >
                      {selected ? (
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-main-900 typography-body03-semibold text-text-100">
                          {day}
                        </span>
                      ) : (
                        <span className="typography-body03-regular text-text-50">
                          {day}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="px-5 pt-4">
              <p className="mb-2 typography-body03-regular text-text-70">
                시간
              </p>
              <div className="flex h-[50px] items-center rounded-2xl bg-bg-dark px-[17px]">
                <p className="typography-body03-semibold text-text-100">
                  {summarySelectedTimeLabel}
                </p>
              </div>
            </div>

            <div className="px-5 pt-4">
              <label
                className="mb-2 block typography-body03-regular text-text-70"
                htmlFor="substitute-self-intro-input"
              >
                자기소개
              </label>
              <textarea
                id="substitute-self-intro-input"
                rows={4}
                value={selfIntroduction}
                onChange={e => setSelfIntroduction(e.target.value)}
                placeholder={DEFAULT_INTRO}
                className="min-h-[70px] w-full resize-none rounded-2xl border border-transparent bg-bg-dark px-[14px] py-4 typography-body03-regular text-text-100 outline-none placeholder:text-text-50 focus:border-main-300"
              />
            </div>

            <div className="px-5 pb-5 pt-6">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
                onClick={() => {
                  setSelectedCandidateKeys(new Set())
                  goNext()
                }}
              >
                다음
              </button>
            </div>
          </>
        ) : null}

        {/* 4 — 근무자 목록 */}
        {step === 4 ? (
          <>
            <div className="flex min-h-[52px] items-center gap-1 px-4 pb-3 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={goBack}
              >
                <img src={ChevronLeftIcon} alt="" className="size-5" />
              </button>
              <h2 className="min-w-0 flex-1 text-center typography-body01-semibold text-text-100">
                대타 가능한 근무자 목록
              </h2>
              <div className="size-10 shrink-0" aria-hidden />
            </div>

            <div className="max-h-[340px] space-y-2 overflow-y-auto px-5 pb-2">
              {substituteScheduleId == null ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  선택한 날짜에 등록된 스케줄이 없어 교환 가능한 근무자를 불러올
                  수 없습니다.
                </p>
              ) : exchangeableLoading ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  교환 가능한 근무자를 불러오는 중...
                </p>
              ) : exchangeableError ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-center typography-body02-regular text-text-70">
                    교환 가능한 근무자 목록을 불러오지 못했습니다.
                  </p>
                  <button
                    type="button"
                    className="typography-body02-semibold text-main underline-offset-2 hover:underline"
                    onClick={() => void refetchExchangeable()}
                  >
                    다시 시도
                  </button>
                </div>
              ) : exchangeableWorkers.length === 0 ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  교환 가능한 근무자가 없습니다.
                </p>
              ) : (
                exchangeableWorkers.map(w => {
                  const key = `ew-${w.workerId}`
                  const selected = selectedCandidateKeys.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCandidate(key)}
                      aria-pressed={selected}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl border-2 bg-white px-3 py-3 text-left transition-colors',
                        selected ? 'border-main' : 'border-transparent'
                      )}
                    >
                      <div className="size-[38px] shrink-0 rounded-full bg-bg-light" />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="typography-body01-semibold text-text-100">
                            {w.workerName}
                          </span>
                          <WorkerRoleBadge role="staff" />
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            <div className="px-5 pb-5 pt-4">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
                onClick={goNext}
              >
                다음
              </button>
            </div>
          </>
        ) : null}

        {/* 5 — 대타 사유 */}
        {step === 5 ? (
          <>
            <div className="flex h-[52px] items-center gap-1 px-4 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={goBack}
              >
                <img src={ChevronLeftIcon} alt="" className="size-5" />
              </button>
              <h2 className="min-w-0 flex-1 text-center typography-body01-semibold text-text-100">
                대타 사유 입력
              </h2>
              <div className="size-10 shrink-0" aria-hidden />
            </div>

            <div className="px-5 pb-5 pt-4">
              <label className="sr-only" htmlFor="substitute-reason-input">
                대타 사유
              </label>
              <textarea
                id="substitute-reason-input"
                rows={5}
                value={substituteReason}
                onChange={e => {
                  setSubstituteReason(e.target.value)
                  setSubstituteSubmitLocalError(null)
                  substituteRequestMutation.reset()
                }}
                placeholder="대타 사유를 입력해주세요."
                disabled={substituteRequestMutation.isPending}
                className="min-h-[120px] w-full resize-none rounded-2xl border border-transparent bg-bg-dark px-[14px] py-4 typography-body03-regular text-text-100 outline-none placeholder:text-text-50 focus:border-main-300 disabled:opacity-60"
              />

              {substituteSubmitErrorDisplay != null &&
              substituteSubmitErrorDisplay !== '' ? (
                <p className="mt-3 typography-body02-regular text-red-600">
                  {substituteSubmitErrorDisplay}
                </p>
              ) : null}

              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => submitSubstituteRequest()}
                disabled={substituteRequestMutation.isPending}
              >
                {substituteRequestMutation.isPending ? '요청 중…' : '요청하기'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
