import type {
  CalendarViewData,
  HomeCalendarMode,
} from '@/features/home/types/schedule'
import { DailyCalendar } from '@/features/home/ui/DailyCalendar'
import { MonthlyCalendar } from '@/features/home/ui/MonthlyCalendar'
import { WeeklyCalendar } from '@/features/home/ui/WeeklyCalendar'

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
}: HomeScheduleCalendarProps) {
  return (
    <section className="rounded-2xl bg-white px-[11px] py-6 w-[358px]">
      {mode === 'monthly' && (
        <MonthlyCalendar
          baseDate={baseDate}
          data={data}
          workspaceName={workspaceName}
          isLoading={isLoading}
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
