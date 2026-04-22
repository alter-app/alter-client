import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScheduleItemDto } from '@/features/home/user/schedule/types/schedule'
import { StatusEnum } from '@/shared/types/enums'

import {
  getDailyHourTicks,
  getDayHours,
  getDurationHours,
  getMonthlyDateCells,
  getScheduleParamsByMode,
  getWeekRangeLabel,
  getWeeklyDateCells,
  moveDateByMode,
  toDateKey,
  toTimeLabel,
} from './date'

describe('toDateKey', () => {
  it('ISO 문자열에서 날짜 부분만 반환한다', () => {
    expect(toDateKey('2026-04-05T09:30:00')).toBe('2026-04-05')
  })
})

describe('toTimeLabel', () => {
  it('ISO 문자열에서 HH:mm 구간을 반환한다', () => {
    expect(toTimeLabel('2026-04-05T14:30:00')).toBe('14:30')
  })
})

describe('getDurationHours', () => {
  it('시작·종료 시각 차이를 시간 단위로 반환한다', () => {
    expect(getDurationHours('2026-04-05T10:00:00', '2026-04-05T12:30:00')).toBe(
      2.5
    )
  })

  it('종료가 시작보다 이르면 0을 반환한다', () => {
    expect(getDurationHours('2026-04-05T12:00:00', '2026-04-05T10:00:00')).toBe(
      0
    )
  })
})

describe('getMonthlyDateCells', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 15, 12, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('그리드에 dateKey·day·isCurrentMonth·isToday가 포함된다', () => {
    const cells = getMonthlyDateCells(new Date(2026, 3, 1))
    expect(cells.length).toBeGreaterThan(27)
    const todayCell = cells.find(c => c.dateKey === '2026-04-15')
    expect(todayCell?.isToday).toBe(true)
    expect(
      cells
        .filter(c => c.isCurrentMonth)
        .every(c => c.dateKey.startsWith('2026-04'))
    ).toBe(true)
    expect(cells.some(c => !c.isCurrentMonth)).toBe(true)
  })
})

describe('getWeeklyDateCells', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 15, 12, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('한 주 7일과 요일 라벨을 반환한다', () => {
    const cells = getWeeklyDateCells(new Date(2026, 3, 15))
    expect(cells).toHaveLength(7)
    expect(cells.every(c => c.dayLabel.length > 0)).toBe(true)
    const today = cells.find(c => c.dateKey === '2026-04-15')
    expect(today?.isToday).toBe(true)
  })
})

describe('getDayHours', () => {
  const events: ScheduleItemDto[] = [
    {
      shiftId: 1,
      workspace: { workspaceId: 1, workspaceName: 'A' },
      startDateTime: '2026-04-05T09:00:00',
      endDateTime: '2026-04-05T11:00:00',
      position: 'x',
      status: StatusEnum.CONFIRMED,
    },
    {
      shiftId: 2,
      workspace: { workspaceId: 1, workspaceName: 'A' },
      startDateTime: '2026-04-06T10:00:00',
      endDateTime: '2026-04-06T12:00:00',
      position: 'x',
      status: StatusEnum.CONFIRMED,
    },
  ]

  it('해당 dateKey 이벤트만 합산한다', () => {
    expect(getDayHours(events, '2026-04-05')).toBe(2)
    expect(getDayHours(events, '2026-04-06')).toBe(2)
    expect(getDayHours(events, '2026-04-07')).toBe(0)
  })

  it('빈 배열이면 0이다', () => {
    expect(getDayHours([], '2026-04-05')).toBe(0)
  })
})

describe('getWeekRangeLabel', () => {
  it('주의 시작·끝을 M/d 형식으로 반환한다', () => {
    expect(getWeekRangeLabel(new Date(2026, 3, 15))).toMatch(
      /^\d{1,2}\/\d{1,2} - \d{1,2}\/\d{1,2}$/
    )
  })
})

describe('getDailyHourTicks', () => {
  it('00:00부터 23:00까지 24개를 반환한다', () => {
    const ticks = getDailyHourTicks()
    expect(ticks).toHaveLength(24)
    expect(ticks[0]).toBe('00:00')
    expect(ticks[23]).toBe('23:00')
  })
})

describe('getScheduleParamsByMode', () => {
  const base = new Date(2026, 3, 15)

  it('monthly이면 year·month만 반환한다', () => {
    expect(getScheduleParamsByMode(base, 'monthly')).toEqual({
      year: 2026,
      month: 4,
    })
  })

  it('weekly이면 주의 시작·끝 날짜 범위를 반환한다', () => {
    // 2026-04-15 (수요일) 기준 주: 2026-04-13(월) ~ 2026-04-19(일)
    expect(getScheduleParamsByMode(base, 'weekly')).toEqual({
      fromYear: 2026,
      fromMonth: 4,
      fromDay: 13,
      toYear: 2026,
      toMonth: 4,
      toDay: 19,
    })
  })

  it('weekly에서 주가 월 경계를 넘으면 두 달을 커버하는 범위를 반환한다', () => {
    // 2026-04-28 (화요일) 기준 주: 2026-04-27(월) ~ 2026-05-03(일)
    const crossMonth = new Date(2026, 3, 28)
    expect(getScheduleParamsByMode(crossMonth, 'weekly')).toEqual({
      fromYear: 2026,
      fromMonth: 4,
      fromDay: 27,
      toYear: 2026,
      toMonth: 5,
      toDay: 3,
    })
  })

  it('daily이면 year·month·day를 반환한다', () => {
    expect(getScheduleParamsByMode(base, 'daily')).toEqual({
      year: 2026,
      month: 4,
      day: 15,
    })
  })
})

describe('moveDateByMode', () => {
  const base = new Date(2026, 3, 15)

  it('monthly prev/next는 한 달씩 이동한다', () => {
    expect(moveDateByMode(base, 'prev', 'monthly').getMonth()).toBe(2)
    expect(moveDateByMode(base, 'next', 'monthly').getMonth()).toBe(4)
  })

  it('weekly prev/next는 7일씩 이동한다', () => {
    const prev = moveDateByMode(base, 'prev', 'weekly')
    const next = moveDateByMode(base, 'next', 'weekly')
    expect(prev.getTime()).toBe(base.getTime() - 7 * 24 * 60 * 60 * 1000)
    expect(next.getTime()).toBe(base.getTime() + 7 * 24 * 60 * 60 * 1000)
  })

  it('daily prev/next는 하루씩 이동한다', () => {
    expect(moveDateByMode(base, 'prev', 'daily').getDate()).toBe(14)
    expect(moveDateByMode(base, 'next', 'daily').getDate()).toBe(16)
  })
})
