import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { PostingListCard } from '../../src/features/manager/posting/ui/PostingListCard'
import type { PostingListItem } from '../../src/features/manager/posting/types/posting'

const posting: PostingListItem = {
  id: 1,
  workspaceId: 10,
  workspaceName: '알터 강남점',
  businessType: '카페',
  title: '주말 홀서빙 · 오후 마감조',
  paymentType: 'HOURLY',
  payAmount: 12000,
  status: 'OPEN',
  schedules: [
    {
      id: 1,
      workingDays: ['SATURDAY', 'SUNDAY'],
      startTime: '17:00',
      endTime: '22:00',
      position: '홀서빙',
      positionsNeeded: 2,
    },
  ],
  createdAt: '2026-08-04T00:00:00',
}

const meta = {
  title: 'features/manager/posting/PostingListCard',
  component: PostingListCard,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[360px] bg-bg-light p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    posting,
    onClick: () => {},
  },
} satisfies Meta<typeof PostingListCard>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('모집중')).toBeVisible()
  },
}

export const Closed: Story = {
  args: {
    posting: { ...posting, status: 'CLOSED' },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('모집완료')).toBeVisible()
  },
}
