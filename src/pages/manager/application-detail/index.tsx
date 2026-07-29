import { useParams } from 'react-router-dom'

import { useApplicationDetailViewModel } from '@/features/manager/posting/hooks/useApplicationDetailViewModel'
import { HiringActionBar } from '@/features/manager/posting/ui/HiringActionBar'
import { ManagerApplicationStatusBadge } from '@/features/manager/posting/ui/ManagerApplicationStatusBadge'
import CheckCircleIcon from '@/assets/icons/posting/CheckCircle.svg?react'
import {
  formatTimeRange,
  formatWorkingDays,
  type ApplicationStatus,
} from '@/features/manager/posting/types/posting'
import { resolveApplicationStatusBadge } from '@/features/manager/posting/lib/applicationStatus'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Skeleton } from '@/shared/ui/common/Skeleton'

function InfoRow({
  label,
  value,
  isLast = false,
}: {
  label: string
  value: string
  isLast?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        isLast ? '' : 'border-b border-line-1'
      }`}
    >
      <span className="typography-body02-regular text-text-70">{label}</span>
      <span className="typography-body02-semibold text-text-100">{value}</span>
    </div>
  )
}

function TerminalNotice({ status }: { status: ApplicationStatus }) {
  const { label } = resolveApplicationStatusBadge(status)
  const isAccepted = status === 'ACCEPTED'

  return (
    <div
      className={`flex items-start gap-2 rounded-2xl p-4 ${
        isAccepted ? 'bg-main-100' : 'bg-bg-dark'
      }`}
    >
      <CheckCircleIcon
        className={`mt-0.5 size-4 shrink-0 ${
          isAccepted ? 'text-main' : 'text-text-50'
        }`}
      />
      <p className="typography-body02-regular text-text-90">
        이미 <span className="typography-body02-semibold">{label}</span>{' '}
        {isAccepted
          ? '처리되어 근무자로 등록됐어요. 상태를 더 이상 변경할 수 없어요.'
          : '처리된 지원서예요. 상태를 더 이상 변경할 수 없어요.'}
      </p>
    </div>
  )
}

export function ManagerApplicationDetailPage() {
  const { applicationId } = useParams()
  const numericApplicationId = Number(applicationId)

  const {
    application,
    isLoading,
    isNotFound,
    canDecide,
    pendingDecision,
    decisionCopy,
    requestDecision,
    cancelDecision,
    confirmDecision,
  } = useApplicationDetailViewModel(numericApplicationId)

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="지원자 상세" />
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pt-4">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </main>
      </div>
    )
  }

  if (isNotFound || !application) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="지원자 상세" />
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body02-regular text-text-70">
            지원서를 찾을 수 없어요.
          </p>
        </main>
      </div>
    )
  }

  const { applicant, schedule } = application

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="지원자 상세" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pb-32 pt-4">
        <section className="flex items-center gap-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-main-100 typography-headline03 text-sub"
            aria-hidden="true"
          >
            {applicant.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="typography-headline03 text-text-100">
                {applicant.name}
              </h1>
              <ManagerApplicationStatusBadge status={application.status} />
            </div>
            <p className="mt-0.5 typography-body03-regular text-text-70">
              {application.workspaceName} ·{' '}
              {formatWorkingDays(schedule.workingDays)}{' '}
              {formatTimeRange(schedule.startTime, schedule.endTime)}
              {schedule.position ? ` · ${schedule.position}` : ''}
            </p>
          </div>
        </section>

        {!canDecide ? <TerminalNotice status={application.status} /> : null}

        <section className="rounded-2xl bg-white px-4 shadow-sm">
          <InfoRow label="연락처" value={applicant.phoneNumber} />
          <InfoRow label="생년월일" value={applicant.birthDate} />
          <InfoRow label="성별" value={applicant.gender} />
          <InfoRow label="이메일" value={applicant.email} isLast />
        </section>

        {applicant.certificates.length > 0 ? (
          <section>
            <h2 className="mb-2 typography-body02-semibold text-text-100">
              보유 자격증
            </h2>
            <ul className="rounded-2xl bg-white px-4 shadow-sm">
              {applicant.certificates.map((certificate, index) => (
                <li
                  key={`${certificate.name}-${index}`}
                  className={`flex items-center justify-between py-3 ${
                    index === applicant.certificates.length - 1
                      ? ''
                      : 'border-b border-line-1'
                  }`}
                >
                  <div>
                    <p className="typography-body02-semibold text-text-100">
                      {certificate.name}
                    </p>
                    <p className="typography-body03-regular text-text-70">
                      {certificate.issuer}
                    </p>
                  </div>
                  <span className="typography-body03-regular text-text-70">
                    {certificate.acquiredAt}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="mb-2 typography-body02-semibold text-text-100">
            지원 메시지
          </h2>
          <p className="whitespace-pre-wrap rounded-2xl bg-white p-4 typography-body02-regular text-text-90 shadow-sm">
            {application.description}
          </p>
        </section>
      </main>

      <HiringActionBar canDecide={canDecide} onDecide={requestDecision} />

      <ConfirmModal
        isOpen={pendingDecision !== null}
        title={decisionCopy?.title ?? ''}
        description={decisionCopy?.description}
        confirmLabel="확인"
        cancelLabel="취소"
        onConfirm={confirmDecision}
        onClose={cancelDecision}
      />
    </div>
  )
}
