import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AuthInput } from '../../src/shared/ui/common/AuthInput'

const meta = {
  title: 'shared/ui/common/AuthInput',
  component: AuthInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: '이메일을 입력하세요',
    type: 'email',
  },
}

export const Password: Story = {
  args: {
    placeholder: '비밀번호',
    type: 'password',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: '비활성',
    disabled: true,
    value: '읽기 전용',
  },
}
