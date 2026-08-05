import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { usePostingForm } from '../../src/features/manager/posting/hooks/usePostingForm'
import type { Posting } from '../../src/features/manager/posting/types/posting'
import { ScheduleEditor } from '../../src/features/manager/posting/ui/ScheduleEditor'

const posting: Posting = {
  id: 1,
  workspaceId: 10,
  workspaceName: '알터 강남점',
  businessType: '카페',
  title: '주말 홀서빙 모집',
  description: '상세내용',
  paymentType: 'HOURLY',
  payAmount: 12000,
  status: 'OPEN',
  applicantCount: 6,
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

function ScheduleEditorStory({ initialPosting }: { initialPosting: Posting }) {
  const form = usePostingForm({ posting: initialPosting })
  return <ScheduleEditor form={form} />
}

const meta = {
  title: 'features/manager/posting/ScheduleEditor',
  component: ScheduleEditorStory,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[360px] bg-white p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleEditorStory>

export default meta
type Story = StoryObj<typeof meta>

export const LastExistingSchedule: Story = {
  args: { initialPosting: posting },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: '시작 시간 선택' })
    ).toHaveTextContent('17:00')
    await expect(
      canvas.getByRole('button', { name: '종료 시간 선택' })
    ).toHaveTextContent('22:00')

    const selectedDayStyle = window.getComputedStyle(
      canvas.getByRole('button', { name: '토' })
    )
    const unselectedDayStyle = window.getComputedStyle(
      canvas.getByRole('button', { name: '월' })
    )
    await expect(selectedDayStyle.backgroundColor).toBe('rgb(7, 192, 121)')
    await expect(selectedDayStyle.color).toBe('rgb(255, 255, 255)')
    await expect(unselectedDayStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(unselectedDayStyle.color).toBe('rgb(163, 163, 163)')
    await expect(unselectedDayStyle.borderColor).toBe('rgb(239, 239, 239)')

    await userEvent.click(canvas.getByRole('button', { name: '일정 1 삭제' }))
    await expect(
      within(canvasElement.ownerDocument.body).getByText(
        '모든 근무일정을 삭제한 상태로 수정 완료하면 공고가 자동으로 모집 마감됩니다.'
      )
    ).toBeVisible()
  },
}

export const EmptySchedule: Story = {
  args: { initialPosting: { ...posting, schedules: [] } },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('등록된 근무일정이 없어요.')
    ).toBeVisible()
  },
}

export const MultipleSchedules: Story = {
  args: {
    initialPosting: {
      ...posting,
      schedules: [
        ...posting.schedules,
        {
          id: 2,
          workingDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
          startTime: '09:00',
          endTime: '15:00',
          position: '마감 청소',
          positionsNeeded: 1,
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const removeButtons = within(canvasElement).getAllByRole('button', {
      name: /일정 \d+ 삭제/,
    })
    await expect(removeButtons).toHaveLength(2)

    for (const button of removeButtons) {
      const style = window.getComputedStyle(button)
      await expect(style.borderWidth).toBe('1px')
      await expect(style.borderStyle).toBe('solid')
      await expect(style.borderColor).toBe('rgb(229, 229, 229)')
    }
  },
}
