import { useMemo, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg?react'
import BookmarkIcon from '@/assets/icons/job-lookup-map/Bookmark.svg?react'
import { usePostingDetail } from '@/features/job-lookup-map/hooks/usePostingDetail'
import { useToggleFavoritePosting } from '@/features/job-lookup-map/hooks/useToggleFavoritePosting'
import {
  formatPostedAgo,
  formatWorkDaysForDisplay,
} from '@/features/job-lookup-map/lib/postingToAlbaboxProps'

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'] as const

function parseWorkDayLabels(workDaysLine: string): string[] {
  if (!workDaysLine || workDaysLine === '-') return []
  return workDaysLine
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

export function JobLookupMapDetailPage() {
  const navigate = useNavigate()
  const { postingId: postingIdParam } = useParams<{ postingId: string }>()
  const postingId = Number(postingIdParam)
  const idOk = Number.isFinite(postingId) && postingId > 0

  const { data, isLoading, isError } = usePostingDetail(
    idOk ? postingId : undefined
  )
  const { toggleFavorite, isPending: isFavoritePending } =
    useToggleFavoritePosting()
  const [savedById, setSavedById] = useState<Record<number, boolean>>({})
  const saved =
    (idOk ? savedById[postingId] : undefined) ?? data?.scrapped ?? false

  const schedule = data?.schedules?.[0]
  const workDaysLine = useMemo(() => {
    if (!schedule?.workingDays?.length) return '-'
    return formatWorkDaysForDisplay(schedule.workingDays)
  }, [schedule])

  const selectedDays = useMemo(
    () => parseWorkDayLabels(workDaysLine),
    [workDaysLine]
  )

  const timeRange = schedule
    ? `${schedule.startTime.slice(0, 5)} ~ ${schedule.endTime.slice(0, 5)}`
    : '-'
  const durationHint =
    schedule != null
      ? formatDurationHint(schedule.startTime, schedule.endTime)
      : null

  const handleBookmarkClick = () => {
    if (!idOk || isFavoritePending) return
    toggleFavorite({
      postingId,
      saved,
      onOptimistic: nextSaved =>
        setSavedById(prev => ({ ...prev, [postingId]: nextSaved })),
      onError: rollbackSaved =>
        setSavedById(prev => ({ ...prev, [postingId]: rollbackSaved })),
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-light">
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
          알바 상세
        </h1>
        <button
          type="button"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            handleBookmarkClick()
          }}
          disabled={!data || isFavoritePending}
          aria-label={saved ? '스크랩 해제' : '스크랩'}
          className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:opacity-40 ${
            saved
              ? 'text-main [&_path]:fill-main [&_path]:stroke-main'
              : 'text-text-50'
          }`}
        >
          <BookmarkIcon className="h-5 w-4" aria-hidden />
        </button>
      </header>

      {!idOk && (
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

      {idOk && isLoading && !data && (
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body03-regular text-text-50">
            공고 정보를 불러오는 중…
          </p>
        </main>
      )}

      {idOk && isError && !data && (
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
            <div className="mt-3 overflow-hidden rounded-2xl border border-line-2 bg-white">
              <div className="bg-bg-light px-4 py-[14px]">
                <p className="typography-body01-semibold text-text-100">알바</p>
              </div>
              <div className="space-y-4 px-4 py-4">
                <div className="flex items-center gap-3">
                  <p className="typography-body02-semibold text-text-70">
                    요일
                  </p>
                  <div className="flex h-10 items-center overflow-hidden rounded-2xl bg-bg-light">
                    {WEEK_DAYS.map(day => (
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
                <p className="typography-body02-semibold text-text-100">
                  <span className="mr-3 text-text-70">시간</span>
                  {timeRange}{' '}
                  {durationHint ? (
                    <span className="typography-body03-regular text-text-70">
                      {durationHint}
                    </span>
                  ) : null}
                </p>
                {schedule != null && (
                  <p className="typography-body02-semibold text-text-100">
                    <span className="mr-3 text-text-70">인원</span>
                    {schedule.positionsNeeded}명
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="mt-3 h-12 w-full rounded-2xl border border-line-2 typography-body02-semibold text-text-70"
            >
              더보기
            </button>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              근무 위치
            </h3>
            <p className="mt-2 typography-body03-regular text-text-100">
              {data.workspace.fullAddress}
            </p>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              상세 내용
            </h3>
            <p className="mt-2 typography-body03-regular text-text-100">
              {data.description}
            </p>
          </section>

          <section className="mt-3 bg-white px-4 py-5">
            <h3 className="typography-body01-semibold text-text-100">
              AI 평가 요약
            </h3>
            <div className="relative mt-3 rounded-2xl border border-main bg-main-100 px-4 py-3">
              <span className="absolute right-3 top-[-11px] flex h-5 items-center rounded-lg bg-main px-2 text-[12px] font-semibold leading-none tracking-[-0.12px] text-white">
                AI
              </span>
              <p className="typography-body03-regular text-text-100">
                가게 평판이 없습니다.
              </p>
            </div>
          </section>
          <section className="px-4 pb-4 pt-5">
            <button
              type="button"
              onClick={() =>
                navigate(
                  generatePath(ROUTES.USER.JOB_LOOKUP_MAP_APPLY, {
                    postingId: String(data.id),
                  })
                )
              }
              className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100"
            >
              지원하기
            </button>
          </section>
        </main>
      )}
    </div>
  )
}

export default JobLookupMapDetailPage
