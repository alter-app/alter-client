import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { WorkerRoleBadge } from '../../src/shared/ui/home/WorkerRoleBadge'

const meta = {
  title: 'shared/ui/home/WorkerRoleBadge',
  component: WorkerRoleBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='flex items-center gap-2 p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkerRoleBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Staff: Story = {
  args: {
    role: 'staff',
  },
}

export const Manager: Story = {
  args: {
    role: 'manager',
  },
}
