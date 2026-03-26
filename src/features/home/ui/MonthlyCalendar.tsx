import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { useMonthlyCalendarViewModel } from '@/features/home/hooks/useMonthlyCalendarViewModel'
import type { MonthlyCalendarPropsBase } from '@/features/home/types/monthlyCalendar'
import { MonthlyDateCell } from '@/features/home/ui/MonthlyDateCell'

interface MonthlyCalendarProps extends MonthlyCalendarPropsBase {
  isLoading?: boolean
}

export function MonthlyCalendar({
  baseDate,
  data,
  workspaceName,
  isLoading = false,
  selectedDateKey,
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
      <div className="px-[13px] gap-2">
        <h3 className="typography-headline01 mb-4">{title}</h3>
        <button
          type="button"
          className="flex items-center gap-1 typography-body01-regular text-text-90"
        >
          {monthLabel}
          <DownIcon className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 py-1">
          <span className="typography-display">{totalWorkHoursText}</span>
          <span className="typography-body02-semibold">시간 근무해요</span>
        </div>
      </div>

      <section className="mt-4">
        <div className="grid grid-cols-7 text-center">
          {weekdayLabels.map((label, index) => (
            <span
              key={label}
              className={`w-12 typography-body03-regular ${index === 0 || index === 6 ? 'text-[#DC0000]' : 'text-text-50'}`}
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
