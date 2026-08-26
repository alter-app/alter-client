import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { MessageInput } from '@/features/chat/ui/MessageInput'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/features/chat/types/chat'

/** 실제 입력·전송 동작을 확인하기 위한 상태 보유 래퍼 */
function InteractiveMessageInput({
  initialValue = '',
}: {
  initialValue?: string
}) {
  const [value, setValue] = useState(initialValue)
  const [sent, setSent] = useState<string[]>([])

  return (
    <div className="w-[400px]">
      <ul data-testid="sent-list">
        {sent.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <MessageInput
        value={value}
        onChange={setValue}
        onSend={() => {
          setSent(previous => [...previous, value])
          setValue('')
        }}
      />
    </div>
  )
}

const meta = {
  title: 'features/chat/MessageInput',
  component: InteractiveMessageInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InteractiveMessageInput>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyDisablesSend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 빈 값에서는 전송 버튼이 비활성화됩니다
    await expect(canvas.getByRole('button', { name: '전송' })).toBeDisabled()
  },
}

export const WhitespaceDisablesSend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('메시지 입력'), '    ')
    await expect(canvas.getByRole('button', { name: '전송' })).toBeDisabled()
  },
}

export const TypeAndSend: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('메시지 입력')
    const sendButton = canvas.getByRole('button', { name: '전송' })

    await userEvent.type(input, '안녕하세요!')
    await expect(sendButton).toBeEnabled()

    await userEvent.click(sendButton)

    await expect(canvas.getByText('안녕하세요!')).toBeVisible()
    await expect(input).toHaveValue('')
    await expect(sendButton).toBeDisabled()
  },
}

export const AtCharacterLimit: Story = {
  args: { initialValue: 'ㄱ'.repeat(CHAT_MESSAGE_MAX_LENGTH) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText(
        `최대 ${CHAT_MESSAGE_MAX_LENGTH}자까지 입력할 수 있어요.`
      )
    ).toBeVisible()
    await expect(canvas.getByLabelText('메시지 입력')).toHaveValue(
      'ㄱ'.repeat(CHAT_MESSAGE_MAX_LENGTH)
    )
  },
}
