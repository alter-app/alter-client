import EditIcon from '@/assets/icons/home/edit.svg'
import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { DATE_KEY_FORMAT } from '@/features/home/common/schedule/constants/calendar'
import { useMonthYearPickerViewModel } from '@/features/home/common/schedule/hooks/useMonthYearPickerViewModel'
import { MonthYearPickerModal } from '@/features/home/common/schedule/ui/MonthYearPickerModal'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import { format, getDay } from 'date-fns'
import type { WorkerScheduleCalendarProps } from '../types/workerSchedule'
import { WorkerScheduleCell } from './WorkerScheduleCell'

export function WorkerScheduleCalendar({
  baseDate,
  data,
  selectedDate,
  onEditClick,
  onDateClick,
  onMonthChange,
  totalWorkHoursText,
  estimatedEarningsText,
  isLoading = false,
  showTitle = true,
}: WorkerScheduleCalendarProps) {
  const cells = getCalendarCells(baseDate, 0)
  const monthLabel = `${format(baseDate, 'M')}월 스케줄표`

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

  const showMonthPickerInline = !showTitle && Boolean(onMonthChange)
  const hasHeaderLeftContent = showTitle || showMonthPickerInline

  return (
    <div className="flex flex-col gap-1 bg-white px-3 py-6 rounded-2xl">
      <div
        className={`mb-3 flex items-center px-3 ${
          hasHeaderLeftContent ? 'justify-between' : 'justify-end'
        }`}
      >
        {showTitle && (
          <h2 className="typography-headline01 text-text-100">{monthLabel}</h2>
        )}
        {showMonthPickerInline && (
          <button
            type="button"
            onClick={openPicker}
            className="flex items-center gap-1 typography-body01-regular text-text-90"
          >
            {format(baseDate, 'yyyy년 M월')}
            <DownIcon className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onEditClick}
          className="flex size-5 items-center justify-center"
          aria-label="스케줄 편집"
        >
          <img src={EditIcon} alt="" className="size-5" aria-hidden />
        </button>
      </div>

      {onMonthChange && showTitle && (
        <div className="mb-2 px-3">
          <button
            type="button"
            onClick={openPicker}
            className="flex items-center gap-1 typography-body01-regular text-text-90"
          >
            {format(baseDate, 'yyyy년 M월')}
            <DownIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {totalWorkHoursText && (
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2">
            <span className="typography-display">{totalWorkHoursText}</span>
            <span className="typography-body02-semibold">시간 근무해요</span>
          </div>
          {estimatedEarningsText && (
            <span className="typography-body01-semibold text-sub">
              {estimatedEarningsText}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-7 gap-y-1">
        {WEEKDAY_LABELS.map(label => (
          <div
            key={label}
            className={`flex h-[26px] items-center justify-center typography-body03-regular ${
              label === '토'
                ? 'text-subBlue'
                : label === '일'
                  ? 'text-error'
                  : 'text-text-100'
            }`}
          >
            {label}
          </div>
        ))}

        {cells.map(({ date, isCurrentMonth }) => {
          const dateKey = format(date, DATE_KEY_FORMAT)
          const dayOfWeek = getDay(date)
          const workerColors = data?.[dateKey] ?? []

          return (
            <WorkerScheduleCell
              key={dateKey}
              dayText={String(date.getDate())}
              isCurrentMonth={isCurrentMonth}
              isSaturday={dayOfWeek === 6}
              isSunday={dayOfWeek === 0}
              isSelected={selectedDate === dateKey}
              workerColors={workerColors}
              onClick={() => onDateClick?.(dateKey)}
            />
          )
        })}
      </div>

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
    </div>
  )
}
