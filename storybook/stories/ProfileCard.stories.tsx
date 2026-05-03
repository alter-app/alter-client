import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ProfileCard } from '../../src/pages/my/components/ProfileCard'

const meta = {
  title: 'pages/my/components/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 358, padding: 16, background: '#f4f4f4' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileCard>

export default meta
type Story = StoryObj<typeof meta>

export const Manager: Story = {
  args: {
    nickname: '알터',
    realName: '유승완',
    isManager: true,
  },
}

export const Worker: Story = {
  args: {
    nickname: '알바생닉네임',
    realName: '홍길동',
    isManager: false,
  },
}

export const NoRealName: Story = {
  args: {
    nickname: '알터',
    isManager: true,
  },
}

export const WithAvatar: Story = {
  args: {
    nickname: '알터',
    realName: '유승완',
    isManager: true,
    avatarUrl: 'https://placehold.co/120x120/42E590/ffffff?text=A',
  },
}
