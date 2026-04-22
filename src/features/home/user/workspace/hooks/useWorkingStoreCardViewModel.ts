import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import { useMemo } from 'react'
import type { WorkingStoreItem } from '@/features/home/user/workspace/ui/WorkingStoreCard'

function formatNextShiftDate(nextShiftDateTime: string) {
  const date = parseISO(nextShiftDateTime)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'yyyy.MM.dd')
}

function getDueText(nextShiftDateTime: string) {
  const nextDate = parseISO(nextShiftDateTime)
  if (Number.isNaN(nextDate.getTime())) return '-'

  const today = new Date()
  const diffDays = differenceInCalendarDays(nextDate, today)

  if (diffDays <= 0) return '오늘'
  if (diffDays === 1) return '내일'
  if (diffDays < 30) return `${diffDays}일 후`

  const monthDiff = Math.round(diffDays / 30)
  return `${monthDiff}달 후`
}

export function useWorkingStoreCardViewModel(store: WorkingStoreItem) {
  return useMemo(
    () => ({
      nextWorkDate: formatNextShiftDate(store.nextShiftDateTime),
      dueText: getDueText(store.nextShiftDateTime),
    }),
    [store.nextShiftDateTime]
  )
}
