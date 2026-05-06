import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg?react'

type JobDetailState = {
  storeName: string
  title: string
  wageAmount: string
  timeRange: string
  workDays: string
  postedAgo: string
  location?: string
  detail?: string
}

const FALLBACK_DETAIL: JobDetailState = {
  storeName: '출근하기 싫은 가게 고척점',
  title: '[가게이름] 평일 저녁 마감 근무자 모집',
  wageAmount: '10,320',
  timeRange: '18:00~20:00',
  workDays: '수, 금',
  postedAgo: '12시간 전',
  location: '동양미래대학교 동양동 동그래',
  detail: '유승완은 완전히 멘탈이 나가버렸습니다.',
}

export function JobLookupMapDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const detail = useMemo<JobDetailState>(() => {
    const state = location.state as JobDetailState | undefined
    return state ?? FALLBACK_DETAIL
  }, [location.state])

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
        <div className="w-6" />
      </header>

      <main className="flex-1 overflow-y-auto pb-[calc(1rem+78px+env(safe-area-inset-bottom))]">
        <section className="bg-white px-4 py-2">
          <div className="mb-1 flex items-center justify-between typography-body03-regular text-text-70">
            <span>{detail.storeName}</span>
            <span>{detail.postedAgo}</span>
          </div>
          <h2 className="typography-body01-semibold text-text-100">
            {detail.title}
          </h2>
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <h3 className="typography-body01-semibold text-text-100">
            근무 정보
          </h3>
          <p className="mt-1 typography-body03-semibold text-text-100">
            시급 <span className="text-sub">{detail.wageAmount}원</span>
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line-2 bg-white">
            <div className="bg-bg-light px-4 py-[14px]">
              <p className="typography-body01-semibold text-text-100">알바</p>
            </div>
            <div className="space-y-4 px-4 py-4">
              <div className="flex items-center gap-3">
                <p className="typography-body02-semibold text-text-70">요일</p>
                <div className="flex h-10 items-center overflow-hidden rounded-2xl bg-bg-light">
                  <span className="w-10 text-center typography-body03-regular text-text-50">
                    월
                  </span>
                  <span className="w-10 text-center typography-body03-regular text-text-50">
                    화
                  </span>
                  <span className="w-10 rounded-2xl bg-main py-2 text-center typography-body03-semibold text-text-100">
                    수
                  </span>
                  <span className="w-10 text-center typography-body03-regular text-text-50">
                    목
                  </span>
                  <span className="w-10 rounded-2xl bg-main py-2 text-center typography-body03-semibold text-text-100">
                    금
                  </span>
                  <span className="w-10 text-center typography-body03-regular text-text-50">
                    토
                  </span>
                  <span className="w-10 text-center typography-body03-regular text-text-50">
                    일
                  </span>
                </div>
              </div>
              <p className="typography-body02-semibold text-text-100">
                <span className="mr-3 text-text-70">시간</span>
                {detail.timeRange}{' '}
                <span className="typography-body03-regular text-text-70">
                  (4시간)
                </span>
              </p>
              <p className="typography-body02-semibold text-text-100">
                <span className="mr-3 text-text-70">인원</span>3명
              </p>
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
            {detail.location ?? FALLBACK_DETAIL.location}
          </p>
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <h3 className="typography-body01-semibold text-text-100">
            상세 내용
          </h3>
          <p className="mt-2 typography-body03-regular text-text-100">
            {detail.detail ?? FALLBACK_DETAIL.detail}
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
              navigate(ROUTES.USER.JOB_LOOKUP_MAP_APPLY, { state: detail })
            }
            className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100"
          >
            지원하기
          </button>
        </section>
      </main>
    </div>
  )
}

export default JobLookupMapDetailPage
