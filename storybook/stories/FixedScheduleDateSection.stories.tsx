import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { format } from 'date-fns'
import { expect, fn, userEvent, within } from 'storybook/test'

import type {
  FixedScheduleRecurrenceForm,
  FixedScheduleRecurrenceType,
} from '../../src/features/manager'
import { FixedScheduleDateSection } from '../../src/pages/manager/worker-schedule/components/FixedScheduleDateSection'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'] as const

const workTime = {
  startHour: '09',
  startMinute: '00',
  endHour: '18',
  endMinute: '00',
  setStartTime: fn(),
  setEndTime: fn(),
}

function Demo({ initial }: { initial: FixedScheduleRecurrenceForm }) {
  const [form, setForm] = useState(initial)
  const [days, setDays] = useState<string[]>(['월', '수'])
  const patch = (next: Partial<FixedScheduleRecurrenceForm>) =>
    setForm(prev => ({ ...prev, ...next, dirty: true }))

  return (
    <div className="w-[375px] bg-bg-light p-4">
      <FixedScheduleDateSection
        isOpen
        onToggle={() => {}}
        workdayOptions={WEEKDAYS}
        selectedDays={days}
        onToggleDay={day =>
          setDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
          )
        }
        recurrence={form}
        onRecurrenceTypeChange={(recurrenceType: FixedScheduleRecurrenceType) =>
          patch({
            recurrenceType,
            weekOfMonth: recurrenceType === 'MONTHLY' ? form.weekOfMonth : null,
          })
        }
        onWeekOfMonthChange={weekOfMonth => patch({ weekOfMonth })}
        onStartDateChange={date =>
          patch({ startDate: format(date, 'yyyy-MM-dd') })
        }
        onEndDateChange={date =>
          patch({ endDate: date ? format(date, 'yyyy-MM-dd') : null })
        }
        workTime={workTime}
      />
      <output data-testid="form-state" className="mt-4 block text-xs">
        {JSON.stringify(form)}
      </output>
    </div>
  )
}

const meta = {
  title: 'pages/manager/worker-schedule/FixedScheduleDateSection',
  component: Demo,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Demo>

export default meta
type Story = StoryObj<typeof meta>

export const WeeklyWithoutEndDate: Story = {
  args: {
    initial: {
      recurrenceType: 'WEEKLY',
      weekOfMonth: null,
      startDate: '2026-11-08',
      endDate: null,
      dirty: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('2026년 11월 8일')).toBeVisible()
    await expect(canvas.queryByText('종료 날짜')).toBeNull()
    await expect(
      canvas.queryByRole('group', { name: '매월 반복 주차' })
    ).toBeNull()

    await userEvent.click(canvas.getByRole('switch', { name: '종료일 없음' }))
    await expect(canvas.getByText('종료 날짜')).toBeVisible()
    await expect(canvas.getByTestId('form-state')).toHaveTextContent(
      '"endDate":"2026-11-08"'
    )
  },
}

export const MonthlySecondWeek: Story = {
  args: {
    initial: {
      recurrenceType: 'MONTHLY',
      weekOfMonth: 2,
      startDate: '2026-10-01',
      endDate: '2027-03-31',
      dirty: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const weeks = canvas.getByRole('group', { name: '매월 반복 주차' })
    await expect(
      within(weeks).getByRole('button', { name: '둘째' })
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(canvas.getByRole('button', { name: '월' })).toBeVisible()

    await userEvent.click(within(weeks).getByRole('button', { name: '다섯째' }))
    await expect(canvas.getByTestId('form-state')).toHaveTextContent(
      '"weekOfMonth":5'
    )
  },
}

export const LegacyRuleWithoutStartDate: Story = {
  args: {
    initial: {
      recurrenceType: 'WEEKLY',
      weekOfMonth: null,
      startDate: null,
      endDate: null,
      dirty: false,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('선택해 주세요')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: '매월' }))
    await expect(
      canvas.getByRole('group', { name: '매월 반복 주차' })
    ).toBeVisible()
    await expect(canvas.getByTestId('form-state')).toHaveTextContent(
      '"recurrenceType":"MONTHLY"'
    )
  },
}
