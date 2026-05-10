import type { ReactNode } from 'react'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { useMonthlyCalendarViewModel } from '@/features/home/common/schedule/hooks/useMonthlyCalendarViewModel'
import { useMonthYearPickerViewModel } from '@/features/home/common/schedule/hooks/useMonthYearPickerViewModel'
import type { MonthlyCalendarPropsBase } from '@/features/home/common/schedule/types/monthlyCalendar'
import { MonthlyDateCell } from '@/features/home/common/schedule/ui/MonthlyDateCell'
import { MonthYearPickerModal } from '@/features/home/common/schedule/ui/MonthYearPickerModal'
import { cn } from '@/shared/lib/utils'

interface MonthlyCalendarProps extends MonthlyCalendarPropsBase {
  isLoading?: boolean
  hideTitle?: boolean
  /** 제목(예: 업장명) 줄 우측 — 카드 헤더 액션 */
  titleRightAction?: ReactNode
  rightAction?: ReactNode
  layout?: 'default' | 'manager'
  onMonthChange?: (date: Date) => void
  /** 현재 표시 월의 날짜만 전달된다. 선택 UI는 MonthlyDateCell이 버튼으로 바뀐다 */
  onDaySelect?: (dateKey: string) => void
}

export function MonthlyCalendar({
  baseDate,
  data,
  workspaceName,
  isLoading = false,
  selectedDateKey,
  hideTitle = false,
  titleRightAction,
  rightAction,
  layout = 'default',
  onMonthChange,
  onDaySelect,
}: MonthlyCalendarProps) {
  const {
    title,
    monthLabel,
    totalWorkHoursText,
    weekdayLabels,
    monthlyDateCellsState,
    estimatedEarningsText,
  } = useMonthlyCalendarViewModel({
    baseDate,
    data,
    workspaceName,
    selectedDateKey,
  })

  const {
    isPickerOpen,
    openPicker,
    closePicker,
    yearItems,
    yearIndex,
    monthIndex,
    onYearIndexChange,
    onMonthIndexChange,
    onPickerConfirm,
  } = useMonthYearPickerViewModel({ currentDate: baseDate, onMonthChange })

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
        {!hideTitle && (
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="typography-headline01 min-w-0 flex-1 truncate">
              {title}
            </h3>
            {titleRightAction ? (
              <div className="shrink-0">{titleRightAction}</div>
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-1 typography-body01-regular text-text-90"
            onClick={openPicker}
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
              className={cn(
                'w-12 typography-body03-regular text-text-50',
                index === 0 && 'text-error',
                index === 6 && 'text-subBlue'
              )}
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
                isSaturday={cell.isSaturday}
                isSunday={cell.isSunday}
                isSelected={cell.isSelected}
                isActiveDay={cell.isActiveDay}
                gaugeRatio={cell.dayProgress}
                onClick={
                  onDaySelect && cell.isCurrentMonth
                    ? () => onDaySelect(cell.dateKey)
                    : undefined
                }
              />
            )
          })}
        </div>
      </section>

      <MonthYearPickerModal
        isOpen={isPickerOpen}
        yearItems={yearItems}
        yearIndex={yearIndex}
        monthIndex={monthIndex}
        onYearIndexChange={onYearIndexChange}
        onMonthIndexChange={onMonthIndexChange}
        onConfirm={onPickerConfirm}
        onClose={closePicker}
      />
    </section>
  )
}
