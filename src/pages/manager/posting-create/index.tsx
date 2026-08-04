import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCreatePostingMutation } from '@/features/manager/posting/hooks/mutation/useCreatePostingMutation'
import { usePostingForm } from '@/features/manager/posting/hooks/usePostingForm'
import { resolvePostingFormError } from '@/features/manager/posting/lib/postingErrorMessage'
import { PostingFormFields } from '@/features/manager/posting/ui/PostingFormFields'
import { ROUTES } from '@/shared/constants/routes'
import { showToast } from '@/shared/stores/useToastStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'

export function ManagerPostingCreatePage() {
  const navigate = useNavigate()
  const form = usePostingForm()
  const createPosting = useCreatePostingMutation()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleSubmit = () => {
    if (!form.attemptSubmit()) return
    setIsConfirmOpen(true)
  }

  const handleConfirm = () => {
    const { workspaceId } = form.values
    if (workspaceId === null) return

    setIsConfirmOpen(false)
    createPosting.mutate(
      { values: form.values, workspaceId },
      {
        onSuccess: () => {
          showToast('공고를 등록했어요')
          navigate(ROUTES.MANAGER.POSTINGS, { replace: true })
        },
        onError: error => {
          const { fieldErrors, message } = resolvePostingFormError(
            error,
            '공고를 등록하지 못했어요.'
          )
          form.setServerErrors(fieldErrors)
          if (message) showToast(message, 'error')
        },
      }
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="공고 작성" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        <PostingFormFields form={form} />
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        <AuthButton
          onClick={handleSubmit}
          disabled={form.isSubmitDisabled || createPosting.isPending}
        >
          등록하기
        </AuthButton>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="공고를 등록할까요?"
        description="등록 후에도 내 공고에서 수정하거나 마감할 수 있어요."
        confirmLabel="등록"
        cancelLabel="취소"
        onConfirm={handleConfirm}
        onClose={() => setIsConfirmOpen(false)}
      />
    </div>
  )
}
