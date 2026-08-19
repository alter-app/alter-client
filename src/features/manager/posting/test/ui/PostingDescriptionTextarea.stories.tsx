import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

import { PostingDescriptionTextarea } from '@/features/manager/posting/ui/PostingDescriptionTextarea'

function PostingDescriptionTextareaStory() {
  const [value, setValue] = useState('주말 근무 가능자를 우대합니다.')

  return (
    <PostingDescriptionTextarea
      value={value}
      hasError={false}
      onChange={setValue}
    />
  )
}

const meta = {
  title: 'features/manager/posting/PostingDescriptionTextarea',
  component: PostingDescriptionTextareaStory,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostingDescriptionTextareaStory>

export default meta
type Story = StoryObj<typeof meta>

export const AutoResize: Story = {
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox')
    const initialHeight = textarea.clientHeight

    await userEvent.type(
      textarea,
      '\n첫 번째 추가 조건\n두 번째 추가 조건\n세 번째 추가 조건\n네 번째 추가 조건\n다섯 번째 추가 조건\n여섯 번째 추가 조건'
    )

    await expect(textarea.clientHeight).toBeGreaterThan(initialHeight)
    await expect(textarea.scrollHeight).toBeLessThanOrEqual(
      textarea.clientHeight
    )
    await expect(window.getComputedStyle(textarea).overflowY).toBe('hidden')

    await userEvent.clear(textarea)
    await expect(textarea.clientHeight).toBe(initialHeight)
  },
}
