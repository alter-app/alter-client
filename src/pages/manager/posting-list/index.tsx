import { useNavigate } from 'react-router-dom'

import WriteIcon from '@/assets/icons/posting/Write.svg?react'
import { usePostingListViewModel } from '@/features/manager/posting/hooks/usePostingListViewModel'
import { POSTING_STATUS_FILTER_OPTIONS } from '@/features/manager/posting/lib/postingStatus'
import { FilterBar } from '@/features/manager/posting/ui/FilterBar'
import { PostingListCard } from '@/features/manager/posting/ui/PostingListCard'
import { managerPostingDetailPath, ROUTES } from '@/shared/constants/routes'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Skeleton } from '@/shared/ui/common/Skeleton'

function PostingListSkeleton() {
  return (
    <ul className="flex flex-col gap-3">
      {[0, 1, 2].map(index => (
        <li key={index} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="mb-4 h-4 w-48" />
          <Skeleton className="ml-auto h-5 w-24" />
        </li>
      ))}
    </ul>
  )
}

/** SCREEN 5 · 내 공고 목록 — 사장님 알바찾기(내 공고) 탭 진입점 */
export function ManagerPostingListPage() {
  const navigate = useNavigate()
  const {
    postings,
    totalCount,
    isLoading,
    isEmpty,
    workspaceFilter,
    setWorkspaceFilter,
    statusFilter,
    setStatusFilter,
    workspaceOptions,
  } = usePostingListViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="내 공고"
        showBack={false}
        rightAction={
          <button
            type="button"
            aria-label="공고 작성"
            onClick={() => navigate(ROUTES.MANAGER.POSTING_NEW)}
            className="flex h-6 w-6 items-center justify-center text-text-100 transition-colors hover:text-main"
          >
            <WriteIcon className="h-6 w-6" />
          </button>
        }
      />

      {/* 하단 Docbar(h-14)에 가리지 않도록 여유 패딩 */}
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pb-24 pt-4">
        <FilterBar
          workspaceOptions={workspaceOptions}
          workspaceValue={workspaceFilter}
          onWorkspaceChange={setWorkspaceFilter}
          statusOptions={POSTING_STATUS_FILTER_OPTIONS}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          totalCount={totalCount}
        />

        {isLoading ? <PostingListSkeleton /> : null}

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16">
            <p className="typography-body01-semibold text-text-100">
              등록된 공고가 없어요
            </p>
            <p className="typography-body02-regular text-center text-text-70">
              필터를 바꾸거나 새 공고를 등록해 보세요.
            </p>
          </div>
        ) : null}

        {!isLoading && postings.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {postings.map(posting => (
              <li key={posting.id}>
                <PostingListCard
                  posting={posting}
                  onClick={() => navigate(managerPostingDetailPath(posting.id))}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </div>
  )
}
