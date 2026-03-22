import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  SubstituteApprovalCard,
  type SubstituteRequestItem,
} from '../../src/shared/ui/manager/SubstituteApprovalCard'

const sampleRequests: SubstituteRequestItem[] = [
  {
    id: '1',
    name: '나영채',
    role: '알바',
    dateRange: '다음 근무 예정일 2025. 1. 1.',
    status: 'accepted',
  },
  {
    id: '2',
    name: '나영채',
    role: '알바',
    dateRange: '다음 근무 예정일 2025. 1. 1.',
    status: 'pending',
  },
  {
    id: '3',
    name: '나영채',
    role: '알바',
    dateRange: '다음 근무 예정일 2025. 1. 1.',
    status: 'pending',
  },
]

const meta = {
  title: 'shared/ui/manager/SubstituteApprovalCard',
  component: SubstituteApprovalCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 360 }} className="bg-[#EFEFEF] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubstituteApprovalCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    requests: sampleRequests,
    onViewMore: () => {},
    onRequestClick: () => {},
  },
}
