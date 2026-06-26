import { format, parse } from 'date-fns'
import { ko } from 'date-fns/locale'
import { DAILY_STATUS_STYLE_MAP } from '@/features/home/common/schedule/constants/calendar'
import type { CalendarEvent } from '@/features/user/home/schedule/types/schedule'
import { formatScheduleTimeRange } from '@/features/user/home/schedule/lib/date'
import { ShiftTimelineBar } from '@/features/user/home/schedule/ui/ShiftTimelineBar'
import { Modal } from '@/shared/ui/common/Modal'

interface DayScheduleModalProps {
  isOpen: boolean
  dateKey: string | null
  events: CalendarEvent[]
  onClose: () => void
}

export function DayScheduleModal({
  isOpen,
  dateKey,
  events,
  onClose,
}: DayScheduleModalProps) {
  const title = dateKey
    ? format(parse(dateKey, 'yyyy-MM-dd', new Date()), 'M월 d일 (EEE)', {
        locale: ko,
      })
    : ''

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      ariaLabel="해당 날짜 근무 일정"
      variant="center"
    >
      {events.length > 0 ? (
        <div className="flex flex-col gap-3">
          {events.map(event => {
            const { time, hours } = formatScheduleTimeRange(
              event.startDateTime,
              event.endDateTime
            )
            const colorClassName =
              DAILY_STATUS_STYLE_MAP[event.status] ?? 'bg-main/70'

            return (
              <div key={event.shiftId} className="rounded-2xl bg-bg-light p-4">
                <div className="flex items-center justify-between">
                  <span className="typography-body01-semibold text-text-100">
                    {event.workspaceName}
                  </span>
                  <span className="typography-body02-regular text-text-70">
                    {hours}
                  </span>
                </div>
                <p className="typography-body02-regular text-text-70">{time}</p>
                <div className="mt-3">
                  <ShiftTimelineBar
                    startDateTime={event.startDateTime}
                    endDateTime={event.endDateTime}
                    colorClassName={colorClassName}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="py-8 text-center typography-body02-regular text-text-50">
          해당 날짜에 근무 일정이 없어요
        </p>
      )}
    </Modal>
  )
}
