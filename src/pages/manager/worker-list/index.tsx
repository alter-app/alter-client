import { format } from 'date-fns'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerScheduleCalendar } from '@/features/manager/worker-list/ui/WorkerScheduleCalendar'
import { WorkerListItem } from '@/features/manager/worker-list/ui/WorkerListItem'
import { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'
import type { WorkerScheduleData } from '@/features/manager/worker-list/types/workerSchedule'
import type { WorkerRole } from '@/shared/types/workerRole'
import { Navbar } from '@/shared/ui/common/Navbar'
import PlusIcon from '@/assets/icons/Plus.svg'

// TODO: replace with actual API data
const STUB_SCHEDULE_DATA: WorkerScheduleData = {
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`]:
    [ScheduleColor.Yellow],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-02`]:
    [ScheduleColor.Purple, ScheduleColor.Pink],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-05`]:
    [ScheduleColor.Yellow, ScheduleColor.Purple, ScheduleColor.Pink],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-08`]:
    [ScheduleColor.Purple, ScheduleColor.Blue],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-09`]:
    [
      ScheduleColor.Yellow,
      ScheduleColor.Purple,
      ScheduleColor.Pink,
      ScheduleColor.Blue,
    ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-12`]:
    [ScheduleColor.Pink],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-15`]:
    [ScheduleColor.Yellow, ScheduleColor.Purple],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-16`]:
    [ScheduleColor.Blue, ScheduleColor.Pink],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-19`]:
    [ScheduleColor.Yellow, ScheduleColor.Purple, ScheduleColor.Pink],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-22`]:
    [ScheduleColor.Purple],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-23`]:
    [ScheduleColor.Yellow, ScheduleColor.Blue],
  [`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-26`]:
    [ScheduleColor.Pink, ScheduleColor.Purple, ScheduleColor.Blue],
}

interface StubWorker {
  id: number
  name: string
  workspaceName: string
  nextShiftTime: string
  scheduleColor: ScheduleColor
  role: WorkerRole
}

// TODO: replace with actual API data
const STUB_WORKERS: StubWorker[] = [
  {
    id: 1,
    name: '이름임',
    workspaceName: '매장 이름',
    nextShiftTime: '00:00 ~ 00:00',
    scheduleColor: ScheduleColor.Yellow,
    role: 'manager',
  },
  {
    id: 2,
    name: '이름임',
    workspaceName: '매장 이름',
    nextShiftTime: '00:00 ~ 00:00',
    scheduleColor: ScheduleColor.Purple,
    role: 'staff',
  },
  {
    id: 3,
    name: '이름임',
    workspaceName: '매장 이름',
    nextShiftTime: '00:00 ~ 00:00',
    scheduleColor: ScheduleColor.Pink,
    role: 'staff',
  },
]

export function WorkerListPage() {
  const navigate = useNavigate()
  const [baseDate] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    format(new Date(), 'yyyy-MM-dd')
  )

  function handleDateClick(dateKey: string) {
    setSelectedDate(dateKey)
  }

  const visibleWorkers = STUB_WORKERS.filter(w =>
    (STUB_SCHEDULE_DATA[selectedDate] ?? []).includes(w.scheduleColor)
  )

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
            data={STUB_SCHEDULE_DATA}
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
          <div className="divide-y divide-line-1">
            {visibleWorkers.length > 0 ? (
              visibleWorkers.map(worker => (
                <WorkerListItem
                  key={worker.id}
                  name={worker.name}
                  workspaceName={worker.workspaceName}
                  nextShiftTime={worker.nextShiftTime}
                  scheduleColor={worker.scheduleColor}
                  role={worker.role}
                  onEdit={() => {}}
                  onDelete={() => {}}
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
