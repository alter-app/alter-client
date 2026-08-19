import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ChatRoomRow } from '@/features/chat/ui/ChatRoomListItem'
import type { ChatRoomListItem } from '@/features/chat/types/chat'

function room(overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem {
  return {
    id: 1,
    segment: 'personal',
    title: '이서준',
    profileImageUrl: null,
    latestMessage: '혹시 저 대타 부탁드려도 될까요??',
    updatedAt: new Date().toISOString(),
    unreadCount: 0,
    opponentId: 200,
    opponentScope: 'USER',
    ...overrides,
  }
}

const meta = {
  title: 'features/chat/ChatRoomRow',
  component: ChatRoomRow,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[428px] bg-white">
        <Story />
      </div>
    ),
  ],
  args: { room: room() },
} satisfies Meta<typeof ChatRoomRow>

export default meta
type Story = StoryObj<typeof meta>

export const Read: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('이서준')).toBeVisible()
    await expect(canvas.queryByLabelText(/읽지 않은 메시지/)).toBeNull()

    // 읽은 방의 미리보기는 regular 400
    const preview = canvas.getByText('혹시 저 대타 부탁드려도 될까요??')
    await expect(window.getComputedStyle(preview).fontWeight).toBe('400')
  },
}

export const Unread: Story = {
  args: { room: room({ unreadCount: 12 }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('12')).toBeVisible()

    // 안읽음이 있으면 미리보기를 굵게 표기합니다
    const preview = canvas.getByText('혹시 저 대타 부탁드려도 될까요??')
    await expect(window.getComputedStyle(preview).fontWeight).toBe('600')
  },
}

export const GroupRoom: Story = {
  args: {
    room: room({
      segment: 'group',
      title: '알터 강남점',
      memberCount: 7,
      latestMessage: '근무표 확정해서 공유드려요',
      unreadCount: 1,
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('알터 강남점')).toBeVisible()
    await expect(canvas.getByText('7')).toBeVisible()
  },
}

export const EmptyConversation: Story = {
  args: { room: room({ latestMessage: '' }) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('대화를 시작해보세요')).toBeVisible()
  },
}
