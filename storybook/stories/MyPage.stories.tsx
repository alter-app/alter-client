import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MyPage } from '../../src/pages/my'
import useAuthStore from '../../src/shared/stores/useAuthStore'
import { queryKeys } from '../../src/shared/lib/queryKeys'
import type { UserMeDto } from '../../src/features/user/me'

function makeQueryClient(seed?: UserMeDto) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  })
  if (seed) {
    client.setQueryData(queryKeys.user.me(), seed)
  }
  return client
}

const meta = {
  title: 'pages/my/MyPage',
  component: MyPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyPage>

export default meta
type Story = StoryObj<typeof meta>

const decorate = (
  scope: 'MANAGER' | 'USER' | null,
  seed?: UserMeDto
): NonNullable<Story['decorators']> => [
  Story => {
    useAuthStore.setState({
      token: scope ? 'mock-token' : null,
      refreshToken: scope ? 'mock-refresh' : null,
      isLoggedIn: scope !== null,
      scope,
      user: scope ? { name: seed?.name, email: 'sample@alter-app.com' } : null,
    })
    return (
      <div style={{ maxWidth: 390, margin: '0 auto' }}>
        <QueryClientProvider client={makeQueryClient(seed)}>
          <MemoryRouter initialEntries={['/my']}>
            <Story />
          </MemoryRouter>
        </QueryClientProvider>
      </div>
    )
  },
]

export const Manager: Story = {
  decorators: decorate('MANAGER', {
    id: 1,
    name: '유승완',
    nickname: '알터',
    createdAt: '2024-03-12T09:30:00',
  }),
}

export const Worker: Story = {
  decorators: decorate('USER', {
    id: 2,
    name: '김철수',
    nickname: '김땡땡',
    createdAt: '2023-10-01T12:00:00',
  }),
}

export const Loading: Story = {
  decorators: decorate('USER'),
}

export const NotLoggedIn: Story = {
  decorators: decorate(null),
}
