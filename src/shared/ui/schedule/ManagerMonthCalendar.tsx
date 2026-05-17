import { useEffect, useState } from 'react'
import { isSameDay } from 'date-fns'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import { WEEKDAY_LABELS_MONDAY_FIRST } from '@/shared/constants/calendar'
import { cn } from '@/shared/lib/utils'

export interface ManagerMonthCalendarProps {
  selectedDate?: Date | null
  onDateChange: (date: Date) => void
}

export function ManagerMonthCalendar({
  selectedDate,
  onDateChange,
}: ManagerMonthCalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth()
  )

  useEffect(() => {
    if (!selectedDate) return
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    if (viewYear !== year || viewMonth !== month) {
      setViewYear(year)
      setViewMonth(month)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  const baseDate = new Date(viewYear, viewMonth, 1)
  const cells = getCalendarCells(baseDate, 1)
  const weeks: (typeof cells)[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear(y => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear(y => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  return (
    <div className="flex w-full flex-col gap-[29px]">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="이전 달"
          onClick={prevMonth}
          className="flex size-6 items-center justify-center"
        >
          <img
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
            className="size-6 rotate-90"
          />
        </button>
        <p className="typography-headline01 text-text-100">
          {viewYear}년 {viewMonth + 1}월
        </p>
        <button
          type="button"
          aria-label="다음 달"
          onClick={nextMonth}
          className="flex size-6 items-center justify-center"
        >
          <img
            src={chevronDownIcon}
            alt=""
            aria-hidden="true"
            className="size-6 -rotate-90"
          />
        </button>
      </div>

      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full">
          {WEEKDAY_LABELS_MONDAY_FIRST.map((label, index) => (
            <div
              key={label}
              className="flex h-[26px] flex-1 items-center justify-center"
            >
              <span
                className={cn(
                  'typography-body03-regular',
                  index === 5 && 'text-subBlue',
                  index === 6 && 'text-error',
                  index < 5 && 'text-text-100'
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex w-full">
            {week.map(({ date, isCurrentMonth }, dayIndex) => {
              const isSelected = selectedDate
                ? isSameDay(date, selectedDate)
                : false

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => onDateChange(date)}
                  className="relative flex size-12 flex-1 items-center justify-center"
                >
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-lg typography-body03-semibold',
                      isSelected && 'bg-bg-dark',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex === 5 &&
                        'text-subBlue',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex === 6 &&
                        'text-error',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex < 5 &&
                        'text-text-100',
                      !isSelected && !isCurrentMonth && 'text-text-50'
                    )}
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
