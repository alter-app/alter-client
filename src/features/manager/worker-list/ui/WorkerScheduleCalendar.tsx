import EditIcon from '@/assets/icons/home/edit.svg'
import { DATE_KEY_FORMAT } from '@/features/home/common/schedule/constants/calendar'
import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import { getCalendarCells } from '@/shared/lib/calendarUtils'
import { format, getDay, isToday } from 'date-fns'
import type { WorkerScheduleCalendarProps } from '../types/workerSchedule'
import { WorkerScheduleCell } from './WorkerScheduleCell'

export function WorkerScheduleCalendar({
  baseDate,
  data,
  onEditClick,
}: WorkerScheduleCalendarProps) {
  const cells = getCalendarCells(baseDate, 0)
  const monthLabel = `${format(baseDate, 'M')}월 스케줄표`

  return (
    <div className="flex flex-col gap-1 bg-white px-3 py-6 rounded-2xl">
      <div className="mb-3 flex items-center justify-between px-3">
        <h2 className="typography-headline01 text-text-100">{monthLabel}</h2>
        <button
          type="button"
          onClick={onEditClick}
          className="flex size-5 items-center justify-center"
          aria-label="스케줄 편집"
        >
          <img src={EditIcon} alt="" className="size-5" aria-hidden />
        </button>
      </div>

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
              isToday={isToday(date)}
              workerColors={workerColors}
            />
          )
        })}
      </div>
    </div>
  )
}
