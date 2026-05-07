import { useState } from 'react'
import { isSameDay } from 'date-fns'
import chevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'

interface ScheduleCalendarProps {
  selectedDate?: Date | null
  onDateChange: (date: Date) => void
}

export function ScheduleCalendar({
  selectedDate,
  onDateChange,
}: ScheduleCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth()
  )

  const baseDate = new Date(viewYear, viewMonth, 1)
  const cells = getCalendarCells(baseDate, 0)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else setViewMonth(m => m + 1)
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      {/* Header */}
      <div className="relative flex h-[67px] items-center justify-center bg-main">
        <button
          type="button"
          aria-label="이전 달"
          onClick={prevMonth}
          className="absolute left-6 flex h-6 w-6 items-center justify-center"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 brightness-0 invert"
          />
        </button>
        <span className="typography-headline01 text-white">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          aria-label="다음 달"
          onClick={nextMonth}
          className="absolute right-6 flex h-6 w-6 items-center justify-center"
        >
          <img
            src={chevronLeftIcon}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 rotate-180 brightness-0 invert"
          />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="flex px-6 py-0">
        {WEEKDAY_LABELS.map(day => (
          <div
            key={day}
            className="flex h-[50px] flex-1 items-center justify-center"
          >
            <span className={`typography-body01-semibold ${'text-main'}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="px-6 pb-6">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex">
            {week.map(({ date, isCurrentMonth }, di) => {
              const isSelected = selectedDate
                ? isSameDay(date, selectedDate)
                : false

              let textColor = 'text-text-90'
              if (!isCurrentMonth) textColor = 'text-text-50'
              else if (di === 0) textColor = 'text-error'
              else if (di === 6) textColor = 'text-subBlue'

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => onDateChange(date)}
                  className="flex h-[50px] flex-1 items-center justify-center"
                >
                  <span
                    className={`flex w-full h-full items-center justify-center rounded-[10px] ${
                      isSelected
                        ? 'bg-main-300 text-text-100 typography-body01-semibold'
                        : `typography-body01-regular ${textColor}`
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
