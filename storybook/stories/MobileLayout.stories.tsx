import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent, within } from 'storybook/test'

import { WorkTimeRangeField } from '../../src/pages/manager/worker-schedule/components/WorkTimeRangeField'
import { MobileLayout } from '../../src/shared/ui/MobileLayout'
import { MobileLayoutWithDocbar } from '../../src/shared/ui/MobileLayoutWithDocbar'

const meta = {
  title: 'shared/ui/MobileLayout',
  component: MobileLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="bg-gray-100 min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <MobileLayout {...args}>
      <div className="p-6 bg-white min-h-[200px]">
        <p className="typography-body01-regular text-gray-800">
          모바일 레이아웃 안에 들어가는 콘텐츠
        </p>
      </div>
    </MobileLayout>
  ),
}

export const TimePickerUsesLayoutWidth: Story = {
  render: () => (
    <MobileLayout maxWidth="390px">
      <WorkTimeRangeField
        workTime={{
          startHour: '09',
          startMinute: '00',
          endHour: '18',
          endMinute: '00',
          setStartTime: () => {},
          setEndTime: () => {},
        }}
      />
    </MobileLayout>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const frame = canvasElement.querySelector('.mobile-layout-container')
    const buttons = within(
      canvas.getByRole('group', { name: '근무 시간 범위' })
    ).getAllByRole('button')

    await userEvent.click(buttons[0])

    const dialog = body.getByRole('dialog', { name: '근무 시간 선택' })
    const overlay = body.getByTestId('work-time-picker-overlay')
    const expectedWidth = Math.min(window.innerWidth, 390)

    for (const element of [frame, dialog, overlay]) {
      const bounds = element!.getBoundingClientRect()
      await expect(bounds.width).toBe(expectedWidth)
      await expect(bounds.left).toBeCloseTo(
        (window.innerWidth - expectedWidth) / 2
      )
    }
  },
}

export const TimePickerUsesDocbarLayoutWidth: Story = {
  render: () => (
    <MemoryRouter>
      <MobileLayoutWithDocbar maxWidth="400px">
        <WorkTimeRangeField
          workTime={{
            startHour: '09',
            startMinute: '00',
            endHour: '18',
            endMinute: '00',
            setStartTime: () => {},
            setEndTime: () => {},
          }}
        />
      </MobileLayoutWithDocbar>
    </MemoryRouter>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)
    const buttons = within(
      canvas.getByRole('group', { name: '근무 시간 범위' })
    ).getAllByRole('button')

    await userEvent.click(buttons[0])

    const dialog = body.getByRole('dialog', { name: '근무 시간 선택' })
    const overlay = body.getByTestId('work-time-picker-overlay')
    const expectedWidth = Math.min(window.innerWidth, 400)

    for (const element of [dialog, overlay]) {
      const bounds = element.getBoundingClientRect()
      await expect(bounds.width).toBe(expectedWidth)
      await expect(bounds.left).toBeCloseTo(
        (window.innerWidth - expectedWidth) / 2
      )
    }
  },
}
