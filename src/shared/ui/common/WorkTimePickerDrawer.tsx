import { useState } from 'react'
import { Drawer } from 'vaul'
import { WheelPicker } from '@/shared/ui/common/WheelPicker'
import {
  hour24To12Parts,
  partsToHour24,
  snapMinuteToTen,
  minuteToTenMinuteIndex,
  WORK_TIME_MINUTE_OPTIONS,
  type TimePeriod,
} from '@/shared/lib/formatKoreanWorkTime'
import type { WorkTimeEditorState } from '@/shared/types/workTime'
import { useMobileLayoutMaxWidth } from '@/shared/ui/mobileLayoutWidth'

const PERIOD_ITEMS = ['오전', '오후'] as const
const HOUR_ITEMS = [
  '시',
  '12시',
  ...Array.from({ length: 11 }, (_, i) => `${i + 1}시`),
]
const MINUTE_ITEMS = ['분', ...WORK_TIME_MINUTE_OPTIONS.map(m => `${m}분`)]

type TimeTarget = 'start' | 'end'
type TimeSelection = {
  period: TimePeriod
  hour12: number | null
  minute: string
}

interface WorkTimePickerDrawerProps {
  open: boolean
  target: TimeTarget | null
  workTime: WorkTimeEditorState
  onOpenChange: (open: boolean) => void
}

export function WorkTimePickerDrawer({
  open,
  target,
  workTime,
  onOpenChange,
}: WorkTimePickerDrawerProps) {
  if (!open || !target) return null

  return (
    <OpenWorkTimePickerDrawer
      target={target}
      workTime={workTime}
      onOpenChange={onOpenChange}
    />
  )
}

function OpenWorkTimePickerDrawer({
  target,
  workTime,
  onOpenChange,
}: {
  target: TimeTarget
  workTime: WorkTimeEditorState
  onOpenChange: (open: boolean) => void
}) {
  const maxWidth = useMobileLayoutMaxWidth()
  const hour = target === 'start' ? workTime.startHour : workTime.endHour
  const minute = target === 'start' ? workTime.startMinute : workTime.endMinute
  const setTime =
    target === 'start' ? workTime.setStartTime : workTime.setEndTime

  const [selection, setSelection] = useState<TimeSelection>(() => {
    const { period, hour12 } = hour24To12Parts(hour)
    return { period, hour12: hour ? hour12 : null, minute }
  })

  const select = (next: TimeSelection) => {
    setSelection(next)
    if (next.hour12 !== null && next.minute) {
      setTime(partsToHour24(next.period, next.hour12), next.minute)
    }
  }

  const periodIndex = selection.period === '오후' ? 1 : 0
  const hourIndex =
    selection.hour12 === null
      ? 0
      : selection.hour12 === 12
        ? 1
        : selection.hour12 + 1
  const minuteIndex = selection.minute
    ? minuteToTenMinuteIndex(selection.minute) + 1
    : 0

  const applyPeriod = (index: number) => {
    select({ ...selection, period: index === 1 ? '오후' : '오전' })
  }

  const applyHour = (index: number) => {
    select({
      ...selection,
      hour12: index === 0 ? null : index === 1 ? 12 : index - 1,
    })
  }

  const applyMinute = (index: number) => {
    select({
      ...selection,
      minute:
        index === 0
          ? ''
          : snapMinuteToTen(WORK_TIME_MINUTE_OPTIONS[index - 1] ?? '00'),
    })
  }

  return (
    <Drawer.Root open onOpenChange={onOpenChange} handleOnly>
      <Drawer.Portal>
        <Drawer.Overlay
          data-testid="work-time-picker-overlay"
          className="fixed inset-0 z-50 mx-auto w-full bg-black/40"
          style={{ maxWidth }}
        />
        <Drawer.Content
          data-vaul-no-drag
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[263px] w-full flex-col rounded-t-[40px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] outline-none"
          style={{ maxWidth }}
        >
          <Drawer.Title className="pt-[18px] text-center typography-body01-semibold text-text-100">
            근무 시간 선택
          </Drawer.Title>

          <div
            data-vaul-no-drag
            className="mt-6 flex flex-1 items-center justify-center gap-2 px-6 pb-6"
          >
            <WheelPicker
              className="w-24 shrink-0"
              items={PERIOD_ITEMS}
              selectedIndex={periodIndex}
              onChange={applyPeriod}
              aria-label="오전 또는 오후"
            />
            <WheelPicker
              className="w-24 shrink-0"
              items={HOUR_ITEMS}
              selectedIndex={hourIndex}
              onChange={applyHour}
              aria-label="시"
            />
            <span
              className="shrink-0 pb-1 typography-headline01 text-text-100"
              aria-hidden="true"
            >
              :
            </span>
            <WheelPicker
              className="w-24 shrink-0"
              items={MINUTE_ITEMS}
              selectedIndex={minuteIndex}
              onChange={applyMinute}
              aria-label="분"
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
