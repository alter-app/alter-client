import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PostingWorkspaceEligibilityNotice } from '../../src/features/job-lookup-map/common/PostingWorkspaceEligibilityNotice'

const meta = {
  title: 'features/job-lookup-map/PostingWorkspaceEligibilityNotice',
  component: PostingWorkspaceEligibilityNotice,
  args: { onRetry: fn() },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PostingWorkspaceEligibilityNotice>

export default meta
type Story = StoryObj<typeof meta>

export const Checking: Story = {
  args: { status: 'checking' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('근무 중인 업장인지 확인하는 중…')
    ).toBeVisible()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

export const Employed: Story = {
  args: { status: 'employed' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('이미 근무 중인 업장입니다.')).toBeVisible()
  },
}

export const ErrorWithRetry: Story = {
  args: { status: 'error' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByText('근무 중인 업장인지 확인하지 못했습니다.')
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: '다시 시도' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
