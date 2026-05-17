import { Fragment, useState } from 'react'
import {
  formatKoreanTimePart,
  hour24To12Parts,
  partsToHour24,
  type TimePeriod,
} from '@/pages/manager/worker-schedule/lib/formatKoreanWorkTime'
import type { WorkTimeEditorState } from '@/pages/manager/worker-schedule/types/workTime'
import { cn } from '@/shared/lib/utils'

type EditTarget = 'start' | 'end'

const PERIOD_OPTIONS: TimePeriod[] = ['오전', '오후']

interface TimePeriodToggleProps {
  value: TimePeriod
  onChange: (value: TimePeriod) => void
}

function TimePeriodToggle({ value, onChange }: TimePeriodToggleProps) {
  return (
    <div
      className="flex shrink-0 items-center typography-body03-semibold"
      role="group"
      aria-label="오전 또는 오후"
    >
      {PERIOD_OPTIONS.map((option, index) => (
        <Fragment key={option}>
          {index > 0 ? (
            <span className="mx-1 text-text-50" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              'transition-colors',
              value === option ? 'text-text-100' : 'text-text-50'
            )}
          >
            {option}
          </button>
        </Fragment>
      ))}
    </div>
  )
}

interface TimePartInputProps {
  value: string
  unit: string
  max: number
  maxDigits?: number
  inputWidthClass?: string
  onChange: (value: string) => void
}

function TimePartInput({
  value,
  unit,
  max,
  maxDigits = 2,
  inputWidthClass = 'w-7',
  onChange,
}: TimePartInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '')
    if (!inputValue) {
      onChange('')
      return
    }
    if (inputValue.length > maxDigits) {
      inputValue = inputValue.slice(-maxDigits)
    }
    const num = Math.min(Number.parseInt(inputValue, 10), max)
    onChange(num.toString().padStart(maxDigits, '0'))
  }

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        placeholder="00"
        onChange={handleChange}
        className={`${inputWidthClass} bg-transparent text-center typography-body03-semibold text-text-100 placeholder:text-text-50 outline-none`}
        aria-label={unit}
      />
      <span className="typography-body03-semibold text-text-100">{unit}</span>
    </>
  )
}

interface WorkTimeSegmentEditorProps {
  target: EditTarget
  workTime: WorkTimeEditorState
}

function WorkTimeSegmentEditor({
  target,
  workTime,
}: WorkTimeSegmentEditorProps) {
  const hour = target === 'start' ? workTime.startHour : workTime.endHour
  const minute = target === 'start' ? workTime.startMinute : workTime.endMinute
  const setHour =
    target === 'start' ? workTime.setStartHour : workTime.setEndHour
  const setMinute =
    target === 'start' ? workTime.setStartMinute : workTime.setEndMinute

  const { period, hour12 } = hour24To12Parts(hour)
  const minuteValue = (minute || '00').padStart(2, '0')

  const applyPeriod = (nextPeriod: TimePeriod) => {
    setHour(partsToHour24(nextPeriod, hour12))
  }

  const applyHour12 = (hour12Str: string) => {
    const parsed = Number.parseInt(hour12Str || '12', 10)
    const clamped = Math.min(12, Math.max(1, parsed || 1))
    setHour(partsToHour24(period, clamped))
  }

  return (
    <div
      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-bg-light px-3"
      role="group"
      aria-label={target === 'start' ? '출근 시간 입력' : '퇴근 시간 입력'}
    >
      <TimePeriodToggle value={period} onChange={applyPeriod} />
      <TimePartInput
        value={String(hour12).padStart(2, '0')}
        unit="시"
        max={12}
        onChange={applyHour12}
      />
      <TimePartInput
        value={minuteValue}
        unit="분"
        max={59}
        onChange={setMinute}
      />
    </div>
  )
}

interface WorkTimeRangeFieldProps {
  workTime: WorkTimeEditorState
  className?: string
}

export function WorkTimeRangeField({
  workTime,
  className,
}: WorkTimeRangeFieldProps) {
  const [editingTarget, setEditingTarget] = useState<EditTarget | null>(null)

  const startLabel = formatKoreanTimePart(
    workTime.startHour,
    workTime.startMinute
  )
  const endLabel = formatKoreanTimePart(workTime.endHour, workTime.endMinute)

  const toggleTarget = (target: EditTarget) => {
    setEditingTarget(prev => (prev === target ? null : target))
  }

  return (
    <div
      className={cn('flex w-full flex-col justify-between gap-2.5', className)}
    >
      <p className="px-1 typography-body01-regular text-text-70">근무 시간</p>

      <div
        className="flex h-10 w-full items-center justify-between rounded-2xl bg-bg-light px-[60px] typography-body03-semibold text-text-100"
        role="group"
        aria-label="근무 시간 범위"
      >
        <button
          type="button"
          onClick={() => toggleTarget('start')}
          aria-pressed={editingTarget === 'start'}
          className={cn(
            'shrink-0 text-center transition-opacity',
            editingTarget === 'start' ? 'opacity-100' : 'opacity-90'
          )}
        >
          {startLabel}
        </button>
        <span aria-hidden="true">-</span>
        <button
          type="button"
          onClick={() => toggleTarget('end')}
          aria-pressed={editingTarget === 'end'}
          className={cn(
            'shrink-0 text-center transition-opacity',
            editingTarget === 'end' ? 'opacity-100' : 'opacity-90'
          )}
        >
          {endLabel}
        </button>
      </div>

      {editingTarget ? (
        <WorkTimeSegmentEditor target={editingTarget} workTime={workTime} />
      ) : null}
    </div>
  )
}
