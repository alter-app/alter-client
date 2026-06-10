import { useState } from 'react'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import type { SubstituteDirectionTab } from '@/pages/user/substitute-request/components/SubstituteRequestTabs'
import { Avatar } from '@/shared/ui/common/Avatar'
import { SubstituteRejectReasonModal } from '@/pages/user/substitute-request/components/SubstituteRejectReasonModal'
import { useUserSubstituteRequestDetailViewModel } from '@/features/user/substitute/hooks/useUserSubstituteRequestDetailViewModel'
import type { ReceivedSubstituteRequestDto } from '@/features/user/substitute/types'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { Spinner } from '@/shared/ui/Spinner'

interface SubstituteRequestDetailViewProps {
  requestId: number
  directionTab: SubstituteDirectionTab
  receivedFallback?: ReceivedSubstituteRequestDto
  onBack: () => void
}

function TimeField({
  label,
  hour,
  minute,
}: {
  label: string
  hour: string
  minute: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 typography-body02-semibold text-text-70">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="flex h-12 min-w-[78px] items-center justify-center gap-1 rounded-2xl bg-white typography-body01-semibold text-text-100">
          <span className="text-text-50">{hour}</span>
          <span>시</span>
        </div>
        <span className="text-text-50">:</span>
        <div className="flex h-12 min-w-[78px] items-center justify-center gap-1 rounded-2xl bg-white typography-body01-semibold text-text-100">
          <span className="text-text-50">{minute}</span>
          <span>분</span>
        </div>
      </div>
    </div>
  )
}

export function SubstituteRequestDetailView({
  requestId,
  directionTab,
  receivedFallback,
  onBack,
}: SubstituteRequestDetailViewProps) {
  const direction = directionTab === 'sent' ? 'SENT' : 'RECEIVED'
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  const {
    detail,
    isLoading,
    isError,
    accept,
    reject,
    cancel,
    isAccepting,
    isRejecting,
    isCancelling,
    actionError,
  } = useUserSubstituteRequestDetailViewModel(requestId, direction, {
    receivedFallback,
    onActionSuccess: onBack,
  })

  const showFooter = detail?.canRespond || detail?.canCancel

  return (
    <>
      <div className="fixed inset-0 z-[70] flex min-h-[100dvh] flex-col bg-white">
        <header className="relative flex h-14 shrink-0 items-center px-4">
          <button
            type="button"
            aria-label="뒤로"
            className="flex size-6 items-center justify-center"
            onClick={onBack}
          >
            <img src={ChevronLeftIcon} alt="" className="size-6" />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 typography-headline03 text-text-100">
            대타요청 세부사항
          </h1>
        </header>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : isError || detail == null ? (
          <div className="flex flex-1 items-center justify-center px-4">
            <p className="typography-body02-regular text-text-70">
              상세 정보를 불러오지 못했습니다.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`flex-1 overflow-y-auto px-4 pt-4 ${showFooter ? 'pb-36' : 'pb-8'}`}
            >
              <div className="flex h-[70px] items-center gap-4 rounded-2xl border border-line-1 px-3">
                <Avatar
                  alt={detail.displayName}
                  size={38}
                  className="border border-line-1"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="min-w-0 flex-1 truncate typography-body01-semibold text-text-100">
                      {detail.displayName}
                    </span>
                    <WorkerRoleBadge role={detail.role} />
                  </div>
                </div>
              </div>

              <section className="mt-6 px-2">
                <h2 className="typography-headline03 text-text-100">
                  {detail.dateTitle}
                </h2>
                <p className="mt-1 typography-body02-regular text-text-100">
                  {detail.totalHoursLabel}
                </p>
                <div className="mt-6 flex flex-col gap-4">
                  <TimeField
                    label="출근 시간"
                    hour={detail.startTimeLabel}
                    minute={detail.startMinuteLabel}
                  />
                  <TimeField
                    label="퇴근 시간"
                    hour={detail.endTimeLabel}
                    minute={detail.endMinuteLabel}
                  />
                </div>
              </section>

              <section className="mt-8">
                <h3 className="px-2 typography-headline03 text-text-100">
                  대타요청 사유
                </h3>
                <div className="mt-3 rounded-2xl bg-bg-dark p-4">
                  <p className="typography-body02-regular text-text-50 whitespace-pre-wrap">
                    {detail.reason}
                  </p>
                </div>
              </section>

              {actionError ? (
                <p className="mt-4 px-2 text-center typography-body02-regular text-error">
                  {actionError}
                </p>
              ) : null}
            </div>

            {showFooter ? (
              <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 space-y-3 bg-white px-4 pb-8 pt-3">
                {detail.canRespond ? (
                  <>
                    <button
                      type="button"
                      className="flex h-12 w-full items-center justify-center rounded-2xl bg-main typography-body01-semibold text-white disabled:opacity-50"
                      disabled={isAccepting || isRejecting || isCancelling}
                      onClick={() => accept()}
                    >
                      {isAccepting ? '처리 중…' : '수락'}
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-full items-center justify-center rounded-2xl border border-line-1 bg-white typography-body01-semibold text-text-50 disabled:opacity-50"
                      disabled={isAccepting || isRejecting || isCancelling}
                      onClick={() => setRejectModalOpen(true)}
                    >
                      거절
                    </button>
                  </>
                ) : null}
                {detail.canCancel ? (
                  <button
                    type="button"
                    className="flex h-12 w-full items-center justify-center rounded-2xl border border-line-1 bg-white typography-body01-semibold text-text-50 disabled:opacity-50"
                    disabled={isCancelling}
                    onClick={() => cancel()}
                  >
                    {isCancelling ? '처리 중…' : '요청 취소'}
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>

      <SubstituteRejectReasonModal
        open={rejectModalOpen}
        pending={isRejecting}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={reason => {
          reject(reason)
          setRejectModalOpen(false)
        }}
      />
    </>
  )
}
