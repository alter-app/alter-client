import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import {
  ROUTES,
  storeRegisterRequestDetailPath,
} from '@/shared/constants/routes'
import { useStoreRegisterRequestsViewModel } from '@/features/store-register/hooks/useStoreRegisterRequestsViewModel'
import { StoreRequestListCard } from '@/features/store-register/ui/StoreRequestListCard'

export function StoreRegisterRequestsPage() {
  const navigate = useNavigate()
  const { requests, isLoading, isError } = useStoreRegisterRequestsViewModel()

  const goNewRequest = () => navigate(ROUTES.MANAGER.STORE_REGISTER)
  const isEmpty = !isLoading && !isError && requests.length === 0

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="업장 등록 신청 내역" />

      <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-10 pt-4">
        {isLoading ? (
          <p
            className="mt-10 text-center typography-body02-regular text-text-70"
            role="status"
          >
            신청 내역을 불러오는 중입니다.
          </p>
        ) : null}

        {isError ? (
          <p
            className="mt-10 text-center typography-body02-regular text-error"
            role="alert"
          >
            신청 내역을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        ) : null}

        {isEmpty ? (
          <div className="mt-16 flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div>
              <p className="mb-2 typography-headline03 text-text-100">
                아직 신청한 업장이 없어요
              </p>
              <p className="typography-body02-regular text-text-70">
                업장 등록을 신청하고 승인되면 사장님 계정으로 전환돼요.
              </p>
            </div>
            <AuthButton
              type="button"
              style={{ width: '100%' }}
              onClick={goNewRequest}
            >
              새 업장 등록 신청
            </AuthButton>
          </div>
        ) : null}

        {!isLoading && !isError && requests.length > 0 ? (
          <>
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
            <div className="mt-8">
              <AuthButton
                type="button"
                style={{ width: '100%' }}
                onClick={goNewRequest}
              >
                새 업장 등록 신청
              </AuthButton>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default StoreRegisterRequestsPage
