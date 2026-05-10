import { useEffect, useMemo, useState } from 'react'
import { format, parse } from 'date-fns'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'

import type {
  WorkspaceManagerItem,
  WorkspaceWorkerItem,
} from '@/features/user/home/workspace/types/workspaceMembers'
import { WEEKDAY_LABELS } from '@/features/user/home/applied-stores/types/appliedStore'
import { DATE_KEY_FORMAT } from '@/features/home/common/schedule/constants/calendar'
import { SubstituteCalendarPickerPanel } from './SubstituteCalendarPickerPanel'
import {
  WorkerRoleBadge,
  type WorkerRole,
} from '@/shared/ui/home/WorkerRoleBadge'
import { cn } from '@/shared/lib/utils'

type StepId = 1 | 2 | 3 | 4 | 5

interface SubstituteRequestModalFlowProps {
  onClose: () => void
  /** 모달 상단에 표시할 업장명 */
  storeName: string
  managers: WorkspaceManagerItem[]
  workers: WorkspaceWorkerItem[]
  /** 캘린더 단계 초기 표시 월(페이지 스케줄 `baseDate`와 동기) */
  initialMonth?: Date
  /** 요약(3단계)에서 강조할 요일 라벨 */
  summaryHighlightedWeekdays?: readonly string[]
  /** 요약 시간 문구 */
  summaryTimeRangeLabel?: string
  /** 요약 자기소개 */
  summarySelfIntroduction?: string
}

const DEFAULT_SUMMARY_HIGHLIGHTED = ['수', '금'] as const
const DEFAULT_TIME = '18:00~20:00 (4시간)'
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

/** 대타 요청 다단계 모달: 일 선택 달력 → 근무 시간 → 요약 → 사유 → 근무자 */
export function SubstituteRequestModalFlow({
  onClose,
  storeName,
  managers,
  workers,
  initialMonth,
  summaryHighlightedWeekdays = DEFAULT_SUMMARY_HIGHLIGHTED,
  summaryTimeRangeLabel = DEFAULT_TIME,
  summarySelfIntroduction = DEFAULT_INTRO,
}: SubstituteRequestModalFlowProps) {
  const [step, setStep] = useState<StepId>(1)
  const [substituteReason, setSubstituteReason] = useState('')
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

  const highlightSet = useMemo(
    () => new Set(summaryHighlightedWeekdays),
    [summaryHighlightedWeekdays]
  )

  const candidates = useMemo(() => {
    const managerRows = managers.map(m => ({
      key: `m-${m.id}`,
      name: m.name,
      badge: 'manager' as const satisfies WorkerRole,
    }))
    const workerRows = workers.map(w => ({
      key: `w-${w.id}`,
      name: w.name,
      badge: 'staff' as const satisfies WorkerRole,
    }))
    return [...managerRows, ...workerRows]
  }, [managers, workers])

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

  const finishFlow = () => {
    onClose()
  }

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
                  const selected = highlightSet.has(day)
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
                  {summaryTimeRangeLabel}
                </p>
              </div>
            </div>

            <div className="px-5 pt-4">
              <p className="mb-2 typography-body03-regular text-text-70">
                자기소개
              </p>
              <div className="min-h-[70px] rounded-2xl bg-bg-dark px-[14px] py-4">
                <p className="whitespace-pre-wrap typography-body03-regular text-text-100">
                  {summarySelfIntroduction}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-6">
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

        {/* 4 — 대타 사유 */}
        {step === 4 ? (
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
                onChange={e => setSubstituteReason(e.target.value)}
                placeholder="대타 사유를 입력해주세요."
                className="min-h-[120px] w-full resize-none rounded-2xl border border-transparent bg-bg-dark px-[14px] py-4 typography-body03-regular text-text-100 outline-none placeholder:text-text-50 focus:border-main-300"
              />

              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
                onClick={goNext}
              >
                요청하기
              </button>
            </div>
          </>
        ) : null}

        {/* 5 — 근무자 목록 */}
        {step === 5 ? (
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
              {candidates.length === 0 ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  표시할 근무자가 없습니다.
                </p>
              ) : (
                candidates.map(row => {
                  const selected = selectedCandidateKeys.has(row.key)
                  return (
                    <button
                      key={row.key}
                      type="button"
                      onClick={() => toggleCandidate(row.key)}
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
                            {row.name}
                          </span>
                          <WorkerRoleBadge role={row.badge} />
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
                onClick={finishFlow}
              >
                선택 완료
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
