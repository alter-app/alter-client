import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ko } from 'date-fns/locale'

import ChevronLeftIcon from '@/assets/icons/nav/chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/my/chevron-right.svg'

import { WEEKDAY_LABELS } from '@/shared/constants/calendar'
import {
  DATE_KEY_FORMAT,
  MONTH_LABEL_FORMAT,
} from '@/features/home/common/schedule/constants/calendar'
import { cn } from '@/shared/lib/utils'

const HEADER_NAV_ICON_CLASS = 'size-5 shrink-0 brightness-0 invert'

const DAY_CELL_CLASS =
  'flex h-[50px] min-h-[50px] min-w-0 items-center justify-center'

const DAY_NUMBER_BASE = 'tabular-nums'

export interface SubstituteCalendarPickerPanelProps {
  /** 표시 월 안의 아무 날짜 */
  baseDate: Date
  /** `yyyy-MM-dd` — 선택 없으면 빈 문자열 */
  selectedDateKey: string
  onMonthChange: (monthAnchor: Date) => void
  onSelectDateKey: (dateKey: string) => void
}

/**
 * Figma `1:546` — 업장 변경/추가 스타일의 월달력 패널
 * — 초록 헤더, 요일 줄(메인색), 행 높이 50px 그리드, 선택일 `main-300`.
 */
export function SubstituteCalendarPickerPanel({
  baseDate,
  selectedDateKey,
  onMonthChange,
  onSelectDateKey,
}: SubstituteCalendarPickerPanelProps) {
  const monthStart = startOfMonth(baseDate)
  const monthEnd = endOfMonth(baseDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const flatDays = eachDayOfInterval({
    start: gridStart,
    end: gridEnd,
  })

  type DayCell = {
    dateKey: string
    inMonth: boolean
    weekday: number
    dayNum: string
  }

  const cells: DayCell[] = flatDays.map(d => ({
    dateKey: format(d, DATE_KEY_FORMAT),
    inMonth: isSameMonth(d, baseDate),
    weekday: d.getDay(),
    dayNum: format(d, 'd'),
  }))

  const rows: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }

  const goPrevMonth = () => {
    onMonthChange(subMonths(baseDate, 1))
  }

  const goNextMonth = () => {
    onMonthChange(addMonths(baseDate, 1))
  }

  const dayNumberClassFor = (cell: DayCell, selected: boolean): string => {
    const base = DAY_NUMBER_BASE
    if (selected) return cn(base, 'typography-body01-semibold text-text-100')
    if (!cell.inMonth) return cn(base, 'typography-body01-regular text-text-50')
    if (cell.weekday === 6)
      return cn(base, 'typography-body01-regular text-subBlue')
    if (cell.weekday === 0)
      return cn(base, 'typography-body01-regular text-error')
    return cn(base, 'typography-body01-regular text-text-90')
  }

  return (
    <div className="w-full bg-white">
      <div className="flex h-[67px] shrink-0 items-center justify-between gap-3 rounded-t-2xl bg-main px-4 text-white">
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none ring-white/40 transition hover:bg-white/10 focus-visible:ring-2"
          aria-label="이전 달"
          onClick={goPrevMonth}
        >
          <img src={ChevronLeftIcon} alt="" className={HEADER_NAV_ICON_CLASS} />
        </button>
        <p className="min-w-0 truncate text-center typography-headline01 tracking-[-0.01em] text-white">
          {format(baseDate, MONTH_LABEL_FORMAT, { locale: ko })}
        </p>
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg outline-none ring-white/40 transition hover:bg-white/10 focus-visible:ring-2"
          aria-label="다음 달"
          onClick={goNextMonth}
        >
          <img
            src={ChevronRightIcon}
            alt=""
            className={HEADER_NAV_ICON_CLASS}
          />
        </button>
      </div>

      <div className="box-border px-6 pb-5 pt-1">
        <div className="grid h-[50px] w-full grid-cols-7 rounded-[20px] bg-white">
          {WEEKDAY_LABELS.map(d => (
            <div
              key={d}
              className={cn(
                DAY_CELL_CLASS,
                'typography-body01-semibold text-main'
              )}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col">
          {rows.map(row => (
            <div
              key={row.map(c => c.dateKey).join('-')}
              className="grid h-[50px] w-full grid-cols-7 rounded-[20px] bg-white"
            >
              {row.map(cell => {
                const selected =
                  cell.inMonth &&
                  selectedDateKey !== '' &&
                  cell.dateKey === selectedDateKey

                return (
                  <div key={cell.dateKey} className={DAY_CELL_CLASS}>
                    {cell.inMonth ? (
                      <button
                        type="button"
                        onClick={() => onSelectDateKey(cell.dateKey)}
                        aria-pressed={selected}
                        className={cn(
                          'flex size-10 items-center justify-center rounded-[10px] transition-colors',
                          selected
                            ? 'bg-main-300 active:bg-main-300'
                            : 'hover:bg-bg-light active:bg-bg-dark'
                        )}
                      >
                        <span className={dayNumberClassFor(cell, selected)}>
                          {cell.dayNum}
                        </span>
                      </button>
                    ) : (
                      <span
                        aria-hidden
                        className={cn(
                          'flex size-10 items-center justify-center',
                          dayNumberClassFor(cell, false)
                        )}
                      >
                        {cell.dayNum}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
