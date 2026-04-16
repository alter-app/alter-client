import type { ReactNode } from 'react'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { useMonthlyCalendarViewModel } from '@/features/home/common/schedule/hooks/useMonthlyCalendarViewModel'
import type { MonthlyCalendarPropsBase } from '@/features/home/common/schedule/types/monthlyCalendar'
import { MonthlyDateCell } from '@/features/home/common/schedule/ui/MonthlyDateCell'

interface MonthlyCalendarProps extends MonthlyCalendarPropsBase {
  isLoading?: boolean
  hideTitle?: boolean
  rightAction?: ReactNode
  estimatedEarningsText?: string
  layout?: 'default' | 'manager'
}

export function MonthlyCalendar({
  baseDate,
  data,
  workspaceName,
  isLoading = false,
  selectedDateKey,
  hideTitle = false,
  rightAction,
  estimatedEarningsText,
  layout = 'default',
}: MonthlyCalendarProps) {
  const {
    title,
    monthLabel,
    totalWorkHoursText,
    weekdayLabels,
    monthlyDateCellsState,
  } = useMonthlyCalendarViewModel({
    baseDate,
    data,
    workspaceName,
    selectedDateKey,
  })

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6">
        <p className="text-text-70 text-3">월간 일정을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl bg-white">
      <div className={layout === 'manager' ? 'px-6 pt-5' : 'px-[13px]'}>
        {!hideTitle && <h3 className="typography-headline01 mb-4">{title}</h3>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1 typography-body01-regular text-text-90"
          >
            {monthLabel}
            <DownIcon className="w-4 h-4" />
          </button>
          {rightAction}
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="typography-display">{totalWorkHoursText}</span>
            <span className="typography-body02-semibold">시간 근무해요</span>
          </div>
          {estimatedEarningsText ? (
            <span className="typography-body01-semibold text-sub">
              {estimatedEarningsText}
            </span>
          ) : null}
        </div>
      </div>

      <section
        className={layout === 'manager' ? 'mt-5 px-[11px] pb-4' : 'mt-4'}
      >
        <div className="grid grid-cols-7 text-center">
          {weekdayLabels.map((label, index) => (
            <span
              key={label}
              className={`w-12 typography-body03-regular ${index === 5 || index === 6 ? 'text-[#DC0000]' : 'text-text-50'}`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {monthlyDateCellsState.map(cell => {
            return (
              <MonthlyDateCell
                key={cell.dateKey}
                dayText={cell.dayText}
                isCurrentMonth={cell.isCurrentMonth}
                isWeekend={cell.isWeekend}
                isSelected={cell.isSelected}
                isActiveDay={cell.isActiveDay}
                gaugeRatio={cell.dayProgress}
              />
            )
          })}
        </div>
      </section>
    </section>
  )
}
