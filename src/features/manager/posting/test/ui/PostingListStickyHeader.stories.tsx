import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { expect, within } from 'storybook/test'

import { PostingListStickyHeader } from '@/features/manager/posting/ui/PostingListStickyHeader'

const meta = {
  title: 'features/manager/posting/PostingListStickyHeader',
  component: PostingListStickyHeader,
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <MemoryRouter>
        <div className="min-h-[2000px] bg-bg-light">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: {
    rightAction: <button type="button">작성</button>,
    workspaceOptions: [
      { value: 'ALL', label: '전체 업장' },
      { value: 1, label: '알터 강남점' },
    ],
    workspaceValue: 'ALL',
    onWorkspaceChange: () => {},
    statusOptions: [
      { value: 'ALL', label: '전체 상태' },
      { value: 'OPEN', label: '모집중' },
      { value: 'CLOSED', label: '모집완료' },
    ],
    statusValue: 'ALL',
    onStatusChange: () => {},
    totalCount: 12,
  },
} satisfies Meta<typeof PostingListStickyHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('내 공고')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: '업장 필터' })
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: '상태 필터' })
    ).toBeVisible()

    const header = canvas.getByText('내 공고').closest('header')?.parentElement
    await expect(header).not.toBeNull()
    await expect(window.getComputedStyle(header!).position).toBe('sticky')
    await expect(window.getComputedStyle(header!).top).toBe('0px')

    window.scrollTo(0, 500)
    await new Promise<void>(resolve => {
      window.requestAnimationFrame(() => resolve())
    })
    await expect(Math.round(header!.getBoundingClientRect().top)).toBe(0)
    window.scrollTo(0, 0)
  },
}
