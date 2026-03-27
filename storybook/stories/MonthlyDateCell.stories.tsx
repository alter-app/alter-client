import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MonthlyDateCell } from '../../src/features/home/user/ui/MonthlyDateCell'

const meta = {
  title: 'features/home/MonthlyDateCell',
  component: MonthlyDateCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='rounded-xl border p-6'>
        <Story />
      </div>
    ),
  ],
  args: {
    dayText: '1',
    isCurrentMonth: true,
    isWeekend: false,
    isSelected: false,
    isActiveDay: false,
  },
} satisfies Meta<typeof MonthlyDateCell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ActiveDay: Story = {
  args: {
    dayText: '9',
    isActiveDay: true,
  },
}

export const SelectedDay: Story = {
  args: {
    dayText: '8',
    isSelected: true,
  },
}

export const Weekend: Story = {
  args: {
    dayText: '4',
    isWeekend: true,
  },
}

export const OutOfMonth: Story = {
  args: {
    dayText: '31',
    isCurrentMonth: false,
  },
}
