import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo, useState } from 'react'
import { HomeScheduleCalendar } from '../../src/features/home/user/ui/HomeScheduleCalendar'
import type {
  CalendarViewData,
  HomeCalendarMode,
} from '../../src/features/home/user/types/schedule'

const baseDate = new Date('2026-01-19T09:00:00+09:00')

const mockData: CalendarViewData = {
  summary: {
    totalWorkHours: 18,
    eventCount: 5,
  },
  events: [
    {
      shiftId: 1,
      workspaceName: '스타벅스 강남점',
      position: '바리스타',
      status: 'PLANNED',
      startDateTime: '2026-01-19T09:00:00+09:00',
      endDateTime: '2026-01-19T13:00:00+09:00',
      dateKey: '2026-01-19',
      startTimeLabel: '09:00',
      endTimeLabel: '13:00',
      durationHours: 4,
    },
    {
      shiftId: 2,
      workspaceName: '스타벅스 강남점',
      position: '캐셔',
      status: 'CONFIRMED',
      startDateTime: '2026-01-20T10:00:00+09:00',
      endDateTime: '2026-01-20T14:00:00+09:00',
      dateKey: '2026-01-20',
      startTimeLabel: '10:00',
      endTimeLabel: '14:00',
      durationHours: 4,
    },
    {
      shiftId: 3,
      workspaceName: '이디야 역삼점',
      position: '홀',
      status: 'PLANNED',
      startDateTime: '2026-01-21T12:00:00+09:00',
      endDateTime: '2026-01-21T18:00:00+09:00',
      dateKey: '2026-01-21',
      startTimeLabel: '12:00',
      endTimeLabel: '18:00',
      durationHours: 6,
    },
    {
      shiftId: 4,
      workspaceName: '이디야 역삼점',
      position: '홀',
      status: 'CANCELLED',
      startDateTime: '2026-01-23T11:00:00+09:00',
      endDateTime: '2026-01-23T13:00:00+09:00',
      dateKey: '2026-01-23',
      startTimeLabel: '11:00',
      endTimeLabel: '13:00',
      durationHours: 2,
    },
    {
      shiftId: 5,
      workspaceName: '메가커피 선릉점',
      position: '바리스타',
      status: 'DELETED',
      startDateTime: '2026-01-24T08:00:00+09:00',
      endDateTime: '2026-01-24T10:00:00+09:00',
      dateKey: '2026-01-24',
      startTimeLabel: '08:00',
      endTimeLabel: '10:00',
      durationHours: 2,
    },
  ],
}

const emptyData: CalendarViewData = {
  summary: {
    totalWorkHours: 0,
    eventCount: 0,
  },
  events: [],
}

function StatefulCalendar({
  mode,
  data,
  workspaceName,
  isLoading = false,
}: {
  mode: HomeCalendarMode
  data: CalendarViewData | null
  workspaceName?: string
  isLoading?: boolean
}) {
  const [currentDate, setCurrentDate] = useState(baseDate)
  const stableData = useMemo(() => data, [data])

  return (
    <div className="border border-line-1">
      <HomeScheduleCalendar
        mode={mode}
        baseDate={currentDate}
        data={stableData}
        workspaceName={workspaceName}
        isLoading={isLoading}
        onDateChange={setCurrentDate}
      />
    </div>
  )
}

const meta = {
  title: 'features/home/user/HomeScheduleCalendar',
  component: HomeScheduleCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    mode: 'monthly',
    baseDate,
    data: mockData,
    onDateChange: () => {},
  },
} satisfies Meta<typeof HomeScheduleCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Monthly: Story = {
  render: () => (
    <StatefulCalendar
      mode='monthly'
      workspaceName='스타벅스 강남점'
      data={mockData}
    />
  ),
}

export const Weekly: Story = {
  render: () => (
    <StatefulCalendar
      mode='weekly'
      workspaceName='스타벅스 강남점'
      data={mockData}
    />
  ),
}

export const Daily: Story = {
  render: () => (
    <StatefulCalendar
      mode='daily'
      workspaceName='스타벅스 강남점'
      data={mockData}
    />
  ),
}

export const EmptyDaily: Story = {
  render: () => <StatefulCalendar mode='daily' data={emptyData} />,
}

export const LoadingMonthly: Story = {
  render: () => <StatefulCalendar mode='monthly' data={null} isLoading />,
}
