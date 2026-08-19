import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ChatBubble } from '@/features/chat/ui/ChatBubble'
import type { ChatMessage } from '@/features/chat/types/chat'

function message(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 1,
    senderId: 200,
    senderScope: 'MANAGER',
    senderName: '최민석 점주님',
    senderProfileImageUrl: null,
    content: '근무표 확정해서 공유드려요',
    createdAt: '2026-08-19T09:10:00',
    isMine: false,
    status: 'sent',
    messageType: 'NORMAL',
    attachments: [],
    ...overrides,
  }
}

/** 본문 텍스트는 span 이고 배경·색상은 감싸는 말풍선에 있습니다 */
function bubbleOf(textNode: HTMLElement): HTMLElement {
  return textNode.parentElement as HTMLElement
}

const meta = {
  title: 'features/chat/ChatBubble',
  component: ChatBubble,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[360px] bg-bg-light p-4">
        <Story />
      </div>
    ),
  ],
  args: { message: message() },
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Received: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('근무표 확정해서 공유드려요')

    await expect(text).toBeVisible()
    await expect(canvas.getByText('오전 9:10')).toBeVisible()

    // 받은 말풍선은 흰색
    const style = window.getComputedStyle(bubbleOf(text))
    await expect(style.backgroundColor).toBe('rgb(255, 255, 255)')
  },
}

export const Sent: Story = {
  args: {
    message: message({
      isMine: true,
      content: '확인했습니다!',
      senderName: '',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const text = canvas.getByText('확인했습니다!')

    // 보낸 말풍선은 브랜드 그린(main #07c079) + 흰 글자
    const style = window.getComputedStyle(bubbleOf(text))
    await expect(style.backgroundColor).toBe('rgb(7, 192, 121)')
    await expect(style.color).toBe('rgb(255, 255, 255)')
  },
}

export const GroupWithSenderMeta: Story = {
  args: { message: message(), showSenderMeta: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 전체 채팅에서는 발신자 이름과 아바타를 함께 노출합니다
    await expect(canvas.getByText('최민석 점주님')).toBeVisible()
    await expect(
      canvasElement.querySelector('img[alt="최민석 점주님"]')
    ).not.toBeNull()
  },
}

export const Pending: Story = {
  args: {
    message: message({
      isMine: true,
      content: '전송 중인 메시지',
      status: 'pending',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('전송 중')).toBeVisible()
  },
}

export const Failed: Story = {
  args: {
    message: message({
      isMine: true,
      content: '실패한 메시지',
      status: 'failed',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('전송 실패')).toBeVisible()
  },
}

/** 공지는 매니저만 발행할 수 있고, 목록에서 눈에 띄게 구분됩니다 */
export const Notice: Story = {
  args: {
    message: message({
      messageType: 'NOTICE',
      content: '이번 주 재고 조사는 금요일 마감 후 진행합니다.',
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('공지')).toBeVisible()
    await expect(
      canvas.getByText('이번 주 재고 조사는 금요일 마감 후 진행합니다.')
    ).toBeVisible()
  },
}

const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/6X8AAAAAAAASUVORK5CYII='

/** content 가 null 인 이미지 전용 메시지 — 빈 말풍선으로 보이지 않아야 합니다 */
export const ImageOnly: Story = {
  args: {
    message: message({
      content: '',
      attachments: [{ fileId: 'f1', url: TRANSPARENT_PNG }],
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByAltText('첨부 이미지')).toBeVisible()
  },
}
