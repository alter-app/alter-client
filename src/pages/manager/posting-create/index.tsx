import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePostingForm } from '@/features/manager/posting/hooks/usePostingForm'
import { MOCK_WORKSPACES } from '@/features/manager/posting/mocks/data'
import { useMockPostingStore } from '@/features/manager/posting/mocks/store'
import { PostingFormFields } from '@/features/manager/posting/ui/PostingFormFields'
import { ROUTES } from '@/shared/constants/routes'
import { showToast } from '@/shared/stores/useToastStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { ConfirmModal } from '@/shared/ui/common/ConfirmModal'
import { Navbar } from '@/shared/ui/common/Navbar'

/** SCREEN 1 · 공고 등록 */
export function ManagerPostingCreatePage() {
  const navigate = useNavigate()
  const form = usePostingForm()
  const createPosting = useMockPostingStore(state => state.createPosting)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleSubmit = () => {
    if (!form.attemptSubmit()) return
    setIsConfirmOpen(true)
  }

  const handleConfirm = () => {
    const workspaceName =
      MOCK_WORKSPACES.find(
        workspace => workspace.id === form.values.workspaceId
      )?.businessName ?? ''

    createPosting(form.values, workspaceName)
    setIsConfirmOpen(false)
    showToast('공고를 등록했어요')
    navigate(ROUTES.MANAGER.POSTINGS, { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="공고 작성" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        <PostingFormFields form={form} />
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        <AuthButton onClick={handleSubmit} disabled={form.isSubmitDisabled}>
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
