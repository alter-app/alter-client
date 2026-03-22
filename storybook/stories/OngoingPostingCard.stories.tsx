import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  OngoingPostingCard,
  type JobPostingItem,
} from '../../src/shared/ui/manager/OngoingPostingCard'

const samplePostings: JobPostingItem[] = [
  {
    id: '1',
    dDay: 'D-3',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '17:00 ~ 21:00',
    workDays: '수, 목, 금',
  },
  {
    id: '2',
    dDay: 'D-7',
    title: '[가게이름] 평일 저녁 마감 근무자 모집',
    wage: '시급 10,030원',
    workHours: '07:00 ~ 13:00',
    workDays: '월, 화, 수',
  },
]

const meta = {
  title: 'shared/ui/manager/OngoingPostingCard',
  component: OngoingPostingCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }} className="bg-[#EFEFEF] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OngoingPostingCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    postings: samplePostings,
    onViewMore: () => {},
    onPostingClick: () => {},
  },
}

export const Single: Story = {
  args: {
    postings: [samplePostings[0]],
    onViewMore: () => {},
    onPostingClick: () => {},
  },
}
