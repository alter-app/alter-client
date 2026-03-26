import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  WorkingStoresList,
  type WorkingStoreItem,
} from '../../src/features/home/ui/WorkingStoresList'

const sampleStores: WorkingStoreItem[] = [
  {
    workspaceId: 1,
    businessName: '스타벅스 강남점',
    employedAt: '2024-01-15',
    nextShiftDateTime: '2026-01-20T09:00:00',
  },
  {
    workspaceId: 2,
    businessName: '가게이름',
    employedAt: '2024-02-01',
    nextShiftDateTime: '2026-01-22T09:00:00',
  },
  {
    workspaceId: 3,
    businessName: '가게이름',
    employedAt: '2023-12-11',
    nextShiftDateTime: '2026-02-18T09:00:00',
  },
]

const meta = {
  title: 'features/home/WorkingStoresList',
  component: WorkingStoresList,
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
} satisfies Meta<typeof WorkingStoresList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stores: sampleStores,
    selectedSort: 'right',
  },
}

export const SortByName: Story = {
  args: {
    stores: sampleStores,
    selectedSort: 'left',
  },
}
