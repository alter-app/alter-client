import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { ProfileEditPage } from '../../src/pages/my/profile'
import useAuthStore from '../../src/shared/stores/useAuthStore'

const meta = {
  title: 'pages/my/ProfileEditPage',
  component: ProfileEditPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 390, margin: '0 auto' }}>
        <MemoryRouter initialEntries={['/my/profile']}>
          <Story />
        </MemoryRouter>
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileEditPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    Story => {
      useAuthStore.setState({
        token: 'mock-token',
        refreshToken: 'mock-refresh',
        isLoggedIn: true,
        scope: 'USER',
        user: { name: '알터', email: '123456789@gmail.com' },
      })
      return <Story />
    },
  ],
}

export const NoUserData: Story = {
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
