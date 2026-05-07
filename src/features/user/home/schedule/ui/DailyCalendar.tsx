import DownIcon from '@/assets/icons/home/chevron-down.svg?react'
import { useDailyCalendarViewModel } from '@/features/user/home/schedule/hooks/useDailyCalendarViewModel'
import type { DailyCalendarPropsBase } from '@/features/user/home/schedule/types/dailyCalendar'

interface DailyCalendarProps extends DailyCalendarPropsBase {
  isLoading?: boolean
}

export function DailyCalendar({
  baseDate,
  data,
  workspaceName,
  isLoading = false,
}: DailyCalendarProps) {
  const {
    title,
    dateLabel,
    totalWorkHoursText,
    timelineHeight,
    timelineLines,
    eventBlocks,
  } = useDailyCalendarViewModel({
    baseDate,
    data,
    workspaceName,
  })

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6">
        <p className="text-text-70 text-3">금일 일정을 불러오는 중...</p>
      </div>
    )
  }

  return (
    <section>
      <div className="px-[13px]">
        <h3 className="typography-headline01 mb-3">{title}</h3>
        <button type="button" className="flex items-center gap-1">
          <p className="typography-body01-regular text-text-90">{dateLabel}</p>
          <DownIcon className="h-4 w-4 text-text-90" />
        </button>
        <div className="flex items-center gap-2 py-1 mt-5">
          <span className="typography-display text-text-100">
            {totalWorkHoursText}
          </span>
          <span className="typography-body01-semibold text-text-90">
            시간 근무해요
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-line-2">
        <div className="relative" style={{ height: `${timelineHeight}px` }}>
          <div className="absolute left-[18px] top-0 h-full w-px bg-line-2" />

          {timelineLines.map(line => {
            return (
              <div key={line.label}>
                <p
                  className="absolute left-0 -translate-y-1/2 typography-doc-non text-text-50"
                  style={{ top: line.top }}
                >
                  {line.label}
                </p>
                <div
                  className="absolute left-[18px] right-0 border-t border-dashed border-line-2"
                  style={{ top: line.top }}
                />
              </div>
            )
          })}

          {eventBlocks.map(block => {
            return (
              <div
                key={block.key}
                className={`absolute left-[20px] right-0 rounded-2xl p-4 ${block.statusClassName}`}
                style={{ top: block.top, height: block.height }}
              >
                <p className="typography-body03-semibold text-text-100">
                  {block.workspaceName}
                </p>
                <p className="typography-doc-non text-text-90 mt-1">
                  {block.timeLabel}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
