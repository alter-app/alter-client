import { useParams } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { useStoreRegisterRequestDetailViewModel } from '@/features/store-register/hooks/useStoreRegisterRequestDetailViewModel'
import { StoreRequestStatusBadge } from '@/features/store-register/ui/StoreRequestStatusBadge'
import { RequestInfoSection } from '@/features/store-register/ui/RequestInfoSection'
import { RequestDocumentsSection } from '@/features/store-register/ui/RequestDocumentsSection'
import { ReasonSection } from '@/features/store-register/ui/ReasonSection'
import { formatRequestDate } from '@/features/store-register/lib/formatDate'

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 w-full rounded-xl border border-line-2 bg-white typography-body01-semibold text-text-70"
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

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="신청 상세" />

      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-10 pt-4">
        {vm.isLoading ? (
          <p
            className="mt-10 text-center typography-body02-regular text-text-70"
            role="status"
          >
            신청 정보를 불러오는 중입니다.
          </p>
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
            <div className="flex items-center justify-between">
              <StoreRequestStatusBadge status={detail.status} />
              <span className="typography-body02-regular text-text-50">
                신청일 {formatRequestDate(detail.createdAt)}
              </span>
            </div>

            <RequestInfoSection detail={detail} />
            <RequestDocumentsSection detail={detail} />

            {statusValue === 'PENDING' ? (
              <div className="flex flex-col gap-3">
                <p className="rounded-2xl bg-white px-5 py-4 typography-body02-regular text-text-70 shadow-sm">
                  운영자 검토 중입니다. 영업일 1일 이내 결과를 알려드려요.
                </p>
                <CancelButton onClick={vm.openCancelConfirm} />
              </div>
            ) : null}

            {statusValue === 'ACTIVATED' ? (
              <div className="flex flex-col gap-3">
                <p className="rounded-2xl bg-main-100 px-5 py-4 typography-body02-regular text-sub shadow-sm">
                  승인이 완료됐어요. 사장님 계정으로 다시 로그인하면 매장 관리를
                  시작할 수 있어요.
                </p>
                <AuthButton
                  type="button"
                  style={{ width: '100%' }}
                  onClick={() => vm.reLogin()}
                >
                  사장님 계정으로 다시 로그인
                </AuthButton>
              </div>
            ) : null}

            {statusValue === 'REVOKED' ? (
              <div className="flex flex-col gap-5">
                <ReasonSection requestId={requestId} />
                <CancelButton onClick={vm.openCancelConfirm} />
              </div>
            ) : null}

            {statusValue === 'CANCELED' ? (
              <p className="rounded-2xl bg-white px-5 py-4 typography-body02-regular text-text-70 shadow-sm">
                취소된 신청입니다.
              </p>
            ) : null}

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
        description="취소하면 되돌릴 수 없어요. 다시 신청하려면 새로 작성해야 해요."
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
