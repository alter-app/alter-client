import { useParams } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Spinner } from '@/shared/ui/Spinner'
import { useStoreRegisterRequestDetailViewModel } from '@/features/store-register/hooks/useStoreRegisterRequestDetailViewModel'
import { StoreRequestStatusBadge } from '@/features/store-register/ui/StoreRequestStatusBadge'
import { RequestInfoSection } from '@/features/store-register/ui/RequestInfoSection'
import { RequestDocumentsSection } from '@/features/store-register/ui/RequestDocumentsSection'
import { RequestThreadSection } from '@/features/store-register/ui/RequestThreadSection'
import { ClockIcon, XCircleIcon } from '@/features/store-register/ui/icons'
import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'

export function StoreRegisterRequestDetailPage() {
  const params = useParams<{ requestId: string }>()
  const requestId = Number(params.requestId)
  const vm = useStoreRegisterRequestDetailViewModel(requestId)
  const detail = vm.detail
  const statusValue = detail?.status.value
  const isCanceled = statusValue === 'CANCELLED'
  const canCancel = statusValue === 'PENDING' || statusValue === 'REVOKED'

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="신청 상세" />

      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-10 pt-5">
        {vm.isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : null}

        {vm.isError ? (
          <p
            className="mt-10 text-center typography-body02-regular text-error"
            role="alert"
          >
            신청 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : null}

        {detail ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2">
                <StoreRequestStatusBadge status={detail.status} />
                <span className="typography-body03-regular text-text-50">
                  {formatRequestDateTime(detail.createdAt)} 신청
                </span>
              </div>
              {canCancel ? (
                <button
                  type="button"
                  onClick={vm.openCancelConfirm}
                  className="h-8 shrink-0 rounded-lg border border-line-2 bg-white px-3 typography-body03-semibold text-text-90"
                >
                  신청 취소
                </button>
              ) : null}
            </div>

            {isCanceled ? (
              <>
                <div className="flex items-center gap-2.5 rounded-xl bg-bg-dark px-4 py-3.5">
                  <XCircleIcon className="size-5 shrink-0 text-text-50" />
                  <p className="typography-body02-regular text-text-70">
                    취소된 신청입니다. 별도 조치가 필요하지 않아요.
                  </p>
                </div>
                <div className="flex flex-col gap-5 opacity-60">
                  <RequestInfoSection detail={detail} />
                  <RequestDocumentsSection detail={detail} />
                </div>
              </>
            ) : (
              <>
                <RequestInfoSection detail={detail} />
                <RequestDocumentsSection detail={detail} />

                {statusValue === 'PENDING' ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-2.5 rounded-xl bg-warning-100 px-4 py-3.5">
                      <ClockIcon className="size-5 mt-px shrink-0 text-warning" />
                      <p className="typography-body02-regular text-text-100">
                        관리자가 검토 중이에요.{' '}
                        <span className="typography-body02-semibold text-warning">
                          영업일 3일 이내
                        </span>
                        에 결과를 푸시 알림으로 알려드릴게요.
                      </p>
                    </div>
                    <RequestThreadSection
                      requestId={requestId}
                      variant="PENDING"
                    />
                  </div>
                ) : null}

                {statusValue === 'REVOKED' ? (
                  <RequestThreadSection
                    requestId={requestId}
                    variant="REVOKED"
                  />
                ) : null}

                {statusValue === 'ACTIVATED' ? (
                  <RequestThreadSection
                    requestId={requestId}
                    variant="ACTIVATED"
                  />
                ) : null}
              </>
            )}

            {vm.cancelError ? (
              <p className="typography-body02-regular text-error" role="alert">
                {vm.cancelError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <ConfirmModal
        isOpen={vm.isConfirmOpen}
        title="신청을 취소할까요?"
        description="취소하면 검토가 중단되며, 다시 신청하려면 처음부터 작성해야 해요."
        confirmLabel="신청 취소"
        cancelLabel="닫기"
        isPending={vm.isCanceling}
        onConfirm={vm.confirmCancel}
        onClose={vm.closeCancelConfirm}
      />
    </div>
  )
}

export default StoreRegisterRequestDetailPage
