import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { WorkerImageCard } from '../../src/shared/ui/manager/WorkerImageCard'

const meta = {
  title: 'shared/ui/manager/WorkerImageCard',
  component: WorkerImageCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof WorkerImageCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: '알바생1',
    timeRange: '00:00 ~ 00:00',
  },
}

export const WithImage: Story = {
  args: {
    name: '김철수',
    timeRange: '09:00 ~ 18:00',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=worker',
  },
}
