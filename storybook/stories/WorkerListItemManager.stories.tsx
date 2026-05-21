import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorkerListItem } from '../../src/features/manager/worker-list/ui/WorkerListItem'
import { ScheduleColor } from '../../src/features/manager/worker-schedule/types/scheduleColor'

const meta = {
  title: 'features/manager/worker-list/WorkerListItem',
  component: WorkerListItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-[390px] border border-line-1">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WorkerListItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: '이름임',
    workspaceName: '매장 이름',
    nextShiftTime: '00:00 ~ 00:00',
    scheduleColor: ScheduleColor.Yellow,
    role: 'manager',
  },
}

export const WithSwipe: Story = {
  args: {
    name: '이름임',
    workspaceName: '매장 이름',
    nextShiftTime: '09:00 ~ 18:00',
    scheduleColor: ScheduleColor.Purple,
    role: 'staff',
    onEdit: () => alert('수정'),
    onDelete: () => alert('삭제'),
  },
}

export const SwipeableList: Story = {
  args: {
    name: '',
    workspaceName: '',
    nextShiftTime: '',
    scheduleColor: ScheduleColor.Yellow,
    role: 'staff',
  },
  render: () => (
    <div className="w-[390px] divide-y divide-line-1 overflow-hidden rounded-2xl border border-line-1">
      <WorkerListItem
        name="김매니저"
        workspaceName="스타벅스 강남점"
        nextShiftTime="09:00 ~ 18:00"
        scheduleColor={ScheduleColor.Yellow}
        role="manager"
        onEdit={() => alert('김매니저 수정')}
        onDelete={() => alert('김매니저 삭제')}
      />
      <WorkerListItem
        name="이알바"
        workspaceName="스타벅스 강남점"
        nextShiftTime="10:00 ~ 14:00"
        scheduleColor={ScheduleColor.Purple}
        role="staff"
        onEdit={() => alert('이알바 수정')}
        onDelete={() => alert('이알바 삭제')}
      />
      <WorkerListItem
        name="박알바"
        workspaceName="스타벅스 강남점"
        nextShiftTime="15:00 ~ 21:00"
        scheduleColor={ScheduleColor.Pink}
        role="staff"
        onEdit={() => alert('박알바 수정')}
        onDelete={() => alert('박알바 삭제')}
      />
      <WorkerListItem
        name="최알바"
        workspaceName="스타벅스 강남점"
        nextShiftTime="09:00 ~ 13:00"
        scheduleColor={ScheduleColor.Blue}
        role="staff"
        onEdit={() => alert('최알바 수정')}
        onDelete={() => alert('최알바 삭제')}
      />
    </div>
  ),
}
