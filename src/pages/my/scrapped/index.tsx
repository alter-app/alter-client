import { generatePath, useNavigate } from 'react-router-dom'
import { AlbaFindList } from '@/features/job-lookup-map/common/AlbaFindList'
import { Albabox } from '@/features/job-lookup-map/common/Albabox'
import { useScrappedPostings } from '@/features/job-lookup-map/hooks/useScrappedPostings'
import { favoritePostingToAlbaboxProps } from '@/features/job-lookup-map/lib/postingToAlbaboxProps'
import { ROUTES } from '@/shared/constants/routes'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'
import { Navbar } from '@/shared/ui/common/Navbar'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import { Spinner } from '@/shared/ui/Spinner'

export function ScrappedPostingsPage() {
  const navigate = useNavigate()

  const {
    favorites,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useScrappedPostings()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="스크랩한 알바" />
      </div>

      <div className="mx-auto w-full max-w-[390px] flex-1 px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : isError ? (
          <p className="py-16 text-center typography-body02-regular text-text-50">
            스크랩한 알바를 불러오지 못했습니다.
          </p>
        ) : favorites.length === 0 ? (
          <p className="py-16 text-center typography-body02-regular text-text-50">
            스크랩한 알바가 없습니다.
          </p>
        ) : (
          <AlbaFindList className="gap-0">
            {favorites.map(item => {
              const base = favoritePostingToAlbaboxProps(item)
              return (
                <Albabox
                  key={item.id}
                  {...base}
                  saved
                  onClick={() =>
                    navigate(
                      generatePath(ROUTES.USER.JOB_LOOKUP_MAP_DETAIL, {
                        postingId: String(item.posting.id),
                      })
                    )
                  }
                />
              )
            })}
            {shouldShowInfiniteListLoadMore(hasNextPage, totalCount) && (
              <MoreButton
                className="mt-4"
                label={isFetchingNextPage ? '불러오는 중...' : '더보기'}
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
              />
            )}
          </AlbaFindList>
        )}
      </div>
    </div>
  )
}

export default ScrappedPostingsPage
