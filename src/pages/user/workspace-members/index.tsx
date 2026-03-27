import { useParams } from 'react-router-dom'
import { Spinner } from '@/shared/ui/Spinner'
import { useWorkspaceMembers } from './hooks/useWorkspaceMembers'
import { ManagersSection } from './components/ManagersSection'
import { WorkersSection } from './components/WorkersSection'

export function WorkspaceMembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const {
    isWorkspaceIdInvalid,
    isLoading,
    hasError,
    workers,
    managers,
    hasMoreWorkers,
    hasMoreManagers,
    loadMoreWorkers,
    loadMoreManagers,
  } = useWorkspaceMembers({
    workspaceId,
    initialPageSize: 3,
    loadMorePageSize: 10,
  })

  return (
    <div className="min-h-screen bg-bg-light">
      <header className="sticky top-0 z-10 bg-white border-b border-line-1 px-4 py-3">
        <h1 className="font-pretendard font-semibold text-5 text-text-100">
          함께 일하는 사람들
        </h1>
      </header>

      <div className="px-3 pt-5 pb-6">
        {isWorkspaceIdInvalid && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
            <p className="font-pretendard text-3 text-text-70 m-0">
              워크스페이스 ID가 유효하지 않습니다. 올바른 경로로 다시
              접근해주세요.
            </p>
          </div>
        )}

        {!isWorkspaceIdInvalid && isLoading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spinner />
          </div>
        )}

        {!isWorkspaceIdInvalid && hasError && !isLoading && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
            <p className="font-pretendard text-3 text-red-500 m-0">
              함께 일하는 사람들 목록을 불러오는 중 오류가 발생했습니다. 잠시 후
              다시 시도해주세요.
            </p>
          </div>
        )}

        {!isWorkspaceIdInvalid &&
          !isLoading &&
          !hasError &&
          workers.length === 0 &&
          managers.length === 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
              <p className="font-pretendard text-3 text-text-70 m-0">
                현재 이 워크스페이스에 등록된 근무자 또는 점주/매니저가
                없습니다.
              </p>
            </div>
          )}

        {!isWorkspaceIdInvalid &&
          !isLoading &&
          !hasError &&
          (workers.length > 0 || managers.length > 0) && (
            <div className="flex flex-col gap-4">
              <ManagersSection
                managers={managers}
                hasMore={hasMoreManagers}
                onLoadMore={loadMoreManagers}
              />
              <WorkersSection
                workers={workers}
                hasMore={hasMoreWorkers}
                onLoadMore={loadMoreWorkers}
              />
            </div>
          )}
      </div>
    </div>
  )
}

export default WorkspaceMembersPage
