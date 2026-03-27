import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  AppliedStoreList,
  type AppliedStoreItem,
} from '../../src/features/home/user/ui/AppliedStoreList'

const sampleStores: AppliedStoreItem[] = [
  { id: 1, storeName: '지원한 매장 이름입니다.', status: 'applied' },
  { id: 2, storeName: '지원한 매장 이름입니다.', status: 'rejected' },
  { id: 3, storeName: '지원한 매장 이름입니다.', status: 'applied' },
  { id: 4, storeName: '지원한 매장 이름입니다.', status: 'applied' },
  { id: 5, storeName: '지원한 매장 이름입니다.', status: 'rejected' },
]

const meta = {
  title: 'features/home/AppliedStoreList',
  component: AppliedStoreList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-[358px] bg-bg-light p-3'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppliedStoreList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stores: sampleStores,
  },
}
