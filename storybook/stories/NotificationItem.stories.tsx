import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { NotificationItem } from '../../src/shared/ui/notification/NotificationItem'

const meta = {
  title: 'shared/ui/notification/NotificationItem',
  component: NotificationItem,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div
        style={{
          width: 390,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    category: '대타 요청',
    timeAgo: '10시간 전',
    message: '2월 4일 동양미래대에서 대타 요청이 도착했어요',
    highlightedWord: '동양미래대',
    subLabel: '자세히 보기',
    isRead: false,
    onClick: () => {},
  },
} satisfies Meta<typeof NotificationItem>

export default meta
type Story = StoryObj<typeof meta>

export const Unread: Story = {
  name: '읽지 않음',
  args: { isRead: false },
}

export const Read: Story = {
  name: '읽음',
  args: {
    isRead: true,
    timeAgo: '2일 전',
    message: '3월 30일 KFC 잠실 롯데월드점 대타 요청을 거절했어요',
    highlightedWord: 'KFC 잠실 롯데월드',
    subLabel: undefined,
  },
}

export const WithDeleteAction: Story = {
  name: '삭제 액션',
  args: {
    isRead: true,
    timeAgo: '2일 전',
    message: '3월 30일 KFC 잠실 롯데월드점 대타 요청을 거절했어요',
    highlightedWord: 'KFC 잠실 롯데월드',
    subLabel: undefined,
    onDelete: () => alert('삭제'),
  },
}

export const LongStoreName: Story = {
  name: '가게명 줄바꿈',
  args: {
    isRead: false,
    message: '2월 4일 CU 서구가정로점에서 대타 요청이 도착했어요',
    highlightedWord: 'CU 서구가정로',
    subLabel: '자세히 보기',
  },
}
