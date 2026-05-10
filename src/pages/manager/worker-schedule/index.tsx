import { useState } from 'react'
import { WorkerRoleBadge } from '@/shared/ui/home/WorkerRoleBadge'
import { useWorkerScheduleManageViewModel } from '@/features/manager/home/hooks/useWorkerScheduleManageViewModel'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import calendarIcon from '@/assets/icons/schedule/schedule_calendar.svg'
import { Navbar } from '@/shared/ui/common/Navbar'
import { ScheduleCalendar } from '@/shared/ui/common/ScheduleCalendar'
import { ColorPickerDropdown } from '@/shared/ui/schedule/ColorPickerDropdown'
import type { ScheduleTab } from '@/features/manager'
import { SCHEDULE_TABS } from '@/features/manager'
import { ScheduleColor } from '@/features/manager/worker-schedule/types/scheduleColor'

interface TimeSelectBoxProps {
  value: string
  unit: string
  onChange: (value: string) => void
}

function TimeSelectBox({ value, unit, onChange }: TimeSelectBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '')

    if (!inputValue) {
      onChange('')
      return
    }

    if (inputValue.length > 2) {
      inputValue = inputValue.slice(-2)
    }

    const maxValue = unit === '시' ? 23 : 59
    const num = Math.min(parseInt(inputValue, 10), maxValue)
    onChange(num.toString().padStart(2, '0'))
  }

  return (
    <div className="flex h-12 w-[78px] items-center justify-center rounded-2xl bg-white">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        placeholder="00"
        onChange={handleChange}
        className="w-8 bg-transparent text-center typography-body01-semibold text-text-100 placeholder:text-text-50 outline-none"
        aria-label={unit}
      />
      <span className="typography-body01-semibold text-text-100">{unit}</span>
    </div>
  )
}

export function ManagerWorkerSchedulePage() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('고정')
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isWorkerDropdownOpen, setIsWorkerDropdownOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ScheduleColor>(
    ScheduleColor.Pink
  )
  const {
    worker,
    workers,
    selectedWorkerIndex,
    setSelectedWorkerIndex,
    workdayOptions,
    selectedDays,
    workTimeRangeLabel,
    startHour,
    startMinute,
    endHour,
    endMinute,
    setStartHour,
    setStartMinute,
    setEndHour,
    setEndMinute,
    toggleDay,
  } = useWorkerScheduleManageViewModel()

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="근무자 스케줄 관리" />
      <div className="flex w-full border-b border-line-2">
        {SCHEDULE_TABS.map(tab => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex h-[46px] flex-1 items-center justify-center typography-body01-semibold ${
                isActive
                  ? 'border-b-2 border-line-3 text-text-100'
                  : 'text-text-50'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <main className="flex-1 px-4 pb-4 pt-[30px]">
        <section className="relative">
          <h2 className="typography-headline03 text-text-100">근무자 선택</h2>
          <button
            type="button"
            onClick={() => setIsWorkerDropdownOpen(!isWorkerDropdownOpen)}
            aria-label="근무자 펼치기"
            className="mt-4 flex h-[70px] w-full items-center rounded-2xl bg-white px-3"
          >
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
            <div className="flex h-6 w-6 items-center justify-center">
              <img
                src={chevronDownIcon}
                alt=""
                aria-hidden="true"
                className={`h-5 w-5 transition-transform ${isWorkerDropdownOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {isWorkerDropdownOpen && (
            <div className="absolute top-full z-10 mt-2 w-full max-h-[350px] overflow-y-auto rounded-2xl bg-white p-3">
              {workers.map((w, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedWorkerIndex(index)
                    setIsWorkerDropdownOpen(false)
                  }}
                  className={`flex h-[70px] w-full items-center gap-4 rounded-2xl px-3 py-4 transition-colors ${
                    selectedWorkerIndex === index
                      ? 'bg-main/10'
                      : 'hover:bg-bg-light'
                  }`}
                >
                  <div
                    className="size-[38px] rounded-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 items-center gap-1">
                    <p className="typography-body01-semibold text-text-100">
                      {w.name}
                    </p>
                    <WorkerRoleBadge role={w.role} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {activeTab === '고정' ? (
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
        ) : (
          <>
            <section className="relative mt-12">
              <h2 className="typography-headline03 text-text-100">날짜 선택</h2>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="mt-4 flex h-12 w-full items-center gap-1 rounded-2xl bg-white px-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <span className={`typography-headline03 text-text-100`}>
                    {selectedDate
                      ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
                      : '날짜 선택'}
                  </span>
                  <img
                    src={calendarIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                </div>
                <div className="flex h-6 w-6 items-center justify-center">
                  <img
                    src={chevronDownIcon}
                    alt=""
                    aria-hidden="true"
                    className={`h-5 w-5 transition-transform ${showCalendar ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {showCalendar && (
                <div className="absolute top-full left-0 z-10 mt-2 w-full rounded-2xl bg-white p-3">
                  <ScheduleCalendar
                    selectedDate={selectedDate}
                    onDateChange={date => {
                      setSelectedDate(date)
                      setShowCalendar(false)
                    }}
                  />
                </div>
              )}
            </section>
            <section className="relative mt-4">
              <ColorPickerDropdown
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                isOpen={isColorPickerOpen}
                onToggle={() => setIsColorPickerOpen(!isColorPickerOpen)}
              />
            </section>
          </>
        )}
        {!isColorPickerOpen && (
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
                <TimeSelectBox
                  value={startHour}
                  unit="시"
                  onChange={setStartHour}
                />
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
                <TimeSelectBox
                  value={startMinute}
                  unit="분"
                  onChange={setStartMinute}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="typography-body02-semibold text-text-70">
                퇴근 시간
              </span>
              <div className="flex items-center gap-2">
                <TimeSelectBox
                  value={endHour}
                  unit="시"
                  onChange={setEndHour}
                />
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
                <TimeSelectBox
                  value={endMinute}
                  unit="분"
                  onChange={setEndMinute}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="px-4 pb-8">
        <button
          type="button"
          className="h-12 w-full rounded-2xl bg-main typography-body01-semibold text-text-100"
          onClick={() => {
            //Todo: 저장 기능 추가
          }}
        >
          저장
        </button>
      </div>
    </div>
  )
}
