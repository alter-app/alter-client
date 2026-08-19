import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg?react'
import { useApplyPosting } from '@/features/job-lookup-map/hooks/useApplyPosting'
import { usePostingDetail } from '@/features/job-lookup-map/hooks/usePostingDetail'
import { resolveApplyPostingError } from '@/features/job-lookup-map/lib/applyPostingError'
import type { Schedule } from '@/features/job-lookup-map/types/posting'
import {
  formatPostedAgo,
  formatWorkDaysForDisplay,
} from '@/features/job-lookup-map/lib/postingToAlbaboxProps'

function parseSelectedWorkDaysFromSchedule(schedule: Schedule): string[] {
  if (!schedule.workingDays?.length) return []
  const line = formatWorkDaysForDisplay(schedule.workingDays)
  if (!line || line === '-') return []
  return line
    .split(/,\s*/)
    .map(s => s.trim())
    .filter(Boolean)
}

function formatDurationHint(start: string, end: string): string | null {
  const [sh, sm] = start.slice(0, 5).split(':').map(Number)
  const [eh, em] = end.slice(0, 5).split(':').map(Number)
  if ([sh, sm, eh, em].some(Number.isNaN)) return null
  const mins = eh * 60 + em - (sh * 60 + sm)
  if (mins <= 0) return null
  const h = mins / 60
  return `(${Number.isInteger(h) ? h : h.toFixed(1)}시간)`
}

type ShiftCardProps = {
  title: string
  selectedDays: string[]
  people: number
  timeRange: string
  durationHint?: string | null
  selected?: boolean
  onSelect?: () => void
}

function ShiftCard({
  title,
  selectedDays,
  people,
  timeRange,
  durationHint,
  selected,
  onSelect,
}: ShiftCardProps) {
  const days = ['월', '화', '수', '목', '금', '토', '일']

  return (
    <article
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect()
              }
            }
          : undefined
      }
      className={`rounded-2xl border p-4 ${
        selected ? 'border-main-700 bg-main-300' : 'border-line-2 bg-white'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <h4 className="typography-body01-semibold text-text-100">{title}</h4>
      <div className="mt-8 flex items-center gap-3">
        <p className="typography-body02-semibold text-text-70">요일</p>
        <div className="flex h-10 items-center overflow-hidden rounded-2xl bg-bg-light">
          {days.map(day => (
            <span
              key={day}
              className={`w-10 text-center ${
                selectedDays.includes(day)
                  ? 'rounded-2xl bg-main py-2 typography-body03-semibold text-text-100'
                  : 'typography-body03-regular text-text-50'
              }`}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-3 typography-body02-semibold text-text-100">
        <span className="mr-3 text-text-70">시간</span>
        {timeRange}{' '}
        {durationHint ? (
          <span className="typography-body03-regular text-text-70">
            {durationHint}
          </span>
        ) : null}
      </p>
      <p className="mt-3 typography-body02-semibold text-text-100">
        <span className="mr-3 text-text-70">인원</span>
        {people}명
      </p>
    </article>
  )
}

export function JobLookupMapApplyPage() {
  const navigate = useNavigate()
  const { postingId: postingIdParam } = useParams<{ postingId: string }>()
  const postingId = Number(postingIdParam)
  const idOk = Number.isFinite(postingId) && postingId > 0

  const { data, isLoading, isError } = usePostingDetail(
    idOk ? postingId : undefined
  )
  const [introduction, setIntroduction] = useState('')
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  )

  const {
    mutate: submitApply,
    isPending: isSubmitting,
    isError: isSubmitError,
    error: submitError,
  } = useApplyPosting()

  const applyError = isSubmitError
    ? resolveApplyPostingError(submitError)
    : null

  const showLoading = idOk && isLoading && !data
  const showError = idOk && isError && !data
  const showEmpty = !idOk

  return (
    <div className="flex min-h-dvh flex-col bg-bg-light">
      <header className="flex h-14 shrink-0 items-center border-b border-line-2 bg-white px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-2 flex h-6 w-6 items-center justify-center text-text-100"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-6 w-6 text-text-100" />
        </button>
        <h1 className="flex-1 text-center typography-headline03 text-text-100">
          지원하기
        </h1>
        <div className="w-6" />
      </header>

      {showLoading && (
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body03-regular text-text-50">
            공고 정보를 불러오는 중…
          </p>
        </main>
      )}

      {showError && (
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
          <p className="text-center typography-body03-regular text-text-50">
            공고 정보를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-line-2 px-4 py-2 typography-body02-semibold text-text-70"
          >
            돌아가기
          </button>
        </main>
      )}

      {showEmpty && (
        <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4">
          <p className="text-center typography-body03-regular text-text-50">
            잘못된 공고입니다.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-line-2 px-4 py-2 typography-body02-semibold text-text-70"
          >
            돌아가기
          </button>
        </main>
      )}

      {data && (
        <main className="flex-1 overflow-y-auto pb-[calc(1rem+78px+env(safe-area-inset-bottom))]">
          <section className="bg-white px-4 py-2">
            <div className="mb-1 flex items-center justify-between typography-body03-regular text-text-70">
              <span>{data.workspace.name}</span>
              <span>{formatPostedAgo(data.createdAt)}</span>
            </div>
            <h2 className="typography-body01-semibold text-text-100">
              {data.title}
            </h2>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              근무 정보
            </h3>
            <p className="mt-1 typography-body03-semibold text-text-100">
              시급{' '}
              <span className="text-sub">
                {data.payAmount.toLocaleString('ko-KR')}원
              </span>
            </p>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              상세 내용
            </h3>
            <p className="mt-2 typography-body03-regular text-text-100">
              {data.description?.trim()
                ? data.description
                : '상세 내용이 없습니다.'}
            </p>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              근무시간 선택
            </h3>
            <div className="mt-3 space-y-3">
              {data.schedules.length > 0 ? (
                data.schedules.map((schedule, i) => (
                  <ShiftCard
                    key={schedule.id}
                    title={schedule.position?.trim() || `근무 ${i + 1}`}
                    selectedDays={parseSelectedWorkDaysFromSchedule(schedule)}
                    people={schedule.positionsNeeded}
                    timeRange={`${schedule.startTime.slice(0, 5)}~${schedule.endTime.slice(0, 5)}`}
                    durationHint={formatDurationHint(
                      schedule.startTime,
                      schedule.endTime
                    )}
                    selected={
                      selectedScheduleId != null
                        ? selectedScheduleId === schedule.id
                        : i === 0
                    }
                    onSelect={() => setSelectedScheduleId(schedule.id)}
                  />
                ))
              ) : (
                <p className="typography-body03-regular text-text-50">
                  등록된 근무 일정이 없습니다.
                </p>
              )}
            </div>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              자기소개
            </h3>
            <input
              type="text"
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
              placeholder="자신을 장점을 마음껏 작성해 주세요!"
              className="mt-3 h-12 w-full rounded-2xl bg-bg-light px-4 typography-body03-regular text-text-100 placeholder:text-text-50 outline-none"
            />
          </section>

          <section className="px-4 pb-4 pt-3">
            {applyError ? (
              <p className="mb-2 text-center typography-body03-regular text-sub">
                {applyError.message}
              </p>
            ) : null}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                const scheduleId = selectedScheduleId ?? data.schedules[0]?.id
                if (!scheduleId) return
                submitApply({
                  postingId: data.id,
                  body: {
                    postingScheduleId: scheduleId,
                    description: introduction.trim(),
                  },
                })
              }}
              className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100 disabled:opacity-50"
            >
              {isSubmitting
                ? '제출 중…'
                : applyError?.retryable
                  ? '다시 시도'
                  : '제출하기'}
            </button>
          </section>
        </main>
      )}
    </div>
  )
}

export default JobLookupMapApplyPage
