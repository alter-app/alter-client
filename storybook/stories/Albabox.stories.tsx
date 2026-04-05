import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Albabox } from '../../src/shared/ui/manager/alba-find/Albabox'

const meta = {
  title: 'shared/ui/alba-find/Albabox',
  component: Albabox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div
        style={{ width: 360 }}
        className="border border-gray-200 bg-white px-4"
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    saved: { control: 'boolean' },
    onBookmarkClick: { action: 'bookmark' },
  },
} satisfies Meta<typeof Albabox>

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  storeName: '스타벅스 강남역점',
  title: '주말 오전 카페 알바 모집 (경력 무관)',
  wageAmount: '12,000',
  timeRange: '09:00–15:00',
  workDays: '토·일',
  distance: '도보 5분',
  postedAgo: '2시간 전',
}

export const Default: Story = {
  args: {
    ...baseArgs,
    saved: false,
    likeCount: '24',
  },
}

export const Saved: Story = {
  args: {
    ...baseArgs,
    saved: true,
    likeCount: '24',
  },
}

export const WithoutLikeCount: Story = {
  args: {
    ...baseArgs,
    saved: false,
    likeCount: undefined,
  },
}
