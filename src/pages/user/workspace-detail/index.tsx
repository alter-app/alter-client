import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Navbar } from '@/shared/ui/common/Navbar'
import {
  HomeScheduleCalendar,
  useWorkspacesViewModel,
  useWorkspaceManagersViewModel,
  useWorkspaceWorkersViewModel,
  useWorkspaceScheduleViewModel,
} from '@/features/user'
import { shouldShowInfiniteListLoadMore } from '@/shared/lib/listLoadMoreVisibility'
import { WorkerListItem } from '@/shared/ui/home/WorkerListItem'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { useResignWorkspaceMutation } from '@/features/user/home/workspace/hooks/mutation/useResignWorkspaceMutation'
import CrownIcon from '@/assets/icons/home/crown-solid.svg'
import UsersIcon from '@/assets/icons/home/users.svg'

function formatNextShift(isoDate: string | null | undefined) {
  if (isoDate == null || isoDate === '') return undefined
  const date = parseISO(isoDate)
  if (Number.isNaN(date.getTime())) return undefined
  return format(date, 'yyyy. M. d.')
}

export function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { state } = useLocation()
  const id = Number(workspaceId)
  const businessNameFromNav = (state as { businessName?: string } | null)
    ?.businessName
  const [isResignModalOpen, setIsResignModalOpen] = useState(false)
  const [isResignErrorOpen, setIsResignErrorOpen] = useState(false)
  const { mutate: resignWorkspace, isPending: isResigning } =
    useResignWorkspaceMutation()

  const { workspaces, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWorkspacesViewModel()

  const businessNameFromList = useMemo(
    () => workspaces.find(w => w.workspaceId === id)?.businessName,
    [workspaces, id]
  )

  const storeDisplayName = businessNameFromNav?.trim() || businessNameFromList

  /** 이름이 목록에 없을 때 자동으로 한 페이지만 더 불러오기 (무한 연속 fetch 방지) */
  const supplementalListFetchDoneForIdRef = useRef(new Set<number>())

  useEffect(() => {
    if (
      storeDisplayName ||
      !hasNextPage ||
      isFetchingNextPage ||
      !Number.isFinite(id) ||
      id <= 0
    ) {
      return
    }
    if (supplementalListFetchDoneForIdRef.current.has(id)) {
      return
    }
    supplementalListFetchDoneForIdRef.current.add(id)
    void fetchNextPage()
  }, [storeDisplayName, hasNextPage, isFetchingNextPage, fetchNextPage, id])

  const {
    mode,
    baseDate,
    calendarData,
    isLoading: scheduleLoading,
    onDateChange,
  } = useWorkspaceScheduleViewModel(id)

  const {
    managers,
    totalCount: managersTotalCount,
    fetchNextPage: fetchNextManagers,
    hasNextPage: hasMoreManagers,
    isFetchingNextPage: fetchingManagers,
    isLoading: managersLoading,
  } = useWorkspaceManagersViewModel(id, 5)

  const {
    workers,
    totalCount: workersTotalCount,
    fetchNextPage: fetchNextWorkers,
    hasNextPage: hasMoreWorkers,
    isFetchingNextPage: fetchingWorkers,
    isLoading: workersLoading,
  } = useWorkspaceWorkersViewModel(id, 5)

  const showManagersLoadMore = shouldShowInfiniteListLoadMore(
    hasMoreManagers,
    managersTotalCount
  )
  const showWorkersLoadMore = shouldShowInfiniteListLoadMore(
    hasMoreWorkers,
    workersTotalCount
  )

  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-bg-light">
        <Navbar variant="detail" title="근무중인 가게" />
        <div className="flex flex-col gap-4 w-full max-w-[390px] mx-auto px-4 py-4">
          <HomeScheduleCalendar
            mode={mode}
            baseDate={baseDate}
            data={calendarData}
            isLoading={scheduleLoading}
            workspaceName={storeDisplayName}
            onDateChange={onDateChange}
          />

          {/* 관리자 섹션 */}
          <section className="w-full">
            <div className="flex items-center gap-2 px-3 mb-[10px]">
              <img src={CrownIcon} alt="" className="size-5" />
              <span className="typography-body02-semibold text-sub">
                관리자 ({managers.length}명)
              </span>
            </div>

            {managersLoading ? (
              <div className="flex justify-center py-4">
                <p className="typography-body02-regular text-text-70">
                  로딩 중...
                </p>
              </div>
            ) : managers.length === 0 ? (
              <div className="flex justify-center py-4">
                <p className="typography-body02-regular text-text-70">
                  등록된 관리자가 없습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {managers.map(manager => (
                    <WorkerListItem
                      key={manager.id}
                      name={manager.name}
                      role={manager.positionDescription || manager.positionType}
                      variant="manager"
                      onOptions={() => {}}
                    />
                  ))}
                </div>
                {showManagersLoadMore && (
                  <button
                    type="button"
                    className="typography-body02-regular mt-2 w-full py-3 text-center text-text-70"
                    onClick={() => fetchNextManagers()}
                    disabled={fetchingManagers}
                  >
                    {fetchingManagers ? '불러오는 중...' : '더 보기'}
                  </button>
                )}
              </>
            )}
          </section>

          {/* 근무자 섹션 */}
          <section className="w-full">
            <div className="flex items-center gap-2 px-3 mb-[10px]">
              <img src={UsersIcon} alt="" className="size-5" />
              <span className="typography-body02-semibold text-sub">
                근무자 ({workers.length}명)
              </span>
            </div>

            {workersLoading ? (
              <div className="flex justify-center py-4">
                <p className="typography-body02-regular text-text-70">
                  로딩 중...
                </p>
              </div>
            ) : workers.length === 0 ? (
              <div className="flex justify-center py-4">
                <p className="typography-body02-regular text-text-70">
                  등록된 근무자가 없습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {workers.map(worker => (
                    <WorkerListItem
                      key={worker.id}
                      name={worker.name}
                      role={worker.positionDescription || worker.positionType}
                      variant="worker"
                      nextWorkDate={formatNextShift(worker.nextShiftDateTime)}
                      onOptions={() => {}}
                    />
                  ))}
                </div>
                {showWorkersLoadMore && (
                  <button
                    type="button"
                    className="typography-body02-regular mt-2 w-full py-3 text-center text-text-70"
                    onClick={() => fetchNextWorkers()}
                    disabled={fetchingWorkers}
                  >
                    {fetchingWorkers ? '불러오는 중...' : '더 보기'}
                  </button>
                )}
              </>
            )}
          </section>

          <button
            type="button"
            className="w-full mt-12 mb-6 py-[14px] rounded-xl bg-error/10 typography-body01-semibold text-error"
            onClick={() => setIsResignModalOpen(true)}
          >
            퇴사하기
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResignModalOpen}
        title="퇴사 처리하시겠어요?"
        description="퇴사 처리 후에는 되돌릴 수 없습니다."
        confirmLabel="퇴사하기"
        cancelLabel="취소"
        isPending={isResigning}
        onConfirm={() =>
          resignWorkspace(id, {
            onError: () => {
              setIsResignModalOpen(false)
              setIsResignErrorOpen(true)
            },
          })
        }
        onClose={() => setIsResignModalOpen(false)}
      />
      <ConfirmModal
        isOpen={isResignErrorOpen}
        title="퇴사 처리 실패"
        description="퇴사 처리에 실패했습니다. 다시 시도해 주세요."
        onConfirm={() => setIsResignErrorOpen(false)}
        onClose={() => setIsResignErrorOpen(false)}
      />
    </>
  )
}
