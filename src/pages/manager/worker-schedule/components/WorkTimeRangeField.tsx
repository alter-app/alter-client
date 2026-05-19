import { useState } from 'react'
import { formatKoreanTimePart } from '@/pages/manager/worker-schedule/lib/formatKoreanWorkTime'
import { WorkTimePickerDrawer } from '@/pages/manager/worker-schedule/components/WorkTimePickerDrawer'
import type { WorkTimeEditorState } from '@/pages/manager/worker-schedule/types/workTime'
import { cn } from '@/shared/lib/utils'

type EditTarget = 'start' | 'end'

interface WorkTimeRangeFieldProps {
  workTime: WorkTimeEditorState
  className?: string
}

export function WorkTimeRangeField({
  workTime,
  className,
}: WorkTimeRangeFieldProps) {
  const [pickerTarget, setPickerTarget] = useState<EditTarget | null>(null)

  const startLabel = formatKoreanTimePart(
    workTime.startHour,
    workTime.startMinute
  )
  const endLabel = formatKoreanTimePart(workTime.endHour, workTime.endMinute)

  return (
    <>
      <div
        className={cn(
          'flex w-full flex-col justify-between gap-2.5',
          className
        )}
      >
        <p className="px-1 typography-body01-regular text-text-70">근무 시간</p>

        <div
          className="flex h-10 w-full items-center justify-between rounded-2xl bg-bg-light px-[60px] typography-body03-semibold text-text-100"
          role="group"
          aria-label="근무 시간 범위"
        >
          <button
            type="button"
            onClick={() => setPickerTarget('start')}
            aria-haspopup="dialog"
            className="shrink-0 text-center"
          >
            {startLabel}
          </button>
          <span aria-hidden="true">-</span>
          <button
            type="button"
            onClick={() => setPickerTarget('end')}
            aria-haspopup="dialog"
            className="shrink-0 text-center"
          >
            {endLabel}
          </button>
        </div>
      </div>

      <WorkTimePickerDrawer
        open={pickerTarget !== null}
        target={pickerTarget}
        workTime={workTime}
        onOpenChange={open => {
          if (!open) setPickerTarget(null)
        }}
      />
    </>
  )
}
