import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

import {
  ManagerSubstituteActionModal,
  type SubstituteActionType,
} from '../../src/pages/manager/substitute-request/components/ManagerSubstituteActionModal'

const meta = {
  title: 'pages/manager/substitute-request/ManagerSubstituteActionModal',
  component: ManagerSubstituteActionModal,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    open: true,
    type: 'approve' as SubstituteActionType,
    onClose: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof ManagerSubstituteActionModal>

export default meta
type Story = StoryObj<typeof meta>

function ModalDemo({
  type,
  pending,
}: {
  type: SubstituteActionType
  pending?: boolean
}) {
  const [open, setOpen] = useState(true)
  const [submitted, setSubmitted] = useState<string | null>(null)

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      {submitted && (
        <p className="mb-4 rounded bg-white px-4 py-2 text-sm shadow">
          제출됨: {submitted}
        </p>
      )}
      <button
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        모달 열기
      </button>
      <ManagerSubstituteActionModal
        open={open}
        type={type}
        pending={pending}
        onClose={() => setOpen(false)}
        onSubmit={comment => {
          setSubmitted(comment)
          setOpen(false)
        }}
      />
    </div>
  )
}

export const Approve: Story = {
  render: () => <ModalDemo type="approve" />,
}

export const Reject: Story = {
  render: () => <ModalDemo type="reject" />,
}

export const Pending: Story = {
  render: () => <ModalDemo type="approve" pending />,
}
