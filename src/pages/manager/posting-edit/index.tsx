import { useNavigate, useParams } from 'react-router-dom'

import { usePostingForm } from '@/features/manager/posting/hooks/usePostingForm'
import { useMockPostingStore } from '@/features/manager/posting/mocks/store'
import { PostingFormFields } from '@/features/manager/posting/ui/PostingFormFields'
import type {
  Posting,
  PostingFormValues,
} from '@/features/manager/posting/types/posting'
import { showToast } from '@/shared/stores/useToastStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { Navbar } from '@/shared/ui/common/Navbar'

/** SCREEN 4 · 공고 수정 — 등록 폼 재사용 · 프리필 */
export function ManagerPostingEditPage() {
  const navigate = useNavigate()
  const { postingId } = useParams()
  const numericPostingId = Number(postingId)

  const posting = useMockPostingStore(state =>
    state.postings.find(item => item.id === numericPostingId)
  )
  const updatePosting = useMockPostingStore(state => state.updatePosting)

  if (!posting) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="공고 수정" />
        <main className="flex flex-1 items-center justify-center px-4">
          <p className="typography-body02-regular text-text-70">
            공고를 찾을 수 없어요.
          </p>
        </main>
      </div>
    )
  }

  return (
    <PostingEditContent
      postingId={numericPostingId}
      posting={posting}
      onSubmit={values => {
        updatePosting(numericPostingId, values)
        showToast('공고를 수정했어요')
        navigate(-1)
      }}
    />
  )
}

interface PostingEditContentProps {
  postingId: number
  posting: Posting
  onSubmit: (values: PostingFormValues) => void
}

/**
 * 폼 초기값이 `posting`에 의존하므로, 공고를 찾은 뒤에 마운트되도록 분리합니다
 * (훅 순서를 안정적으로 유지).
 */
function PostingEditContent({
  postingId,
  posting,
  onSubmit,
}: PostingEditContentProps) {
  const form = usePostingForm({ posting })

  const handleSubmit = () => {
    if (!form.attemptSubmit()) return
    onSubmit(form.values)
  }

  return (
    <div key={postingId} className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="공고 수정" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        <PostingFormFields form={form} />
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        <AuthButton onClick={handleSubmit} disabled={form.isSubmitDisabled}>
          수정 완료
        </AuthButton>
      </div>
    </div>
  )
}
