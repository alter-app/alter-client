import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { WorkerListItem } from '../../src/shared/ui/home/WorkerListItem'

const meta = {
  title: 'shared/ui/home/WorkerListItem',
  component: WorkerListItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }} className="border border-gray-200 rounded-lg px-2">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkerListItem>

export default meta
type Story = StoryObj<typeof meta>

export const ManagerVariant: Story = {
  args: {
    name: '이름임',
    role: '사장님',
    variant: 'manager',
    nextWorkDate: '2025. 1. 1.',
    onOptions: () => {},
  },
}

export const WorkerVariant: Story = {
  args: {
    name: '이름임',
    role: '알바',
    variant: 'worker',
    nextWorkDate: '2025. 1. 1.',
    onOptions: () => {},
  },
}
