import calendarIcon from '@/assets/icons/schedule/schedule_calendar.svg'
import { CollapsibleScheduleSection } from '@/pages/manager/worker-schedule/components/CollapsibleScheduleSection'
import { WorkTimeRangeField } from '@/pages/manager/worker-schedule/components/WorkTimeRangeField'
import type { WorkTimeEditorState } from '@/pages/manager/worker-schedule/types/workTime'
import { ManagerMonthCalendar } from '@/shared/ui/schedule/ManagerMonthCalendar'

interface GeneralScheduleDateSectionProps {
  isOpen: boolean
  onToggle: () => void
  selectedDate: Date | null
  onDateChange: (date: Date) => void
  workTime: WorkTimeEditorState
}

export function GeneralScheduleDateSection({
  isOpen,
  onToggle,
  selectedDate,
  onDateChange,
  workTime,
}: GeneralScheduleDateSectionProps) {
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
      <div className="flex flex-col gap-[29px] rounded-2xl bg-white px-3 py-6">
        <ManagerMonthCalendar
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
        <div className="px-1">
          <WorkTimeRangeField workTime={workTime} />
        </div>
      </div>
    </CollapsibleScheduleSection>
  )
}
