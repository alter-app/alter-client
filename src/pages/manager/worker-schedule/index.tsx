import { useNavigate } from 'react-router-dom'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { useWorkerScheduleManageViewModel } from '@/features/home/manager/hooks/useWorkerScheduleManageViewModel'
import chevronLeftIcon from '@/assets/icons/chevron-left.svg'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'

interface TimeSelectBoxProps {
  value: string
  unit: string
}

function TimeSelectBox({ value, unit }: TimeSelectBoxProps) {
  return (
    <div className="flex h-12 w-[78px] items-center justify-center rounded-2xl bg-white">
      <span className="typography-body01-semibold text-text-50">{value}</span>
      <span className="ml-3 typography-body01-semibold text-text-100">
        {unit}
      </span>
    </div>
  )
}

export function ManagerWorkerSchedulePage() {
  const navigate = useNavigate()
  const {
    worker,
    workdayOptions,
    selectedDays,
    workTimeRangeLabel,
    startHour,
    startMinute,
    endHour,
    endMinute,
    toggleDay,
  } = useWorkerScheduleManageViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <header className="relative flex h-14 items-center border-b border-line-2 px-4">
        <button
          type="button"
          aria-label="뒤로가기"
          className="flex h-6 w-6 items-center justify-center"
          onClick={() => navigate(-1)}
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
          />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 typography-headline03 text-text-100">
          근무자 스케줄 관리
        </h1>
      </header>

      <main className="flex-1 px-4 pb-4 pt-[30px]">
        <section>
          <h2 className="typography-headline03 text-text-100">근무자 선택</h2>
          <div className="mt-4 flex h-[70px] items-center rounded-2xl bg-white px-3">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div
                className="size-[38px] rounded-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
                aria-hidden="true"
              />
              <div className="flex min-w-0 items-center gap-1">
                <p className="typography-body01-semibold text-text-100">
                  {worker.name}
                </p>
                <WorkerRoleBadge role={worker.role} />
              </div>
            </div>
            <button
              type="button"
              aria-label="근무자 펼치기"
              className="flex h-6 w-6 items-center justify-center"
            >
              <img
                src={chevronDownIcon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="typography-headline03 text-text-100">근무일 선택</h2>
          <div className="mt-4 flex h-[50px] items-center rounded-[20px] bg-white px-[4px]">
            {workdayOptions.map(day => {
              const selected = selectedDays.includes(day)
              return (
                <button
                  key={day}
                  type="button"
                  className={`flex h-10 w-[50px] items-center justify-center rounded-2xl typography-body01-semibold ${
                    selected ? 'bg-main text-text-100' : 'text-text-50'
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="typography-headline03 text-text-100">
            근무 시간 선택
          </h2>
          <p className="mt-1 typography-body02-regular text-text-100">
            {workTimeRangeLabel}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="typography-body02-semibold text-text-70">
              출근 시간
            </span>
            <div className="flex items-center gap-2">
              <TimeSelectBox value={startHour} unit="시" />
              <div className="flex flex-col items-center gap-1">
                <span
                  className="h-1 w-1 rounded-full bg-text-70"
                  aria-hidden="true"
                />
                <span
                  className="h-1 w-1 rounded-full bg-text-70"
                  aria-hidden="true"
                />
              </div>
              <TimeSelectBox value={startMinute} unit="분" />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="typography-body02-semibold text-text-70">
              퇴근 시간
            </span>
            <div className="flex items-center gap-2">
              <TimeSelectBox value={endHour} unit="시" />
              <div className="flex flex-col items-center gap-1">
                <span
                  className="h-1 w-1 rounded-full bg-text-70"
                  aria-hidden="true"
                />
                <span
                  className="h-1 w-1 rounded-full bg-text-70"
                  aria-hidden="true"
                />
              </div>
              <TimeSelectBox value={endMinute} unit="분" />
            </div>
          </div>
        </section>
      </main>

      <div className="px-4 pb-8">
        <button
          type="button"
          className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100"
        >
          저장
        </button>
      </div>
    </div>
  )
}
