import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSelfSchedule } from '@/shared/api/schedule'
import type { ScheduleItem } from '@/shared/stores/useScheduleStore'

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

function mapSchedulesToItems(
  data: Awaited<ReturnType<typeof getSelfSchedule>>['data'] | undefined
): ScheduleItem[] {
  if (!data) return []
  return data.schedules.map(schedule => {
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
}

export const SELF_SCHEDULE_QUERY_KEY = ['schedule', 'self'] as const

type SelfScheduleQueryParams = {
  year: number
  month: number
  day?: number
}

/**
 * 나의 근무 스케줄 조회
 * 파라미터 조합에 따라 조회가 달라집니다.
- 인자 없음: 이번 주 스케줄 조회
- year, month: 해당 월 스케줄 조회
- year, month, day: 해당 일 스케줄 조회
 *
 * @param params.year 조회할 연도
 * @param params.month 조회할 월
 * @param params.day 조회할 일 (일별 조회 시 사용)
 * @returns
 */
export function useSelfScheduleQuery(params: SelfScheduleQueryParams) {
  const { year, month, day } = params

  const { data, isPending, error } = useQuery({
    queryKey: [
      ...SELF_SCHEDULE_QUERY_KEY,
      year,
      month,
      ...(day !== undefined ? [day] : []),
    ],
    queryFn: async () => {
      const res = await getSelfSchedule({
        year,
        month,
        ...(day !== undefined && { day }),
      })
      return res.data
    },
  })

  const schedules = useMemo(() => mapSchedulesToItems(data), [data])

  return {
    schedules,
    isLoading: isPending,
    error,
    rawData: data,
  }
}
