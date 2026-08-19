import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { useRemoveFavoritePosting } from '@/features/job-lookup-map/hooks/useRemoveFavoritePosting'
import { useScrappedPostings } from '@/features/job-lookup-map/hooks/useScrappedPostings'
import { formatPostedAgo } from '@/features/job-lookup-map/lib/postingToAlbaboxProps'
import { ScrappedPostingCard } from '@/pages/my/scrapped/components/ScrappedPostingCard'
import { ROUTES } from '@/shared/constants/routes'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import { Spinner } from '@/shared/ui/Spinner'

export function ScrappedPostingsPage() {
  const navigate = useNavigate()
  const { mutate: removeFavorite, isPending: isRemoving } =
    useRemoveFavoritePosting()
  const [pendingPostingId, setPendingPostingId] = useState<number | null>(null)

  const {
    favorites,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useScrappedPostings()

  const handleConfirmRemove = () => {
    if (pendingPostingId == null) return
    removeFavorite(pendingPostingId, {
      onSettled: () => setPendingPostingId(null),
    })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <div className="sticky top-0 z-10 bg-white">
        <Navbar variant="detail" title="스크랩한 알바" />
      </div>

      <div className="mx-auto w-full flex-1 px-4 py-4">
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
          <div className="flex flex-col gap-3">
            {favorites.map(item => (
              <ScrappedPostingCard
                key={item.id}
                storeName={item.posting.businessName}
                title={item.posting.title}
                wageAmount={item.posting.payAmount.toLocaleString('ko-KR')}
                savedAgoLabel={`${formatPostedAgo(item.createdAt)} 저장`}
                onBookmarkClick={() => setPendingPostingId(item.posting.id)}
                onClick={() =>
                  navigate(
                    generatePath(ROUTES.USER.JOB_LOOKUP_MAP_DETAIL, {
                      postingId: String(item.posting.id),
                    })
                  )
                }
              />
            ))}
            {shouldShowInfiniteListLoadMore(hasNextPage, totalCount) && (
              <MoreButton
                className="mt-1"
                label={isFetchingNextPage ? '불러오는 중...' : '더보기'}
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingPostingId != null}
        title="스크랩을 해제할까요?"
        description="해제하면 목록에서 사라집니다."
        confirmLabel="해제"
        cancelLabel="취소"
        isPending={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => {
          if (!isRemoving) setPendingPostingId(null)
        }}
      />
    </div>
  )
}

export default ScrappedPostingsPage
