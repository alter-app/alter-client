import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  TodayWorkerList,
  type TodayWorkerItem,
} from '../../src/features/manager/home/ui/TodayWorkerList'

const sampleWorkers: TodayWorkerItem[] = [
  { id: 1, name: '알바생1', workTime: '00:00 ~ 00:00' },
  { id: 2, name: '알바생2', workTime: '09:00 ~ 18:00' },
  { id: 3, name: '알바생3', workTime: '12:00 ~ 20:00' },
]

const meta = {
  title: 'features/home/manager/TodayWorkerList',
  component: TodayWorkerList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-[468px] bg-bg-light p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TodayWorkerList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    workers: sampleWorkers,
  },
}
