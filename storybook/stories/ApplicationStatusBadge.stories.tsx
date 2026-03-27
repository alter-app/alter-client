import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { ApplicationStatusBadge } from '../../src/shared/ui/home/ApplicationStatusBadge'

const meta = {
  title: 'shared/ui/home/ApplicationStatusBadge',
  component: ApplicationStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='bg-bg-light p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationStatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Applied: Story = {
  args: {
    status: 'applied',
  },
}

export const Rejected: Story = {
  args: {
    status: 'rejected',
  },
}
