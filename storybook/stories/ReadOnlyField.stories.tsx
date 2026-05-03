import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { ReadOnlyField } from '../../src/pages/my/profile/components/ReadOnlyField'

const meta = {
  title: 'pages/my/profile/components/ReadOnlyField',
  component: ReadOnlyField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ width: 344 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReadOnlyField>

export default meta
type Story = StoryObj<typeof meta>

export const Email: Story = {
  args: {
    label: '이메일',
    value: '123456789@gmail.com',
  },
}

export const Phone: Story = {
  args: {
    label: '핸드폰 번호',
    value: '010-1234-5678',
  },
}
