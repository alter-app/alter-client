import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg?react'

type JobApplyState = {
  storeName: string
  title: string
  wageAmount: string
  postedAgo: string
  detail?: string
}

const FALLBACK_APPLY: JobApplyState = {
  storeName: '출근하기 싫은 가게 고척점',
  title: '[가게이름] 평일 저녁 마감 근무자 모집',
  wageAmount: '10,320',
  postedAgo: '12시간 전',
  detail: '유승완은 완전히 멘탈이 나가버렸습니다.',
}

type ShiftCardProps = {
  title: string
  selectedDays: string[]
  people: number
  highlighted?: boolean
}

function ShiftCard({
  title,
  selectedDays,
  people,
  highlighted,
}: ShiftCardProps) {
  const days = ['월', '화', '수', '목', '금', '토', '일']

  return (
    <article
      className={`rounded-2xl border p-4 ${
        highlighted ? 'border-[#6CEBA9] bg-[#C0F7DA]' : 'border-line-2 bg-white'
      }`}
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
        18:00~20:00{' '}
        <span className="typography-body03-regular text-text-70">(4시간)</span>
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
  const location = useLocation()

  const detail = useMemo<JobApplyState>(() => {
    const state = location.state as JobApplyState | undefined
    return state ?? FALLBACK_APPLY
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
          지원하기
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
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <h3 className="typography-body01-semibold text-text-100">
            상세 내용
          </h3>
          <p className="mt-2 typography-body03-regular text-text-100">
            {detail.detail ?? FALLBACK_APPLY.detail}
          </p>
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <h3 className="typography-body01-semibold text-text-100">
            근무시간 선택
          </h3>
          <div className="mt-3 space-y-3">
            <ShiftCard title="알바 01" selectedDays={['수', '금']} people={3} />
            <ShiftCard
              title="알바 02"
              selectedDays={['화', '목']}
              people={1}
              highlighted
            />
          </div>
        </section>

        <section className="mt-3 bg-white px-4 py-5">
          <h3 className="typography-body01-semibold text-text-100">자기소개</h3>
          <div className="mt-3 flex h-12 items-center rounded-2xl bg-bg-light px-4 typography-body03-regular text-text-50">
            자신을 장점을 마음껏 작성해 주세요!
          </div>
        </section>

        <section className="px-4 pb-4 pt-3">
          <button
            type="button"
            className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100"
          >
            제출하기
          </button>
        </section>
      </main>
    </div>
  )
}

export default JobLookupMapApplyPage
