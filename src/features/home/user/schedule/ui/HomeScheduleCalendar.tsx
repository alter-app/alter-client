import type {
  CalendarViewData,
  HomeCalendarMode,
} from '@/features/home/user/schedule/types/schedule'
import { DailyCalendar } from '@/features/home/user/schedule/ui/DailyCalendar'
import { MonthlyCalendar } from '@/features/home/user/schedule/ui/MonthlyCalendar'
import { WeeklyCalendar } from '@/features/home/user/schedule/ui/WeeklyCalendar'

interface HomeScheduleCalendarProps {
  mode: HomeCalendarMode
  baseDate: Date
  data: CalendarViewData | null
  workspaceName?: string
  isLoading?: boolean
  onDateChange: (nextDate: Date) => void
}

export function HomeScheduleCalendar({
  mode,
  baseDate,
  data,
  workspaceName,
  isLoading = false,
  onDateChange,
}: HomeScheduleCalendarProps) {
  return (
    <section className="rounded-2xl bg-white px-[11px] py-6 w-full">
      {mode === 'monthly' && (
        <MonthlyCalendar
          baseDate={baseDate}
          data={data}
          workspaceName={workspaceName}
          isLoading={isLoading}
          onMonthChange={onDateChange}
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
  )
}
