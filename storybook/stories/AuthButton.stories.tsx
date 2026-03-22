import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AuthButton } from '../../src/shared/ui/common/AuthButton'

const meta = {
  title: 'shared/ui/AuthButton',
  component: AuthButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '로그인',
  },
}

export const Disabled: Story = {
  args: {
    children: '비활성',
    disabled: true,
  },
}
