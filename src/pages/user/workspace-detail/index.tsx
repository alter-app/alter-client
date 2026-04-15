import { useParams, useLocation } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { HomeScheduleCalendar } from '@/features/home'
import { StoreWorkerListItem } from '@/features/home/manager/ui/StoreWorkerListItem'
import { useWorkspaceScheduleViewModel } from '@/features/home/user/workspace/hooks/useWorkspaceScheduleViewModel'
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

  const { mode, baseDate, calendarData, workers, isLoading, onDateChange } =
    useWorkspaceScheduleViewModel(id)

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-light">
      <Navbar variant="detail" title="근무중인 가게" />
      <div className="flex flex-col gap-4 w-full max-w-[390px] mx-auto px-4 py-4">
        <HomeScheduleCalendar
          mode={mode}
          baseDate={baseDate}
          data={calendarData}
          isLoading={isLoading}
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

          {isLoading ? (
            <div className="flex justify-center py-6">
              <p className="typography-body02-regular text-text-70">
                로딩 중...
              </p>
            </div>
          ) : workers.length === 0 ? (
            <div className="flex justify-center py-6">
              <p className="typography-body02-regular text-text-70">
                이 기간에 예정된 근무자가 없습니다.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {workers.map(worker => (
                <div key={worker.workerId} className="rounded-2xl bg-white">
                  <StoreWorkerListItem
                    name={worker.workerName}
                    role="staff"
                    nextWorkDate={formatNextShift(worker.nextShiftDateTime)}
                    onOptions={() => {}}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
