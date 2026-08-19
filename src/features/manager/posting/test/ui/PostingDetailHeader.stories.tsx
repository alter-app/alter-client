import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { PostingDetailHeader } from '@/features/manager/posting/ui/PostingDetailHeader'

const meta = {
  title: 'features/manager/posting/PostingDetailHeader',
  component: PostingDetailHeader,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-[360px] bg-bg-light px-4">
        <Story />
      </div>
    ),
  ],
  args: {
    title: '주말 홀서빙 · 오후 마감조 구합니다',
    workspaceName: '알터 강남점',
    businessType: '카페',
    status: 'OPEN',
  },
} satisfies Meta<typeof PostingDetailHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const title = canvas.getByRole('heading', {
      name: '주말 홀서빙 · 오후 마감조 구합니다',
    })
    const badge = canvas.getByText('모집중')
    await expect(title).toBeVisible()
    await expect(badge).toBeVisible()

    const titleStyle = window.getComputedStyle(title)
    await expect(titleStyle.fontSize).toBe('20px')

    const badgeStyle = window.getComputedStyle(badge)
    await expect(badgeStyle.fontSize).toBe('13px')
    await expect(badgeStyle.paddingLeft).toBe('10px')
    await expect(badgeStyle.paddingRight).toBe('10px')
    await expect(badgeStyle.paddingTop).toBe('6px')
    await expect(badgeStyle.paddingBottom).toBe('6px')

    const section = canvasElement.querySelector('section')
    await expect(section).not.toBeNull()

    const style = window.getComputedStyle(section!)
    await expect(style.paddingLeft).toBe('0px')
    await expect(style.paddingRight).toBe('0px')
    await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await expect(style.boxShadow).toBe('none')
  },
}
