import { useEffect, useState } from 'react'
import { isSameDay } from 'date-fns'
import chevronDownIcon from '@/assets/icons/home/chevron-down.svg'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import {
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_MONDAY_FIRST,
} from '@/shared/constants/calendar'
import { cn } from '@/shared/lib/utils'

export interface ManagerMonthCalendarProps {
  selectedDate?: Date | null
  onDateChange: (date: Date) => void
  /** 0: 일요일 시작(Figma 피커), 1: 월요일 시작(기본) */
  weekStartsOn?: 0 | 1
  /** embedded: 일반 탭 인라인, picker: 고정 스케줄 바텀시트 */
  variant?: 'embedded' | 'picker'
  /** monthYear: "4월 2026", yearMonth: "2026년 4월" */
  headerFormat?: 'yearMonth' | 'monthYear'
}

export function ManagerMonthCalendar({
  selectedDate,
  onDateChange,
  weekStartsOn = 1,
  variant = 'embedded',
  headerFormat = 'yearMonth',
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
  const cells = getCalendarCells(baseDate, weekStartsOn)
  const weekdayLabels =
    weekStartsOn === 0 ? WEEKDAY_LABELS : WEEKDAY_LABELS_MONDAY_FIRST
  const isPicker = variant === 'picker'
  const headerLabel =
    headerFormat === 'monthYear'
      ? `${viewMonth + 1}월 ${viewYear}`
      : `${viewYear}년 ${viewMonth + 1}월`
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

  const saturdayIndex = weekStartsOn === 0 ? 6 : 5
  const sundayIndex = weekStartsOn === 0 ? 0 : 6

  return (
    <div
      className={cn('flex w-full flex-col', isPicker ? 'gap-4' : 'gap-[29px]')}
    >
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
        <p
          className={cn(
            'text-text-100',
            isPicker ? 'typography-headline03' : 'typography-headline01'
          )}
        >
          {headerLabel}
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
          {weekdayLabels.map((label, index) => (
            <div
              key={label}
              className="flex h-[26px] flex-1 items-center justify-center"
            >
              <span
                className={cn(
                  'typography-body03-regular',
                  index === saturdayIndex && 'text-subBlue',
                  index === sundayIndex && 'text-error',
                  index !== saturdayIndex &&
                    index !== sundayIndex &&
                    'text-text-100'
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
                      'flex size-12 items-center justify-center typography-body03-semibold',
                      isPicker ? 'rounded-2xl' : 'rounded-lg',
                      isPicker && isSelected && 'border border-main text-main',
                      !isPicker && isSelected && 'bg-bg-dark text-text-100',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex === saturdayIndex &&
                        'text-subBlue',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex === sundayIndex &&
                        'text-error',
                      !isSelected &&
                        isCurrentMonth &&
                        dayIndex !== saturdayIndex &&
                        dayIndex !== sundayIndex &&
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
