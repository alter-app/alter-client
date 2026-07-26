import { useNavigate, useParams } from 'react-router-dom'

import CalendarIcon from '@/assets/icons/posting/Calendar.svg?react'
import ChevronRightIcon from '@/assets/icons/posting/ChevronRight.svg?react'
import ClockIcon from '@/assets/icons/posting/Clock.svg?react'
import PersonIcon from '@/assets/icons/posting/Person.svg?react'
import { usePostingDetailViewModel } from '@/features/manager/posting/hooks/usePostingDetailViewModel'
import { ManagerPostingStatusBadge } from '@/features/manager/posting/ui/ManagerPostingStatusBadge'
import {
  formatTimeRange,
  formatWorkingDays,
  PAYMENT_TYPE_LABEL,
} from '@/features/manager/posting/types/posting'
import {
  managerPostingApplicationsPath,
  managerPostingEditPath,
} from '@/shared/constants/routes'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'

/** SCREEN 4 · 내 공고 상세 · 마감 */
export function ManagerPostingDetailPage() {
  const navigate = useNavigate()
  const { postingId } = useParams()
  const numericPostingId = Number(postingId)

  const {
    posting,
    applicantCount,
    isNotFound,
    isCloseModalOpen,
    openCloseModal,
    closeCloseModal,
    confirmClose,
  } = usePostingDetailViewModel(numericPostingId)

  if (isNotFound || !posting) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="공고 상세" />
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body02-regular text-text-70">
            공고를 찾을 수 없어요.
          </p>
        </main>
      </div>
    )
  }

  const isClosed = posting.status === 'CLOSED'

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="공고 상세" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pb-28 pt-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <h1 className="typography-headline03 text-text-100">
            {posting.title}
          </h1>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <p className="typography-body02-regular text-text-70">
              {posting.workspaceName} · {posting.businessType}
            </p>
            <ManagerPostingStatusBadge status={posting.status} />
          </div>

          {posting.keywords.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {posting.keywords.map(keyword => (
                <span
                  key={keyword}
                  className="rounded-lg bg-main-100 px-2.5 py-1 typography-body03-semibold text-sub"
                >
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <span className="typography-body02-regular text-text-70">급여</span>
          <span className="typography-body01-semibold text-text-100">
            {PAYMENT_TYPE_LABEL[posting.paymentType]}{' '}
            {posting.payAmount.toLocaleString('ko-KR')}원
          </span>
        </section>

        <section>
          <h2 className="mb-2 typography-body02-semibold text-text-100">
            근무일정
          </h2>
          <ul className="flex flex-col gap-2">
            {posting.schedules.map((schedule, index) => (
              <li
                key={schedule.id ?? index}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="typography-body02-semibold text-text-100">
                    {schedule.position || '포지션 미지정'}
                  </span>
                  <span className="typography-body03-regular text-text-70">
                    모집 {schedule.positionsNeeded}명
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 typography-body03-regular text-text-90">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4 text-main" />
                    {formatWorkingDays(schedule.workingDays)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="size-4 text-main" />
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {posting.description ? (
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 typography-body02-semibold text-text-100">
              상세내용
            </h2>
            <p className="whitespace-pre-wrap typography-body02-regular text-text-90">
              {posting.description}
            </p>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() =>
            navigate(managerPostingApplicationsPath(numericPostingId))
          }
          className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-colors hover:bg-bg-light/60"
        >
          <span className="flex items-center gap-2">
            <PersonIcon className="size-5 text-main" />
            <span className="typography-body02-semibold text-text-100">
              지원자 보기
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-main px-1.5 typography-bg text-white">
              {applicantCount}
            </span>
            <ChevronRightIcon className="size-4 text-text-50" />
          </span>
        </button>
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 flex w-full max-w-[428px] -translate-x-1/2 gap-2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        <button
          type="button"
          onClick={() => navigate(managerPostingEditPath(numericPostingId))}
          className="h-12 flex-1 rounded-xl bg-main typography-bt text-white transition-all hover:brightness-[0.94] active:brightness-[0.88]"
        >
          수정
        </button>
        <button
          type="button"
          onClick={openCloseModal}
          disabled={isClosed}
          className="h-12 flex-1 rounded-xl border border-line-1 bg-white typography-bt text-text-90 transition-colors hover:bg-bg-light disabled:cursor-not-allowed disabled:text-text-50"
        >
          {isClosed ? '마감됨' : '모집 마감'}
        </button>
      </div>

      <ConfirmModal
        isOpen={isCloseModalOpen}
        title="모집을 마감할까요?"
        description="마감 후에는 새로운 지원을 받을 수 없어요."
        confirmLabel="모집 마감"
        cancelLabel="취소"
        onConfirm={confirmClose}
        onClose={closeCloseModal}
      />
    </div>
  )
}
