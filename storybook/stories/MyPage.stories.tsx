import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { MyPage } from '../../src/pages/my'
import useAuthStore from '../../src/shared/stores/useAuthStore'

const meta = {
  title: 'pages/my/MyPage',
  component: MyPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 390, margin: '0 auto' }}>
        <MemoryRouter initialEntries={['/my']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
} satisfies Meta<typeof MyPage>

export default meta
type Story = StoryObj<typeof meta>

export const Manager: Story = {
  decorators: [
    Story => {
      useAuthStore.setState({
        token: 'mock-token',
        refreshToken: 'mock-refresh',
        isLoggedIn: true,
        scope: 'MANAGER',
        user: { name: '유승완', email: 'manager@alter-app.com' },
      })
      return <Story />
    },
  ],
}

export const Worker: Story = {
  decorators: [
    Story => {
      useAuthStore.setState({
        token: 'mock-token',
        refreshToken: 'mock-refresh',
        isLoggedIn: true,
        scope: 'USER',
        user: { name: '홍길동', email: 'worker@alter-app.com' },
      })
      return <Story />
    },
  ],
}

export const Empty: Story = {
  decorators: [
    Story => {
      useAuthStore.setState({
        token: null,
        refreshToken: null,
        isLoggedIn: false,
        scope: null,
        user: null,
      })
      return <Story />
    },
  ],
}
