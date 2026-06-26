import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CalendarViewData,
  HomeCalendarMode,
} from '@/features/user/home/schedule/types/schedule'
import { DailyCalendar } from '@/features/user/home/schedule/ui/DailyCalendar'
import { DayScheduleModal } from '@/features/user/home/schedule/ui/DayScheduleModal'
import { MonthlyCalendar } from '@/features/user/home/schedule/ui/MonthlyCalendar'
import { WeeklyCalendar } from '@/features/user/home/schedule/ui/WeeklyCalendar'

interface HomeScheduleCalendarProps {
  mode: HomeCalendarMode
  baseDate: Date
  data: CalendarViewData | null
  workspaceName?: string
  /** 월간 뷰에서 제목(업장명) 줄 우측 */
  calendarTitleRightAction?: ReactNode
  isLoading?: boolean
  onDateChange: (nextDate: Date) => void
}

export function HomeScheduleCalendar({
  mode,
  baseDate,
  data,
  workspaceName,
  calendarTitleRightAction,
  isLoading = false,
  onDateChange,
}: HomeScheduleCalendarProps) {
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)

  const selectedEvents = useMemo(
    () => data?.events.filter(event => event.dateKey === selectedDateKey) ?? [],
    [data, selectedDateKey]
  )

  return (
    <>
      <section className="rounded-2xl bg-white px-[11px] py-6 w-full">
        {mode === 'monthly' && (
          <MonthlyCalendar
            baseDate={baseDate}
            data={data}
            workspaceName={workspaceName}
            titleRightAction={calendarTitleRightAction}
            isLoading={isLoading}
            onMonthChange={onDateChange}
            onDaySelect={setSelectedDateKey}
          />
        )}
        {mode === 'weekly' && (
          <WeeklyCalendar
            baseDate={baseDate}
            data={data}
            workspaceName={workspaceName}
            isLoading={isLoading}
          />
        )}
        {mode === 'daily' && (
          <DailyCalendar
            baseDate={baseDate}
            data={data}
            workspaceName={workspaceName}
            isLoading={isLoading}
          />
        )}
      </section>
      <DayScheduleModal
        isOpen={selectedDateKey !== null}
        dateKey={selectedDateKey}
        events={selectedEvents}
        onClose={() => setSelectedDateKey(null)}
      />
    </>
  )
}
