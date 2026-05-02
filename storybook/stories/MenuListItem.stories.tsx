import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { MenuListItem } from '../../src/pages/my/components/MenuListItem'
import UserIcon from '../../src/assets/icons/my/user.svg?react'
import StoreIcon from '../../src/assets/icons/my/store.svg?react'
import HeadphonesIcon from '../../src/assets/icons/my/headphones.svg?react'

const meta = {
  title: 'pages/my/components/MenuListItem',
  component: MenuListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 358, background: '#ffffff', borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuListItem>

export default meta
type Story = StoryObj<typeof meta>

export const WithIcon: Story = {
  args: {
    icon: UserIcon,
    label: '내 정보',
  },
}

export const WithoutIcon: Story = {
  args: {
    label: '닉네임 변경',
  },
}

export const LastItem: Story = {
  args: {
    icon: HeadphonesIcon,
    label: '문의하기',
    isLast: true,
  },
}

export const Stacked: Story = {
  render: () => (
    <>
      <MenuListItem icon={UserIcon} label="내 정보" />
      <MenuListItem icon={StoreIcon} label="업장 등록 신청" />
      <MenuListItem icon={HeadphonesIcon} label="문의하기" isLast />
    </>
  ),
  args: {
    label: 'placeholder',
  },
}
