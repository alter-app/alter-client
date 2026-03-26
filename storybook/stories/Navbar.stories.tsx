import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { Navbar } from '../../src/shared/ui/common/Navbar'

const meta = {
  title: 'shared/ui/common/Navbar',
  component: Navbar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Main: Story = {
  args: {
    variant: 'main',
  },
}

export const Detail: Story = {
  args: {
    variant: 'detail',
    title: '상세페이지',
  },
}
