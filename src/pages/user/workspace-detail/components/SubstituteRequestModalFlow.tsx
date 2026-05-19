import { useEffect } from 'react'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'

import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import { SubstituteCalendarPickerPanel } from './SubstituteCalendarPickerPanel'
import {
  normalizeHourInput,
  normalizeMinuteInput,
  timeDigits,
  useSubstituteRequestFlow,
} from '@/features/user'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { cn } from '@/shared/lib/utils'

import type { CalendarViewData } from '@/features/home/common/schedule/types/calendarView'

const timeFieldInputClass =
  'min-w-0 flex-1 bg-transparent text-center tabular-nums typography-body01-semibold text-text-90 outline-none placeholder:text-text-50'

const timeSegmentLabelClass =
  'flex h-[50px] min-w-0 flex-1 cursor-text items-center justify-center gap-1.5 rounded-2xl bg-bg-dark px-3 outline-none transition focus-within:ring-2 focus-within:ring-main'

interface SubstituteRequestModalFlowProps {
  onClose: () => void
  /** 모달 상단에 표시할 업장명 */
  storeName: string
  /** 스케줄 ID(교환 가능 근무자 API) — `workspaceId`가 있으면 플로우 내부에서 교환 가능 스케줄 API로 조회 */
  calendarData?: CalendarViewData | null
  /** 캘린더 단계 초기 표시 월(페이지 스케줄 `baseDate`와 동기) */
  initialMonth?: Date
  /** 요약(3단계) 자기소개 초기값(비워 두면 textarea는 비우고 플레이스홀더로 기본 문구 노출) */
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
  const flow = useSubstituteRequestFlow({
    calendarData,
    initialMonth,
    summarySelfIntroduction,
    workspaceId,
    onClose,
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
          flow.modalMaxWidthClass
        )}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        {/* 1 — 일 선택 (Figma 1:546 업장 변경/추가 달력) */}
        {flow.step === 1 ? (
          <>
            <SubstituteCalendarPickerPanel
              baseDate={flow.substituteCalendarBaseDate}
              selectedDateKey={flow.selectedDateKey}
              onMonthChange={flow.setSubstituteCalendarBaseDate}
              onSelectDateKey={flow.onSubstituteCalendarDaySelect}
            />

            <div className="px-5 pb-5 pt-4">
              <button
                type="button"
                disabled={flow.selectedCalendarDate == null}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:opacity-50"
                onClick={flow.goNext}
              >
                다음
              </button>
            </div>
          </>
        ) : null}

        {/* 2 — 근무 시간 (Figma 1:815 — 출근·퇴근 시간 시:분 단위 표기) */}
        {flow.step === 2 ? (
          <>
            <div className="flex min-h-[56px] items-center gap-1 px-4 pb-2 pt-6">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={flow.goBack}
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
                      value={flow.startHour}
                      onChange={e =>
                        flow.setStartHour(timeDigits(e.target.value, 2))
                      }
                      onBlur={() =>
                        flow.setStartHour(h => normalizeHourInput(h))
                      }
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
                      value={flow.startMin}
                      onChange={e =>
                        flow.setStartMin(timeDigits(e.target.value, 2))
                      }
                      onBlur={() =>
                        flow.setStartMin(m => normalizeMinuteInput(m))
                      }
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
                      value={flow.endHour}
                      onChange={e =>
                        flow.setEndHour(timeDigits(e.target.value, 2))
                      }
                      onBlur={() => flow.setEndHour(h => normalizeHourInput(h))}
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
                      value={flow.endMin}
                      onChange={e =>
                        flow.setEndMin(timeDigits(e.target.value, 2))
                      }
                      onBlur={() =>
                        flow.setEndMin(m => normalizeMinuteInput(m))
                      }
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
                onClick={flow.goNext}
              >
                선택 완료
              </button>
            </div>
          </>
        ) : null}

        {/* 3 — 요약 (지원 상세와 동일 패턴) */}
        {flow.step === 3 ? (
          <>
            <div className="flex h-[52px] items-center gap-1 px-4 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={flow.goBack}
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
                    flow.selectedWeekdayLabel != null &&
                    day === flow.selectedWeekdayLabel
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
                  {flow.summarySelectedTimeLabel}
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
                value={flow.selfIntroduction}
                onChange={e => flow.setSelfIntroduction(e.target.value)}
                placeholder="필요하신 시간에 맞춰 성실히 근무하겠습니다. 근처라 호출 시 대응도 빠릅니다. 연락 부탁드립니다!"
                className="min-h-[70px] w-full resize-none rounded-2xl border border-transparent bg-bg-dark px-[14px] py-4 typography-body03-regular text-text-100 outline-none placeholder:text-text-50 focus:border-main-300"
              />
            </div>

            <div className="px-5 pb-5 pt-6">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100"
                onClick={flow.clearCandidatesAndGoNextFromSummary}
              >
                다음
              </button>
            </div>
          </>
        ) : null}

        {/* 4 — 근무자 목록 */}
        {flow.step === 4 ? (
          <>
            <div className="flex min-h-[52px] items-center gap-1 px-4 pb-3 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={flow.goBack}
              >
                <img src={ChevronLeftIcon} alt="" className="size-5" />
              </button>
              <h2 className="min-w-0 flex-1 text-center typography-body01-semibold text-text-100">
                대타 가능한 근무자 목록
              </h2>
              <div className="size-10 shrink-0" aria-hidden />
            </div>

            <div className="max-h-[340px] space-y-2 overflow-y-auto px-5 pb-2">
              {flow.substituteScheduleId == null ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  선택한 날짜에 등록된 스케줄이 없어 교환 가능한 근무자를 불러올
                  수 없습니다.
                </p>
              ) : flow.exchangeableLoading ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  교환 가능한 근무자를 불러오는 중...
                </p>
              ) : flow.exchangeableError ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-center typography-body02-regular text-text-70">
                    교환 가능한 근무자 목록을 불러오지 못했습니다.
                  </p>
                  <button
                    type="button"
                    className="typography-body02-semibold text-main underline-offset-2 hover:underline"
                    onClick={() => void flow.refetchExchangeable()}
                  >
                    다시 시도
                  </button>
                </div>
              ) : flow.exchangeableWorkers.length === 0 ? (
                <p className="py-8 text-center typography-body02-regular text-text-70">
                  교환 가능한 근무자가 없습니다.
                </p>
              ) : (
                flow.exchangeableWorkers.map(w => {
                  const key = `ew-${w.workerId}`
                  const selected = flow.selectedCandidateKeys.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => flow.toggleCandidate(key)}
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
                onClick={
                  flow.substituteScheduleId == null ? flow.goBack : flow.goNext
                }
              >
                {flow.substituteScheduleId == null ? '뒤로가기' : '다음'}
              </button>
            </div>
          </>
        ) : null}

        {/* 5 — 대타 사유 */}
        {flow.step === 5 ? (
          <>
            <div className="flex h-[52px] items-center gap-1 px-4 pt-4">
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none transition hover:bg-bg-light/80 focus-visible:ring-2 focus-visible:ring-main"
                aria-label="이전"
                onClick={flow.goBack}
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
                value={flow.substituteReason}
                onChange={e => flow.onSubstituteReasonChange(e.target.value)}
                placeholder="대타 사유를 입력해주세요."
                disabled={flow.substituteRequestPending}
                className="min-h-[120px] w-full resize-none rounded-2xl border border-transparent bg-bg-dark px-[14px] py-4 typography-body03-regular text-text-100 outline-none placeholder:text-text-50 focus:border-main-300 disabled:opacity-60"
              />

              {flow.substituteSubmitErrorDisplay != null &&
              flow.substituteSubmitErrorDisplay !== '' ? (
                <p className="mt-3 typography-body02-regular text-red-600">
                  {flow.substituteSubmitErrorDisplay}
                </p>
              ) : null}

              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => flow.submitSubstituteRequest()}
                disabled={flow.substituteRequestPending}
              >
                {flow.substituteRequestPending ? '요청 중…' : '요청하기'}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
