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

type SubmitBehavior = 'success' | 'error-B001' | 'error-A002' | 'error-B020'

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  'error-B001': '이미 처리되었거나 승인/거절할 수 없는 상태입니다.',
  'error-A002': '관리 중인 업장이 아닙니다.',
  'error-B020': '존재하지 않는 대타 요청입니다.',
}

function ModalDemo({
  type,
  pending,
  submitBehavior = 'success',
}: {
  type: SubstituteActionType
  pending?: boolean
  submitBehavior?: SubmitBehavior
}) {
  const [open, setOpen] = useState(true)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = (comment: string) => {
    if (submitBehavior === 'success') {
      setSubmitted(comment)
      setSubmitError(null)
      setOpen(false)
    } else {
      setSubmitError(SUBMIT_ERROR_MESSAGES[submitBehavior])
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      {submitted && (
        <p className="mb-4 rounded bg-white px-4 py-2 text-sm shadow">
          제출됨: {submitted}
        </p>
      )}
      <button
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => {
          setSubmitError(null)
          setOpen(true)
        }}
      >
        모달 열기
      </button>
      <ManagerSubstituteActionModal
        open={open}
        type={type}
        pending={pending}
        submitError={submitError}
        onClose={() => {
          setSubmitError(null)
          setOpen(false)
        }}
        onSubmit={handleSubmit}
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

export const ErrorInvalidStatus: Story = {
  name: 'Error / 승인·거절 불가 상태 (B001)',
  render: () => <ModalDemo type="approve" submitBehavior="error-B001" />,
}

export const ErrorNotManagedWorkspace: Story = {
  name: 'Error / 관리 중인 업장 아님 (A002)',
  render: () => <ModalDemo type="approve" submitBehavior="error-A002" />,
}

export const ErrorRequestNotFound: Story = {
  name: 'Error / 존재하지 않는 요청 (B020)',
  render: () => <ModalDemo type="reject" submitBehavior="error-B020" />,
}
