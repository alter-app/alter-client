import { MobileLayout } from '@/shared/ui/MobileLayout'
import { useEffect, useState } from 'react'
import {
  getDailySchedules,
  getMonthlySchedules,
  getWeeklySchedules,
  HomeScheduleCalendar,
  type CalendarViewData,
  type HomeCalendarMode,
} from '@/features/home'
import { getRangeParamsByMode } from '@/features/home/user/lib/date'

export function UserHomePage() {
  const [mode, setMode] = useState<HomeCalendarMode>('monthly')
  const [baseDate, setBaseDate] = useState<Date>(new Date())
  const [data, setData] = useState<CalendarViewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const range = getRangeParamsByMode(baseDate, mode)
        const result =
          mode === 'monthly'
            ? await getMonthlySchedules(range)
            : mode === 'weekly'
              ? await getWeeklySchedules(range)
              : await getDailySchedules(range)

        if (!mounted) return
        setData(result)
      } catch (error) {
        if (!mounted) return
        setData(null)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '홈 스케줄을 불러오는 중 오류가 발생했습니다.'
        )
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [baseDate, mode])

  return (
    <MobileLayout>
      <div className="min-h-screen bg-bg-light p-4 space-y-3">
        <div className="inline-flex rounded-xl border border-line-1 bg-white p-1">
          {(['monthly', 'weekly', 'daily'] as const).map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-lg px-3 py-1.5 text-2 ${
                mode === item
                  ? 'bg-main-100 text-sub-900'
                  : 'bg-white text-text-70'
              }`}
            >
              {item === 'monthly' && '월간'}
              {item === 'weekly' && '주간'}
              {item === 'daily' && '금일'}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-2 text-red-600">
            {errorMessage}
          </div>
        )}

        <HomeScheduleCalendar
          mode={mode}
          baseDate={baseDate}
          data={data}
          isLoading={isLoading}
          onDateChange={setBaseDate}
        />
      </div>
    </MobileLayout>
  )
}
