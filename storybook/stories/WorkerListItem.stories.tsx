import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { WorkerListItem } from '../../src/shared/ui/manager/WorkerListItem'

const meta = {
  title: 'shared/ui/manager/WorkerListItem',
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

export const Manager: Story = {
  args: {
    name: '이름임',
    role: '매니저',
    nextWorkDate: '2025. 1. 1.',
    onOptions: () => {},
  },
}

export const PartTimer: Story = {
  args: {
    name: '이름임',
    role: '알바',
    nextWorkDate: '2025. 1. 1.',
    onOptions: () => {},
  },
}
