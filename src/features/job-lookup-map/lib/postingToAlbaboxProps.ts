import { formatDistanceToNowStrict } from 'date-fns'
import { ko } from 'date-fns/locale'

import type { AlbaboxProps } from '@/features/job-lookup-map/common/Albabox'
import type { Posting } from '@/features/job-lookup-map/types/posting'

export function formatPostedAgo(createdAt: string): string {
  const d = new Date(createdAt)
  if (Number.isNaN(d.getTime())) return '-'
  return `${formatDistanceToNowStrict(d, { locale: ko })} 전`
}

const ISO_WEEKDAY_TO_KO = [
  '',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
  '일',
] as const

const EN_DAY_TO_KO: Record<string, string> = {
  MONDAY: '월',
  MON: '월',
  TUESDAY: '화',
  TUE: '화',
  WEDNESDAY: '수',
  WED: '수',
  THURSDAY: '목',
  THU: '목',
  FRIDAY: '금',
  FRI: '금',
  SATURDAY: '토',
  SAT: '토',
  SUNDAY: '일',
  SUN: '일',
}

const KO_DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일'] as const

function toKoreanWeekdayLabel(raw: string): string | null {
  const s = raw.trim()
  if (!s) return null
  if (/^[월화수목금토일]$/.test(s)) return s
  const upper = s.toUpperCase()
  if (EN_DAY_TO_KO[upper]) return EN_DAY_TO_KO[upper]
  if (/^\d+$/.test(s)) {
    const n = Number(s)
    if (n >= 1 && n <= 7) return ISO_WEEKDAY_TO_KO[n] ?? null
  }
  return null
}

export function formatWorkDaysForDisplay(days: string[]): string {
  const labels = [
    ...new Set(
      days.map(toKoreanWeekdayLabel).filter((v): v is string => v != null)
    ),
  ]
  if (labels.length === 0) return days.join(', ')
  labels.sort(
    (a, b) =>
      KO_DAY_ORDER.indexOf(a as (typeof KO_DAY_ORDER)[number]) -
      KO_DAY_ORDER.indexOf(b as (typeof KO_DAY_ORDER)[number])
  )
  return labels.join(', ')
}

export function postingToAlbaboxProps(
  p: Posting
): Omit<AlbaboxProps, 'onBookmarkClick' | 'onClick'> {
  const schedule = p.schedules[0]
  const timeRange = schedule
    ? `${schedule.startTime.slice(0, 5)} ~ ${schedule.endTime.slice(0, 5)}`
    : '-'
  const workDays =
    schedule?.workingDays?.length && schedule.workingDays.length > 0
      ? formatWorkDaysForDisplay(schedule.workingDays)
      : '-'

  return {
    storeName: p.workspace.businessName,
    title: p.title,
    wageAmount: p.payAmount.toLocaleString('ko-KR'),
    timeRange,
    workDays,
    town: p.workspace.town?.trim() || '-',
    postedAgo: formatPostedAgo(p.createdAt),
    saved: p.scrapped,
  }
}
