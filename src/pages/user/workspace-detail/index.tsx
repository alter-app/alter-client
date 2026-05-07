import { useParams, useLocation } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Navbar } from '@/shared/ui/common/Navbar'
import { HomeScheduleCalendar } from '@/features/user'
import { WorkerListItem } from '@/shared/ui/home/WorkerListItem'
import { useWorkspaceScheduleViewModel } from '@/features/user/home/workspace/hooks/useWorkspaceScheduleViewModel'
import { useWorkspaceWorkersViewModel } from '@/features/user/home/workspace/hooks/useWorkspaceWorkersViewModel'
import { useWorkspaceManagersViewModel } from '@/features/user/home/workspace/hooks/useWorkspaceManagersViewModel'
import CrownIcon from '@/assets/icons/home/crown-solid.svg'
import UsersIcon from '@/assets/icons/home/users.svg'

function formatNextShift(isoDate: string) {
  const date = parseISO(isoDate)
  if (Number.isNaN(date.getTime())) return undefined
  return format(date, 'yyyy. M. d.')
}

export function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { state } = useLocation()
  const id = Number(workspaceId)
  const businessName = (state as { businessName?: string } | null)?.businessName

  const {
    mode,
    baseDate,
    calendarData,
    isLoading: scheduleLoading,
    onDateChange,
  } = useWorkspaceScheduleViewModel(id)

  const {
    managers,
    fetchNextPage: fetchNextManagers,
    hasNextPage: hasMoreManagers,
    isFetchingNextPage: fetchingManagers,
    isLoading: managersLoading,
  } = useWorkspaceManagersViewModel(id, 5)

  const {
    workers,
    fetchNextPage: fetchNextWorkers,
    hasNextPage: hasMoreWorkers,
    isFetchingNextPage: fetchingWorkers,
    isLoading: workersLoading,
  } = useWorkspaceWorkersViewModel(id, 5)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="근무중인 가게" />
      <div className="flex flex-col gap-4 w-full max-w-[390px] mx-auto px-4 py-4">
        <HomeScheduleCalendar
          mode={mode}
          baseDate={baseDate}
          data={calendarData}
          isLoading={scheduleLoading}
          workspaceName={businessName}
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
              {hasMoreManagers && (
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
              {hasMoreWorkers && (
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
      </div>
    </div>
  )
}
