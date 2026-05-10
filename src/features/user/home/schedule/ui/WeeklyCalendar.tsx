import { useWeeklyCalendarViewModel } from '@/features/user/home/schedule/hooks/useWeeklyCalendarViewModel'
import type { WeeklyCalendarPropsBase } from '@/features/user/home/schedule/types/weeklyCalendar'

interface WeeklyCalendarProps extends WeeklyCalendarPropsBase {
  isLoading?: boolean
}

export function WeeklyCalendar({
  baseDate,
  data,
  workspaceName,
  isLoading = false,
}: WeeklyCalendarProps) {
  const { title, totalWorkHoursText, estimatedEarningsText, dayCells } =
    useWeeklyCalendarViewModel({
      baseDate,
      data,
      workspaceName,
    })

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6">
        <p className="text-text-70 text-3">주간 일정을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <section>
      <div className="px-[13px] gap-2">
        <h3 className="typography-headline01 mb-4">{title}</h3>
        <div className="flex items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-2">
            <span className="typography-body01-semibold text-text-90">주</span>
            <span className="typography-display text-text-100">
              {totalWorkHoursText}
            </span>
            <span className="typography-body01-semibold text-text-90">
              시간 근무해요
            </span>
          </div>
          {estimatedEarningsText ? (
            <span className="typography-body01-semibold text-sub shrink-0">
              {estimatedEarningsText}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7">
        {dayCells.map(cell => (
          <div
            key={cell.dateKey}
            className={`mx-auto flex h-[46px] w-[46px] items-center justify-center rounded-2xl ${
              cell.isSelected ? 'bg-sub-300' : 'bg-white'
            }`}
          >
            <span
              className={`typography-body03-regular ${
                cell.isSelected ? 'text-text-100' : 'text-text-50'
              }`}
            >
              {cell.dayLabel}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 h-[320px] rounded-2xl bg-bg-light px-0.5">
        <div className="flex h-full items-end gap-0">
          {dayCells.map(cell => {
            return (
              <div key={cell.dateKey} className="relative h-full w-[44px]">
                {cell.showSecondary && (
                  <div
                    className="absolute bottom-0 left-0 w-full rounded-2xl bg-main-300/65"
                    style={{ height: `${cell.secondaryHeight}px` }}
                  />
                )}
                <div
                  className={`absolute bottom-0 left-0 w-full rounded-2xl ${
                    cell.isPrimaryBar ? 'bg-main' : 'bg-main/85'
                  }`}
                  style={{ height: `${cell.primaryHeight}px` }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
