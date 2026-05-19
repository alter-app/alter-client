import { Drawer } from 'vaul'
import { WheelPicker } from '@/pages/manager/worker-schedule/components/WheelPicker'
import {
  hour24To12Parts,
  partsToHour24,
  snapMinuteToTen,
  minuteToTenMinuteIndex,
  WORK_TIME_MINUTE_OPTIONS,
  type TimePeriod,
} from '@/pages/manager/worker-schedule/lib/formatKoreanWorkTime'
import type { WorkTimeEditorState } from '@/pages/manager/worker-schedule/types/workTime'

const PERIOD_ITEMS = ['오전', '오후'] as const
const HOUR_ITEMS = Array.from({ length: 12 }, (_, i) => `${i + 1}시`)
const MINUTE_ITEMS = WORK_TIME_MINUTE_OPTIONS.map(m => `${m}분`)

type TimeTarget = 'start' | 'end'

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

  const hour = target === 'start' ? workTime.startHour : workTime.endHour
  const minute = target === 'start' ? workTime.startMinute : workTime.endMinute
  const setHour =
    target === 'start' ? workTime.setStartHour : workTime.setEndHour
  const setMinute =
    target === 'start' ? workTime.setStartMinute : workTime.setEndMinute

  const { period, hour12 } = hour24To12Parts(hour)
  const periodIndex = period === '오후' ? 1 : 0
  const hourIndex = Math.min(11, Math.max(0, hour12 - 1))
  const minuteIndex = Math.max(0, minuteToTenMinuteIndex(minute))

  const applyPeriod = (index: number) => {
    const nextPeriod: TimePeriod = index === 1 ? '오후' : '오전'
    setHour(partsToHour24(nextPeriod, hour12))
  }

  const applyHour = (index: number) => {
    setHour(partsToHour24(period, index + 1))
  }

  const applyMinute = (index: number) => {
    setMinute(snapMinuteToTen(WORK_TIME_MINUTE_OPTIONS[index] ?? '00'))
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} handleOnly>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content
          data-vaul-no-drag
          className="fixed inset-x-0 bottom-0 z-50 flex h-[263px] flex-col rounded-t-[40px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.15)] outline-none"
        >
          <p className="pt-[18px] text-center typography-body01-semibold text-text-100">
            근무 시간 선택
          </p>

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
