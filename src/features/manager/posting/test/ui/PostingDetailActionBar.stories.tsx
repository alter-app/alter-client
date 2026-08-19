import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { PostingDetailActionBar } from '@/features/manager/posting/ui/PostingDetailActionBar'

const meta = {
  title: 'features/manager/posting/PostingDetailActionBar',
  component: PostingDetailActionBar,
  parameters: { layout: 'fullscreen' },
  args: {
    status: 'OPEN',
    isClosing: false,
    onEdit: () => {},
    onClosePosting: () => {},
  },
} satisfies Meta<typeof PostingDetailActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: '수정' })).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: '모집 마감' })
    ).toBeEnabled()
  },
}

export const Closed: Story = {
  args: { status: 'CLOSED' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: '수정' })
    ).not.toBeInTheDocument()
    await expect(canvas.getAllByRole('button')).toHaveLength(1)
    await expect(canvas.getByRole('button', { name: '마감됨' })).toBeDisabled()
  },
}

export const Cancelled: Story = {
  args: { status: 'CANCELLED' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: '수정' })
    ).toBeVisible()
  },
}
