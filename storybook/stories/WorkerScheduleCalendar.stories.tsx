import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScheduleColor } from '../../src/features/manager/worker-schedule/types/scheduleColor'
import { WorkerScheduleCalendar } from '../../src/features/manager/worker-list/ui/WorkerScheduleCalendar'
import type { WorkerScheduleData } from '../../src/features/manager/worker-list/types/workerSchedule'

const baseDate = new Date('2026-05-01T00:00:00+09:00')

const mockData: WorkerScheduleData = {
  '2026-05-01': [ScheduleColor.Pink],
  '2026-05-02': [ScheduleColor.Pink, ScheduleColor.Blue],
  '2026-05-05': [
    ScheduleColor.Purple,
    ScheduleColor.Yellow,
    ScheduleColor.Blue,
  ],
  '2026-05-06': [
    ScheduleColor.Pink,
    ScheduleColor.Purple,
    ScheduleColor.Blue,
    ScheduleColor.Yellow,
  ],
  '2026-05-07': [
    ScheduleColor.Pink,
    ScheduleColor.LightPurple,
    ScheduleColor.Blue,
    ScheduleColor.Yellow,
    ScheduleColor.Gray,
  ],
  '2026-05-08': [ScheduleColor.LightPink, ScheduleColor.Purple],
  '2026-05-12': [
    ScheduleColor.Blue,
    ScheduleColor.Yellow,
    ScheduleColor.DarkGray,
  ],
  '2026-05-13': [ScheduleColor.Pink],
  '2026-05-14': [
    ScheduleColor.Pink,
    ScheduleColor.Purple,
    ScheduleColor.Blue,
    ScheduleColor.Yellow,
  ],
  '2026-05-19': [ScheduleColor.LightPurple, ScheduleColor.LightPink],
  '2026-05-20': [
    ScheduleColor.Blue,
    ScheduleColor.Yellow,
    ScheduleColor.Purple,
  ],
  '2026-05-21': [ScheduleColor.Pink, ScheduleColor.Blue, ScheduleColor.Gray],
  '2026-05-26': [ScheduleColor.Purple],
  '2026-05-27': [ScheduleColor.LightPink, ScheduleColor.Blue],
  '2026-05-28': [
    ScheduleColor.Pink,
    ScheduleColor.Purple,
    ScheduleColor.Yellow,
    ScheduleColor.Blue,
  ],
}

function CalendarWrapper({ data }: { data: WorkerScheduleData | null }) {
  return (
    <div className="w-fit border border-line-1 p-4 shadow-sm">
      <WorkerScheduleCalendar
        baseDate={baseDate}
        data={data}
        onEditClick={() => {}}
      />
    </div>
  )
}

const meta = {
  title: 'features/manager/worker-list/WorkerScheduleCalendar',
  component: WorkerScheduleCalendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    baseDate,
    data: mockData,
    onEditClick: () => {},
  },
} satisfies Meta<typeof WorkerScheduleCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const WithWorkers: Story = {
  render: () => <CalendarWrapper data={mockData} />,
}

export const Empty: Story = {
  render: () => <CalendarWrapper data={null} />,
}

export const SingleWorkerPerDay: Story = {
  render: () => (
    <CalendarWrapper
      data={{
        '2026-05-05': [ScheduleColor.Pink],
        '2026-05-12': [ScheduleColor.Purple],
        '2026-05-19': [ScheduleColor.Blue],
        '2026-05-26': [ScheduleColor.Yellow],
      }}
    />
  ),
}
