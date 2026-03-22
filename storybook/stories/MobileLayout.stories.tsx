import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { MobileLayout } from '../../src/shared/ui/MobileLayout'

const meta = {
  title: 'shared/ui/MobileLayout',
  component: MobileLayout,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-gray-100 min-h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <MobileLayout {...args}>
      <div className="p-6 bg-white min-h-[200px]">
        <p className="typography-body01-regular text-gray-800">
          모바일 레이아웃 안에 들어가는 콘텐츠
        </p>
      </div>
    </MobileLayout>
  ),
  args: {
    maxWidth: '428px',
  },
}
