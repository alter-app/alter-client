import calendarIcon from '@/assets/icons/schedule/schedule_calendar.svg'
import { CollapsibleScheduleSection } from '@/pages/manager/worker-schedule/components/CollapsibleScheduleSection'
import { RecurrenceSelect } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import type { ScheduleRecurrence } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import { ScheduleDateRow } from '@/pages/manager/worker-schedule/components/ScheduleDateRow'
import { WeekdayPicker } from '@/pages/manager/worker-schedule/components/WeekdayPicker'
import { WorkTimeRangeField } from '@/pages/manager/worker-schedule/components/WorkTimeRangeField'
import type { WorkTimeEditorState } from '@/pages/manager/worker-schedule/types/workTime'

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
  return (
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
        <div className="flex w-full max-w-[326px] flex-col justify-between gap-5">
          <div className="flex items-center justify-between px-1">
            <span className="typography-body01-regular text-text-70">요일</span>
            <RecurrenceSelect
              value={recurrence}
              onChange={onRecurrenceChange}
            />
          </div>
          <WeekdayPicker
            options={workdayOptions}
            selectedDays={selectedDays}
            onToggleDay={onToggleDay}
          />
        </div>

        <div className="flex w-full max-w-[318px] flex-col gap-2.5">
          <ScheduleDateRow
            label="시작 날짜"
            date={startDate}
            onDateChange={onStartDateChange}
          />
          <ScheduleDateRow
            label="종료 날짜"
            date={endDate}
            onDateChange={onEndDateChange}
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
  )
}
