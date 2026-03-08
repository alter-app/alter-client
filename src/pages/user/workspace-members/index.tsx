import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { Spinner } from '@/shared/ui/Spinner'
import { useWorkspaceWorkersQuery } from '@/shared/hooks/useWorkspaceWorkersQuery'
import { useWorkspaceManagersQuery } from '@/shared/hooks/useWorkspaceManagersQuery'

export function WorkspaceMembersPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  const numericWorkspaceId = useMemo(() => {
    const parsed = Number(workspaceId)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  }, [workspaceId])

  const {
    workers,
    isLoading: workersLoading,
    error: workersError,
  } = useWorkspaceWorkersQuery({
    workspaceId: numericWorkspaceId,
    pageSize: 50,
  })

  const {
    managers,
    isLoading: managersLoading,
    error: managersError,
  } = useWorkspaceManagersQuery({
    workspaceId: numericWorkspaceId,
    pageSize: 50,
  })

  const isLoading = workersLoading || managersLoading
  const hasError = workersError || managersError

  const isWorkspaceIdInvalid = !numericWorkspaceId

  return (
    <MobileLayout>
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
                함께 일하는 사람들 목록을 불러오는 중 오류가 발생했습니다.
                잠시 후 다시 시도해주세요.
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
                {managers.length > 0 && (
                  <section className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
                    <h2 className="font-pretendard font-semibold text-4 text-text-100 mb-3">
                      점주 / 매니저
                    </h2>
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                      {managers.map(manager => (
                        <li
                          key={manager.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-light"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-pretendard font-semibold text-3 text-text-100">
                              {manager.manager.name}
                            </span>
                            <span className="font-pretendard text-2 text-text-70">
                              {manager.position.emoji}{' '}
                              {manager.position.description ||
                                manager.position.type}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {workers.length > 0 && (
                  <section className="bg-white rounded-2xl p-5 shadow-sm border border-line-1">
                    <h2 className="font-pretendard font-semibold text-4 text-text-100 mb-3">
                      근무자
                    </h2>
                    <ul className="list-none p-0 m-0 flex flex-col gap-3">
                      {workers.map(worker => (
                        <li
                          key={worker.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl bg-bg-light"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-pretendard font-semibold text-3 text-text-100">
                              {worker.user.name}
                            </span>
                            <span className="font-pretendard text-2 text-text-70">
                              {worker.position.emoji}{' '}
                              {worker.position.description ||
                                worker.position.type}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-pretendard text-[11px] text-text-50">
                              입사일 {worker.employedAt}
                            </span>
                            {worker.nextShiftDateTime && (
                              <span className="font-pretendard text-[11px] text-primary-600">
                                다음 근무 예정: {worker.nextShiftDateTime}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
        </div>
      </div>
    </MobileLayout>
  )
}

export default WorkspaceMembersPage

