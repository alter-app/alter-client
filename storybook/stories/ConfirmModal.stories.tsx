import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { ConfirmModal } from '../../src/shared/ui/common/ConfirmModal'

const meta = {
  title: 'shared/ui/common/ConfirmModal',
  component: ConfirmModal,
  parameters: { layout: 'centered' },
  args: {
    isOpen: true,
    title: '공고를 등록할까요?',
    description: '등록 요청을 처리하고 있어요.',
    confirmLabel: '등록',
    cancelLabel: '취소',
    onConfirm: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: { isPending: true },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    await expect(body.getByRole('button', { name: '처리 중…' })).toBeDisabled()
    await userEvent.click(body.getByRole('button', { name: '취소' }))
    await userEvent.click(body.getByRole('button', { name: '닫기' }))
    await userEvent.keyboard('{Escape}')

    await expect(args.onClose).not.toHaveBeenCalled()
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}
