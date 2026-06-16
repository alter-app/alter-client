import { useParams } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Spinner } from '@/shared/ui/Spinner'
import { useStoreRegisterRequestDetailViewModel } from '@/features/store-register/hooks/useStoreRegisterRequestDetailViewModel'
import { StoreRequestStatusBadge } from '@/features/store-register/ui/StoreRequestStatusBadge'
import { RequestInfoSection } from '@/features/store-register/ui/RequestInfoSection'
import { RequestDocumentsSection } from '@/features/store-register/ui/RequestDocumentsSection'
import { ReasonSection } from '@/features/store-register/ui/ReasonSection'
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@/features/store-register/ui/icons'
import { formatRequestDateTime } from '@/features/store-register/lib/formatDate'

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-14 w-full shrink-0 rounded-xl border border-line-2 bg-white typography-body01-semibold text-text-90"
    >
      신청 취소
    </button>
  )
}

export function StoreRegisterRequestDetailPage() {
  const params = useParams<{ requestId: string }>()
  const requestId = Number(params.requestId)
  const vm = useStoreRegisterRequestDetailViewModel(requestId)
  const detail = vm.detail
  const statusValue = detail?.status.value
  const isCanceled = statusValue === 'CANCELED'

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
            <div className="flex flex-col gap-2">
              <StoreRequestStatusBadge status={detail.status} />
              <span className="typography-body03-regular text-text-50">
                {formatRequestDateTime(detail.createdAt)} 신청
              </span>
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
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5 rounded-xl bg-warning-100 px-4 py-3.5">
                      <ClockIcon className="size-5 mt-px shrink-0 text-warning" />
                      <p className="typography-body02-regular text-text-100">
                        운영자가 검토 중이에요.{' '}
                        <span className="typography-body02-semibold text-warning">
                          영업일 1일 이내
                        </span>
                        에 결과를 알려드릴게요.
                      </p>
                    </div>
                    <CancelButton onClick={vm.openCancelConfirm} />
                  </div>
                ) : null}

                {statusValue === 'ACTIVATED' ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5 rounded-xl bg-main-100 px-4 py-3.5">
                      <CheckCircleIcon className="size-5 mt-px shrink-0 text-main" />
                      <p className="typography-body02-regular text-text-100">
                        승인이 완료됐어요.{' '}
                        <span className="typography-body02-semibold text-main">
                          사장님 계정
                        </span>
                        으로 다시 로그인해 주세요.
                      </p>
                    </div>
                    <AuthButton
                      type="button"
                      style={{ width: '100%' }}
                      onClick={() => vm.reLogin()}
                    >
                      사장님 계정으로 로그인
                    </AuthButton>
                  </div>
                ) : null}

                {statusValue === 'REVOKED' ? (
                  <div className="flex flex-col gap-5">
                    <ReasonSection requestId={requestId} />
                    <CancelButton onClick={vm.openCancelConfirm} />
                  </div>
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
