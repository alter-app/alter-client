import { useState } from 'react'
import { parseISO } from 'date-fns'
import calendarIcon from '@/assets/icons/schedule/schedule_calendar.svg'
import type {
  FixedScheduleRecurrenceForm,
  FixedScheduleRecurrenceType,
} from '@/features/manager'
import { CollapsibleScheduleSection } from '@/pages/manager/worker-schedule/components/CollapsibleScheduleSection'
import { RecurrenceSelect } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import { ScheduleDateDisplayRow } from '@/pages/manager/worker-schedule/components/ScheduleDateDisplayRow'
import { ScheduleDatePickerDrawer } from '@/pages/manager/worker-schedule/components/ScheduleDatePickerDrawer'
import { WeekdayPicker } from '@/pages/manager/worker-schedule/components/WeekdayPicker'
import { WeekOfMonthSelect } from '@/pages/manager/worker-schedule/components/WeekOfMonthSelect'
import { WorkTimeRangeField } from '@/pages/manager/worker-schedule/components/WorkTimeRangeField'
import { Toggle } from '@/shared/ui/common/Toggle'
import type { WorkTimeEditorState } from '@/shared/types/workTime'

type DatePickerTarget = 'start' | 'end' | null

interface FixedScheduleDateSectionProps {
  isOpen: boolean
  onToggle: () => void
  workdayOptions: readonly string[]
  selectedDays: string[]
  onToggleDay: (day: string) => void
  recurrence: FixedScheduleRecurrenceForm
  onRecurrenceTypeChange: (value: FixedScheduleRecurrenceType) => void
  onWeekOfMonthChange: (value: number) => void
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date | null) => void
  workTime: WorkTimeEditorState
  fixedScheduleLoading?: boolean
}

function toDate(value: string | null): Date | null {
  return value === null ? null : parseISO(value)
}

export function FixedScheduleDateSection({
  isOpen,
  onToggle,
  workdayOptions,
  selectedDays,
  onToggleDay,
  recurrence,
  onRecurrenceTypeChange,
  onWeekOfMonthChange,
  onStartDateChange,
  onEndDateChange,
  workTime,
  fixedScheduleLoading,
}: FixedScheduleDateSectionProps) {
  const [datePickerTarget, setDatePickerTarget] =
    useState<DatePickerTarget>(null)

  const startDate = toDate(recurrence.startDate)
  const endDate = toDate(recurrence.endDate)
  const hasEndDate = endDate !== null
  const isMonthly = recurrence.recurrenceType === 'MONTHLY'

  const pickerDate =
    (datePickerTarget === 'end' ? endDate : startDate) ??
    startDate ??
    new Date()

  return (
    <>
      <CollapsibleScheduleSection
        title="날짜 선택"
        icon={
          <img
            src={calendarIcon}
            alt=""
            aria-hidden="true"
            className="h-[18px] w-4"
          />
        }
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-white px-4 py-5">
          <div className="flex w-full max-w-[326px] flex-col gap-5">
            <div className="flex items-center justify-between px-1">
              <span className="typography-body01-regular text-text-70">
                요일
              </span>
              <RecurrenceSelect
                value={recurrence.recurrenceType}
                onChange={onRecurrenceTypeChange}
              />
            </div>
            <WeekdayPicker
              options={workdayOptions}
              selectedDays={selectedDays}
              onToggleDay={onToggleDay}
            />
            {isMonthly ? (
              <div className="flex flex-col gap-2">
                <span className="px-1 typography-body01-regular text-text-70">
                  주차
                </span>
                <WeekOfMonthSelect
                  value={recurrence.weekOfMonth}
                  onChange={onWeekOfMonthChange}
                />
              </div>
            ) : null}
          </div>

          <div className="flex w-full max-w-[318px] flex-col gap-2.5">
            <ScheduleDateDisplayRow
              label="시작 날짜"
              date={startDate}
              onPress={() => setDatePickerTarget('start')}
            />
            <div className="flex w-full items-center justify-between px-1">
              <span className="typography-body01-regular text-text-70">
                종료일 없음
              </span>
              <Toggle
                checked={!hasEndDate}
                ariaLabel="종료일 없음"
                onChange={noEndDate =>
                  onEndDateChange(noEndDate ? null : (startDate ?? new Date()))
                }
              />
            </div>
            {hasEndDate ? (
              <ScheduleDateDisplayRow
                label="종료 날짜"
                date={endDate}
                onPress={() => setDatePickerTarget('end')}
              />
            ) : null}
          </div>

          <div className="flex w-full max-w-[326px] flex-col gap-2">
            {fixedScheduleLoading ? (
              <p className="px-1 typography-body02-regular text-text-70">
                고정 근무 시간을 불러오는 중입니다.
              </p>
            ) : null}
            <WorkTimeRangeField workTime={workTime} />
          </div>
        </div>
      </CollapsibleScheduleSection>

      <ScheduleDatePickerDrawer
        open={datePickerTarget !== null}
        onOpenChange={open => {
          if (!open) setDatePickerTarget(null)
        }}
        selectedDate={pickerDate}
        onDateChange={date => {
          if (datePickerTarget === 'end') {
            onEndDateChange(date)
          } else {
            onStartDateChange(date)
          }
        }}
      />
    </>
  )
}
