import { useParams, useLocation } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { HomeScheduleCalendar } from '@/features/home'
import { useWorkspaceScheduleViewModel } from '@/features/home/user/workspace/hooks/useWorkspaceScheduleViewModel'
import { useWorkspaceWorkersViewModel } from '@/features/home/user/workspace/hooks/useWorkspaceWorkersViewModel'
import UsersIcon from '@/assets/icons/home/users.svg'
import { format, parseISO } from 'date-fns'

function formatNextShift(isoDate: string) {
  const date = parseISO(isoDate)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'yyyy. M. d.')
}

export function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { state } = useLocation()
  const id = Number(workspaceId)
  const businessName = (state as { businessName?: string } | null)?.businessName

  const { mode, baseDate, calendarData, isLoading: scheduleLoading, onDateChange } =
    useWorkspaceScheduleViewModel(id)

  const {
    workers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

        <section className="w-full">
          <div className="flex items-center gap-2 px-3 mb-[10px]">
            <img src={UsersIcon} alt="" className="size-5" />
            <span className="typography-body02-semibold text-sub">
              근무자 ({workers.length}명)
            </span>
          </div>

          {workersLoading ? (
            <div className="flex justify-center py-6">
              <p className="typography-body02-regular text-text-70">로딩 중...</p>
            </div>
          ) : workers.length === 0 ? (
            <div className="flex justify-center py-6">
              <p className="typography-body02-regular text-text-70">
                등록된 근무자가 없습니다.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {workers.map(worker => (
                  <div
                    key={worker.id}
                    className="rounded-2xl bg-white px-5 py-3 flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-0.5">
                      <p className="typography-body02-semibold text-text-90">
                        {worker.name}
                      </p>
                      <p className="typography-body02-regular text-text-70">
                        {worker.positionEmoji}{' '}
                        {worker.positionDescription || worker.positionType}
                      </p>
                    </div>
                    <p className="typography-body02-regular text-text-50">
                      {formatNextShift(worker.nextShiftDateTime)}
                    </p>
                  </div>
                ))}
              </div>

              {hasNextPage && (
                <button
                  type="button"
                  className="typography-body02-regular mt-2 w-full py-3 text-center text-text-70"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
