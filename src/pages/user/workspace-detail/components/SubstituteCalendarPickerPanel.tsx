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

import { WEEKDAY_LABELS } from '@/features/user/home/applied-stores/types/appliedStore'
import {
  DATE_KEY_FORMAT,
  MONTH_LABEL_FORMAT,
} from '@/features/home/common/schedule/constants/calendar'
import { cn } from '@/shared/lib/utils'

const HEADER_NAV_ICON_CLASS = 'size-5 shrink-0 brightness-0 invert'

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
 * — 초록 헤더, 요일 줄(메인색), 행 높이 50px 그리드, 선택일 `#c0f7da`(main-300).
 */
export function SubstituteCalendarPickerPanel({
  baseDate,
  selectedDateKey,
  onMonthChange,
  onSelectDateKey,
}: SubstituteCalendarPickerPanelProps) {
  const monthStart = startOfMonth(baseDate)
  const monthEnd = endOfMonth(baseDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

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
    if (selected) return 'typography-body01-semibold text-text-100'
    if (!cell.inMonth) return 'typography-body01-regular text-text-50'
    if (cell.weekday === 6) return 'typography-body01-regular text-subBlue'
    if (cell.weekday === 0) return 'typography-body01-regular text-error'
    return 'typography-body01-regular text-text-90'
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
        {/* 요일 — 흰 둥근 바 안에 문자만 메인색 (Figma 1:546) */}
        <div className="flex h-[50px] w-full items-center gap-0.5 overflow-hidden rounded-[20px] bg-white">
          {WEEKDAY_LABELS.map(d => (
            <div
              key={d}
              className="flex min-w-0 flex-1 items-center justify-center typography-body01-semibold text-main"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-0">
          {rows.map(row => (
            <div
              key={row.map(c => c.dateKey).join('-')}
              className="flex h-[50px] w-full items-center gap-0.5 overflow-hidden rounded-[20px] bg-white"
            >
              {row.map(cell => {
                const selected =
                  cell.inMonth &&
                  selectedDateKey !== '' &&
                  cell.dateKey === selectedDateKey

                return (
                  <div
                    key={cell.dateKey}
                    className="flex h-[50px] min-w-0 flex-1 items-stretch overflow-hidden px-px"
                  >
                    {cell.inMonth ? (
                      <button
                        type="button"
                        onClick={() => onSelectDateKey(cell.dateKey)}
                        aria-pressed={selected}
                        className={cn(
                          'flex h-[50px] w-full min-w-0 items-center justify-center rounded-[10px] transition-colors',
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
                        className={`flex items-center justify-center ${dayNumberClassFor(cell, false)}`}
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
