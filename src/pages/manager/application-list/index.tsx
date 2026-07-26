import { useNavigate, useSearchParams } from 'react-router-dom'

import { useApplicationListViewModel } from '@/features/manager/posting/hooks/useApplicationListViewModel'
import { APPLICATION_STATUS_FILTER_OPTIONS } from '@/features/manager/posting/lib/applicationStatus'
import { ApplicantCard } from '@/features/manager/posting/ui/ApplicantCard'
import { FilterBar } from '@/features/manager/posting/ui/FilterBar'
import PersonIcon from '@/assets/icons/posting/Person.svg?react'
import { managerPostingApplicationDetailPath } from '@/shared/constants/routes'
import { MoreButton } from '@/shared/ui/common/MoreButton'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Skeleton } from '@/shared/ui/common/Skeleton'

function ApplicantListSkeleton() {
  return (
    <ul className="flex flex-col gap-3">
      {[0, 1, 2].map(index => (
        <li key={index} className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="mb-4 flex items-center gap-2.5">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-44" />
        </li>
      ))}
    </ul>
  )
}

/** SCREEN 2 · 지원자 목록 */
export function ManagerApplicationListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 공고 상세 → '지원자 보기'로 진입한 경우 해당 공고로 한정
  const postingIdParam = searchParams.get('postingId')
  const postingId = postingIdParam ? Number(postingIdParam) : undefined

  const {
    applications,
    totalCount,
    isLoading,
    isEmpty,
    hasNextPage,
    fetchNextPage,
    workspaceFilter,
    setWorkspaceFilter,
    statusFilter,
    setStatusFilter,
    workspaceOptions,
  } = useApplicationListViewModel({ postingId })

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="지원자 목록" />

      {/* 하단 Docbar(h-14)에 가리지 않도록 여유 패딩 */}
      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pb-24 pt-4">
        <FilterBar
          workspaceOptions={workspaceOptions}
          workspaceValue={workspaceFilter}
          onWorkspaceChange={setWorkspaceFilter}
          statusOptions={APPLICATION_STATUS_FILTER_OPTIONS}
          statusValue={statusFilter}
          onStatusChange={setStatusFilter}
          totalCount={totalCount}
        />

        {isLoading ? <ApplicantListSkeleton /> : null}

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
            <span className="flex size-16 items-center justify-center rounded-full bg-main-100">
              <PersonIcon className="size-7 text-main" />
            </span>
            <p className="typography-body01-semibold text-text-100">
              조건에 맞는 지원자가 없어요
            </p>
            <p className="typography-body02-regular text-center text-text-70">
              필터를 바꾸거나 공고를 새로 등록해 지원자를
              <br />
              기다려 보세요.
            </p>
          </div>
        ) : null}

        {!isLoading && applications.length > 0 ? (
          <>
            <ul className="flex flex-col gap-3">
              {applications.map(application => (
                <li key={application.id}>
                  <ApplicantCard
                    application={application}
                    onClick={() =>
                      navigate(
                        managerPostingApplicationDetailPath(application.id)
                      )
                    }
                  />
                </li>
              ))}
            </ul>
            {hasNextPage ? <MoreButton onClick={fetchNextPage} /> : null}
          </>
        ) : null}
      </main>
    </div>
  )
}
