import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { ChatConnectionBanner } from '@/features/chat/ui/ChatConnectionBanner'
import type { ChatConnectionState } from '@/features/chat/types/chat'

/** 연결 상태 전이를 눌러서 확인하기 위한 래퍼 */
function ConnectionBannerHarness({
  initialState,
}: {
  initialState: ChatConnectionState
}) {
  const [state, setState] = useState<ChatConnectionState>(initialState)

  return (
    <div className="w-[428px]">
      <ChatConnectionBanner state={state} />
      <button type="button" onClick={() => setState('connected')}>
        연결 복구
      </button>
    </div>
  )
}

const meta = {
  title: 'features/chat/ChatConnectionBanner',
  component: ConnectionBannerHarness,
  parameters: { layout: 'centered' },
  args: { initialState: 'reconnecting' },
} satisfies Meta<typeof ConnectionBannerHarness>

export default meta
type Story = StoryObj<typeof meta>

export const Reconnecting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('연결이 끊겼어요 · 다시 연결 중…')
    ).toBeVisible()
  },
}

export const ReconnectedNotice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: '연결 복구' }))

    // 끊김 이후 연결됐을 때만 복구 안내를 띄웁니다
    await expect(canvas.getByText('다시 연결됐어요')).toBeVisible()
  },
}

export const ConnectedShowsNothing: Story = {
  args: { initialState: 'connected' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.queryByRole('status')).toBeNull()
  },
}
