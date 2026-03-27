import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { AppliedStoreCard } from '../../src/features/home/user/ui/AppliedStoreCard'

const meta = {
  title: 'features/home/user/AppliedStoreCard',
  component: AppliedStoreCard,
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
} satisfies Meta<typeof AppliedStoreCard>

export default meta
type Story = StoryObj<typeof meta>

export const Applied: Story = {
  args: {
    storeName: '지원한 매장\n이름입니다.',
    status: 'applied',
  },
}

export const Rejected: Story = {
  args: {
    storeName: '지원한 매장\n이름입니다.',
    status: 'rejected',
  },
}
