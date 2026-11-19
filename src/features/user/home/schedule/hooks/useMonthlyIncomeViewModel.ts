import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  adaptMonthlyIncome,
  getSelfSchedule,
} from '@/features/user/home/schedule/api/schedule'
import { queryKeys } from '@/shared/lib/queryKeys'
import type { SelfScheduleQueryParams } from '@/shared/types/schedule'

/**
 * 홈 예상 수입 카드 — 항상 baseDate가 속한 달의 월 조회(year, month) 응답으로 그린다.
 * 캘린더가 일·주 조회로 바뀌어도 일 조회 응답(estimatedSalary=null)을 쓰지 않는다.
 * 월간 캘린더와 같은 queryKey라 캐시를 공유한다.
 */
export function useMonthlyIncomeViewModel(baseDate: Date) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth() + 1
  const params: SelfScheduleQueryParams = { year, month }

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.schedules.self(params),
    queryFn: () => getSelfSchedule(params),
  })

  const income = useMemo(() => (data ? adaptMonthlyIncome(data) : null), [data])

  return {
    month,
    income,
    isLoading: isPending,
    isError,
  }
}
