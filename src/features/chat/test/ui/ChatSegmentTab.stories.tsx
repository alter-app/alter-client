import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { ChatSegmentTab } from '@/features/chat/ui/ChatSegmentTab'
import type { ChatSegment } from '@/features/chat/types/chat'

function InteractiveChatSegmentTab({
  unreadCountBySegment,
}: {
  unreadCountBySegment?: Partial<Record<ChatSegment, number>>
}) {
  const [segment, setSegment] = useState<ChatSegment>('personal')

  return (
    <div className="w-[428px]">
      <ChatSegmentTab
        activeSegment={segment}
        onSegmentChange={setSegment}
        unreadCountBySegment={unreadCountBySegment}
      />
    </div>
  )
}

const meta = {
  title: 'features/chat/ChatSegmentTab',
  component: InteractiveChatSegmentTab,
  parameters: { layout: 'centered' },
  args: { unreadCountBySegment: { personal: 3, group: 1 } },
} satisfies Meta<typeof InteractiveChatSegmentTab>

export default meta
type Story = StoryObj<typeof meta>

export const PersonalActiveByDefault: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const personal = canvas.getByRole('tab', { name: /개인 채팅/ })
    const group = canvas.getByRole('tab', { name: /전체 채팅/ })

    await expect(personal).toHaveAttribute('aria-selected', 'true')
    await expect(group).toHaveAttribute('aria-selected', 'false')

    // 세그먼트별 미읽음 합계를 각각 표기합니다
    await expect(canvas.getByText('3')).toBeVisible()
    await expect(canvas.getByText('1')).toBeVisible()
  },
}

export const SwitchToGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('tab', { name: /전체 채팅/ })

    await userEvent.click(group)

    await expect(group).toHaveAttribute('aria-selected', 'true')
    await expect(
      canvas.getByRole('tab', { name: /개인 채팅/ })
    ).toHaveAttribute('aria-selected', 'false')
  },
}

export const NoUnreadHidesBadge: Story = {
  args: { unreadCountBySegment: { personal: 0, group: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByLabelText(/읽지 않은 메시지/)).toBeNull()
  },
}

export const OverNinetyNine: Story = {
  args: { unreadCountBySegment: { personal: 128, group: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('99+')).toBeVisible()
  },
}
