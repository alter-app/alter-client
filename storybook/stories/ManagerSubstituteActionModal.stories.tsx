import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'

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

type SubmitBehavior =
  | 'success'
  | 'error-B001'
  | 'error-A002'
  | 'error-B020'
  | 'error-409-B020'

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  'error-B001': '이미 처리되었거나 승인/거절할 수 없는 상태입니다.',
  'error-A002': '관리 중인 업장이 아닙니다.',
  'error-B020': '존재하지 않는 대타 요청입니다.',
  'error-409-B020': '삭제된 근무 일정에는 근무자를 배정할 수 없습니다.',
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

/** 오류 문구가 글자 수 줄 아래에서 입력창 너비만큼 펼쳐지는지 확인한다(긴 서버 문구가 글자 수 옆에서 접히지 않도록). */
async function submitAndExpectErrorBelowCounter(
  canvasElement: HTMLElement,
  submitLabel: string,
  errorMessage: string
) {
  const canvas = within(canvasElement)
  await userEvent.click(canvas.getByRole('button', { name: submitLabel }))

  const error = await canvas.findByText(errorMessage)
  const counterRect = canvas.getByText('0/500').getBoundingClientRect()
  const textareaRect = canvas.getByRole('textbox').getBoundingClientRect()
  const errorRect = error.getBoundingClientRect()

  await expect(errorRect.top).toBeGreaterThanOrEqual(counterRect.bottom)
  await expect(errorRect.width).toBeCloseTo(textareaRect.width, 0)
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

export const ErrorApproveConflict: Story = {
  name: 'Error / 승인 불가 서버 문구 (409 B020)',
  render: () => <ModalDemo type="approve" submitBehavior="error-409-B020" />,
  play: async ({ canvasElement }) => {
    await submitAndExpectErrorBelowCounter(
      canvasElement,
      '승인하기',
      SUBMIT_ERROR_MESSAGES['error-409-B020']
    )
  },
}

export const ErrorRejectEmptyReason: Story = {
  name: 'Error / 거절 사유 미입력',
  render: () => <ModalDemo type="reject" />,
  play: async ({ canvasElement }) => {
    await submitAndExpectErrorBelowCounter(
      canvasElement,
      '거절하기',
      '내용을 입력해 주세요.'
    )
  },
}
