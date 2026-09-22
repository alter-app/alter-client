import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { WorkTimeRangeField } from '../../src/pages/manager/worker-schedule/components/WorkTimeRangeField'

const meta = {
  title: 'pages/manager/worker-schedule/WorkTimeRangeField',
  component: WorkTimeRangeField,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof WorkTimeRangeField>

export default meta
type Story = StoryObj<typeof meta>

export const AccessibleTimePicker: Story = {
  args: {
    workTime: {
      startHour: '09',
      startMinute: '00',
      endHour: '18',
      endMinute: '00',
      setStartTime: fn(),
      setEndTime: fn(),
    },
  },
  play: async ({ args, canvasElement }) => {
    const buttons = within(
      within(canvasElement).getByRole('group', { name: '근무 시간 범위' })
    ).getAllByRole('button')
    const body = within(canvasElement.ownerDocument.body)

    await userEvent.click(buttons[0])
    await expect(
      body.getByRole('dialog', { name: '근무 시간 선택' })
    ).toBeVisible()
    body.getByRole('listbox', { name: '시' }).focus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(args.workTime.setStartTime).toHaveBeenCalledWith('08', '00')

    await userEvent.keyboard('{Escape}')
    await userEvent.click(buttons[1])
    await expect(
      body.getByRole('dialog', { name: '근무 시간 선택' })
    ).toBeVisible()
  },
}
