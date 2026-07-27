import { useState } from 'react'
import calendarIcon from '@/assets/icons/schedule/schedule_calendar.svg'
import { CollapsibleScheduleSection } from '@/pages/manager/worker-schedule/components/CollapsibleScheduleSection'
import { RecurrenceSelect } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import type { ScheduleRecurrence } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import { ScheduleDateDisplayRow } from '@/pages/manager/worker-schedule/components/ScheduleDateDisplayRow'
import { ScheduleDatePickerDrawer } from '@/pages/manager/worker-schedule/components/ScheduleDatePickerDrawer'
import { WeekdayPicker } from '@/pages/manager/worker-schedule/components/WeekdayPicker'
import { WorkTimeRangeField } from '@/pages/manager/worker-schedule/components/WorkTimeRangeField'
import type { WorkTimeEditorState } from '@/shared/types/workTime'

type DatePickerTarget = 'start' | 'end' | null

interface FixedScheduleDateSectionProps {
  isOpen: boolean
  onToggle: () => void
  workdayOptions: readonly string[]
  selectedDays: string[]
  onToggleDay: (day: string) => void
  recurrence: ScheduleRecurrence
  onRecurrenceChange: (value: ScheduleRecurrence) => void
  startDate: Date
  endDate: Date
  onStartDateChange: (date: Date) => void
  onEndDateChange: (date: Date) => void
  workTime: WorkTimeEditorState
  fixedScheduleLoading?: boolean
}

export function FixedScheduleDateSection({
  isOpen,
  onToggle,
  workdayOptions,
  selectedDays,
  onToggleDay,
  recurrence,
  onRecurrenceChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  workTime,
  fixedScheduleLoading,
}: FixedScheduleDateSectionProps) {
  const [datePickerTarget, setDatePickerTarget] =
    useState<DatePickerTarget>(null)

  const pickerOpen = datePickerTarget !== null
  const pickerDate = datePickerTarget === 'end' ? endDate : startDate
  const isWeekly = recurrence === '매주'

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
          <div
            className={
              isWeekly
                ? 'flex w-full max-w-[326px] flex-col gap-5'
                : 'flex w-full max-w-[326px] flex-col'
            }
          >
            <div className="flex items-center justify-between px-1">
              <span className="typography-body01-regular text-text-70">
                {isWeekly ? '요일' : '반복'}
              </span>
              <RecurrenceSelect
                value={recurrence}
                onChange={onRecurrenceChange}
              />
            </div>
            {isWeekly ? (
              <WeekdayPicker
                options={workdayOptions}
                selectedDays={selectedDays}
                onToggleDay={onToggleDay}
              />
            ) : null}
          </div>

          <div className="flex w-full max-w-[318px] flex-col gap-2.5">
            <ScheduleDateDisplayRow
              label="시작 날짜"
              date={startDate}
              onPress={() => setDatePickerTarget('start')}
            />
            <ScheduleDateDisplayRow
              label="종료 날짜"
              date={endDate}
              onPress={() => setDatePickerTarget('end')}
            />
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
        open={pickerOpen}
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
