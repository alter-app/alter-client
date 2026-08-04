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
