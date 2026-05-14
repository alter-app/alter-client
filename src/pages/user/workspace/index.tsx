import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { WorkingStoreCard, useWorkspacesViewModel } from '@/features/user'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'

export function WorkspacePage() {
  const navigate = useNavigate()
  const {
    workspaces,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useWorkspacesViewModel()

  if (isError) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-bg-light">
        <Navbar variant="detail" title="근무중인 가게" />
        <div className="flex flex-1 items-center justify-center">
          <p className="typography-body02-regular text-text-70">
            데이터를 불러오는 데 실패했습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="근무중인 가게" />
      <div className="flex flex-col gap-3 w-full max-w-[390px] mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="typography-body02-regular text-text-70">로딩 중...</p>
          </div>
        ) : (
          <>
            {workspaces.map(store => (
              <button
                key={store.workspaceId}
                type="button"
                className="rounded-2xl bg-white py-[11px] text-left"
                onClick={() =>
                  navigate(`/user/workspace/${store.workspaceId}`, {
                    state: { businessName: store.businessName },
                  })
                }
              >
                <WorkingStoreCard store={store} />
              </button>
            ))}
            {workspaces.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-10 px-4 text-center">
                <p className="typography-body02-regular text-text-70">
                  근무중인 가게가 없습니다.
                </p>
                <button
                  type="button"
                  className="rounded-xl bg-main px-5 py-3 typography-body02-semibold text-white"
                  onClick={() => navigate('/user/workspace/join')}
                >
                  업장 합류하기
                </button>
              </div>
            )}
            {shouldShowInfiniteListLoadMore(hasNextPage, totalCount) && (
              <button
                type="button"
                className="typography-body02-regular py-3 text-center text-text-70"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
