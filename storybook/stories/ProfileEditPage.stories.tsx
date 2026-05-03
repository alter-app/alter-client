import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ProfileEditPage } from '../../src/pages/my/profile'
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
  title: 'pages/my/ProfileEditPage',
  component: ProfileEditPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileEditPage>

export default meta
type Story = StoryObj<typeof meta>

const decorate = (seed?: UserMeDto): NonNullable<Story['decorators']> => [
  Story => {
    useAuthStore.setState({
      token: 'mock-token',
      refreshToken: 'mock-refresh',
      isLoggedIn: true,
      scope: 'USER',
      user: { name: seed?.name, email: 'sample@alter-app.com' },
    })
    return (
      <div style={{ maxWidth: 390, margin: '0 auto' }}>
        <QueryClientProvider client={makeQueryClient(seed)}>
          <MemoryRouter initialEntries={['/my/profile']}>
            <Story />
          </MemoryRouter>
        </QueryClientProvider>
      </div>
    )
  },
]

export const Default: Story = {
  decorators: decorate({
    id: 1,
    name: '김철수',
    nickname: '알터',
    createdAt: '2023-10-01T12:00:00',
  }),
}

export const NoUserData: Story = {
  decorators: decorate(),
}
