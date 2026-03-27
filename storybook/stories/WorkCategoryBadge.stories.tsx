import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { WorkCategoryBadge } from '../../src/shared/ui/home/WorkCategoryBadge'

const meta = {
  title: 'shared/ui/common/WorkCategoryBadge',
  component: WorkCategoryBadge,
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
} satisfies Meta<typeof WorkCategoryBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '카페',
  },
}
