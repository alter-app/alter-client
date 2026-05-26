import { useNavigate } from 'react-router-dom'
import { WorkerScheduleCalendar } from '@/features/manager/worker-list/ui/WorkerScheduleCalendar'
import { WorkerListItem } from '@/features/manager/worker-list/ui/WorkerListItem'
import { Navbar } from '@/shared/ui/common/Navbar'
import PlusIcon from '@/assets/icons/Plus.svg'
import { useWorkerListViewModel } from '@/features/manager/worker-list/hooks/useWorkerListViewModel'

export function WorkerListPage() {
  const navigate = useNavigate()
  const {
    baseDate,
    scheduleData,
    visibleWorkers,
    selectedDate,
    deleteError,
    handleDateClick,
    handleDeleteWorker,
    handleEditWorker,
  } = useWorkerListViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar
        variant="detail"
        title="근무자 리스트"
        onBackClick={() => navigate(-1)}
        rightAction={
          <button
            type="button"
            onClick={() => {}}
            aria-label="근무자 추가"
            className="flex size-8 items-center justify-center rounded-lg bg-text-100"
          >
            <img src={PlusIcon} alt="" className="size-4" aria-hidden />
          </button>
        }
      />

      <div className="flex flex-1 flex-col gap-[10px] px-4 py-5">
        {/* 스케줄표 카드 */}
        <div className="overflow-hidden rounded-2xl bg-white">
          <WorkerScheduleCalendar
            baseDate={baseDate}
            data={scheduleData}
            selectedDate={selectedDate}
            onEditClick={() => {}}
            onDateClick={handleDateClick}
          />
        </div>

        {/* 근무자 목록 카드 */}
        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="px-6 pb-2 pt-[23px]">
            <h2 className="typography-headline03 text-text-100">근무자 목록</h2>
          </div>
          {deleteError && (
            <p className="px-6 pt-3 typography-body02-regular text-error">
              {deleteError}
            </p>
          )}
          <div className="divide-y divide-line-1">
            {visibleWorkers.length > 0 ? (
              visibleWorkers.map(worker => (
                <WorkerListItem
                  key={worker.workerId}
                  name={worker.name}
                  workspaceName={worker.workspaceName}
                  nextShiftTime={worker.nextShiftTime}
                  scheduleColor={worker.scheduleColor}
                  role={worker.role}
                  onEdit={() => handleEditWorker(worker)}
                  onDelete={() => {
                    void handleDeleteWorker(worker.shiftId)
                  }}
                />
              ))
            ) : (
              <p className="px-6 py-8 text-center typography-body02-regular text-text-50">
                해당 날짜에 근무자가 없습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerListPage
