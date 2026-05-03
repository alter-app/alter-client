import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { SocialList } from '../../src/features/social/ui/SocialList'

const meta = {
  title: 'shared/ui/social/SocialList',
  component: SocialList,
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
    unread: { control: 'boolean' },
  },
} satisfies Meta<typeof SocialList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: '홍길동',
    message: '오늘 스케줄 확인 부탁드려요.',
    timeAgo: '5분 전',
    unread: false,
  },
}

export const Unread: Story = {
  args: {
    name: '김철수',
    message: '내일 대타 가능하신가요?',
    timeAgo: '1시간 전',
    unread: true,
  },
}

export const LongMessage: Story = {
  args: {
    name: '매장 매니저',
    message:
      '이번 주 금요일 야간 근무 인원이 부족해서 혹시 가능하시면 연락 주시면 감사하겠습니다.',
    timeAgo: '어제',
    unread: true,
  },
}
