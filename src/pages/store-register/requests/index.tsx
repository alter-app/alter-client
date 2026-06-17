import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import {
  ROUTES,
  storeRegisterRequestDetailPath,
} from '@/shared/constants/routes'
import { useStoreRegisterRequestsViewModel } from '@/features/store-register/hooks/useStoreRegisterRequestsViewModel'
import { StoreRequestListCard } from '@/features/store-register/ui/StoreRequestListCard'
import { RequestListSkeleton } from '@/features/store-register/ui/RequestListSkeleton'
import {
  AlertCircleIcon,
  DocPlusIcon,
  PlusIcon,
  RefreshIcon,
} from '@/features/store-register/ui/icons'

export function StoreRegisterRequestsPage() {
  const navigate = useNavigate()
  const { requests, isLoading, isError, refetch } =
    useStoreRegisterRequestsViewModel()

  const goNewRequest = () => navigate(ROUTES.MANAGER.STORE_REGISTER)
  const isEmpty = !isLoading && !isError && requests.length === 0
  const hasRequests = !isLoading && !isError && requests.length > 0

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="업장 등록 신청 내역" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        {isLoading ? <RequestListSkeleton /> : null}

        {isError ? (
          <div
            className="flex flex-1 flex-col items-center justify-center gap-2 text-center"
            role="alert"
          >
            <span className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-bg-dark text-text-70">
              <AlertCircleIcon className="size-[34px]" />
            </span>
            <p className="typography-body01-semibold text-text-100">
              목록을 불러오지 못했어요
            </p>
            <p className="max-w-[240px] typography-body02-regular text-text-70">
              네트워크 연결을 확인한 뒤 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3.5 flex h-12 items-center justify-center gap-2 rounded-xl border border-line-2 bg-white px-6 typography-body02-semibold text-text-90"
            >
              <RefreshIcon className="size-[18px]" />
              다시 시도
            </button>
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <span className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-main-100 text-main">
              <DocPlusIcon className="size-9" />
            </span>
            <p className="typography-body01-semibold text-text-100">
              아직 등록 신청 내역이 없어요
            </p>
            <p className="max-w-[240px] typography-body02-regular text-text-70">
              업장을 등록하고 관리자 승인 후 사장님 계정으로 전환해 보세요.
            </p>
          </div>
        ) : null}

        {hasRequests ? (
          <ul className="flex flex-col gap-3">
            {requests.map(item => (
              <li key={item.id}>
                <StoreRequestListCard
                  item={item}
                  onClick={() =>
                    navigate(storeRegisterRequestDetailPath(item.id))
                  }
                />
              </li>
            ))}
          </ul>
        ) : null}
      </main>

      {isEmpty || hasRequests ? (
        <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
          <AuthButton
            type="button"
            className="flex items-center justify-center gap-2"
            onClick={goNewRequest}
          >
            {hasRequests ? <PlusIcon /> : null}
            {hasRequests ? '새 업장 등록 신청' : '업장 등록 신청하기'}
          </AuthButton>
        </div>
      ) : null}
    </div>
  )
}

export default StoreRegisterRequestsPage
