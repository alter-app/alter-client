import { useEffect } from 'react'
import {
  useScheduleStore,
  type ScheduleItem as ScheduleItemType,
  type ScheduleState,
} from '@/shared/stores/useScheduleStore'
import { getSelfSchedule } from '@/shared/api/schedule'

type ScheduleStoreHook = () => ScheduleState

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

function formatTimeRange(
  startIso: string,
  endIso: string
): { time: string; hours: string } {
  const start = new Date(startIso)
  const end = new Date(endIso)

  const pad = (value: number) => value.toString().padStart(2, '0')

  const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`
  const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`

  const diffMs = end.getTime() - start.getTime()
  const diffHours = Math.max(diffMs / (1000 * 60 * 60), 0)

  const hoursLabel = Number.isInteger(diffHours)
    ? `${diffHours}시간`
    : `${diffHours.toFixed(1)}시간`

  return {
    time: `${startTime} ~ ${endTime}`,
    hours: hoursLabel,
  }
}

export function useSchedule() {
  const store = (useScheduleStore as unknown as ScheduleStoreHook)()
  const {
    schedules,
    isLoading,
    currentYear,
    currentMonth,
    setSchedules,
    setLoading,
    goPrevMonth,
    goNextMonth,
  } = store

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true)
      try {
        const { data } = await getSelfSchedule({
          year: currentYear,
          month: currentMonth,
        })

        const mapped: ScheduleItemType[] = data.schedules.map(schedule => {
          const start = new Date(schedule.startDateTime)
          const dayIndex = start.getDay()

          const { time, hours } = formatTimeRange(
            schedule.startDateTime,
            schedule.endDateTime
          )

          return {
            id: String(schedule.shiftId),
            day: DAY_LABELS[dayIndex],
            date: String(start.getDate()),
            workplace: schedule.workspace.workspaceName,
            time,
            hours,
          }
        })

        setSchedules(mapped)
      } catch (error) {
        console.error('나의 근무 스케줄 조회 중 오류가 발생했습니다.', error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    void fetchSchedules()
  }, [currentYear, currentMonth, setLoading, setSchedules])

  const handlePreviousMonth = () => {
    goPrevMonth()
  }

  const handleNextMonth = () => {
    goNextMonth()
  }

  const handleScheduleClick = (schedule: ScheduleItemType) => {
    console.log('스케줄 클릭:', schedule)
    // 스케줄 상세 페이지 이동 (필요시 구현)
  }

  return {
    schedules,
    isLoading,
    currentYear,
    currentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleScheduleClick,
  }
}
