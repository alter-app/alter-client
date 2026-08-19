import { useNavigate, useParams } from 'react-router-dom'

import { useUpdatePostingMutation } from '@/features/manager/posting/hooks/mutation/useUpdatePostingMutation'
import { useManagerPostingDetailQuery } from '@/features/manager/posting/hooks/query/useManagerPostingDetailQuery'
import { usePostingForm } from '@/features/manager/posting/hooks/usePostingForm'
import { resolvePostingFormError } from '@/features/manager/posting/lib/postingErrorMessage'
import { PostingFormFields } from '@/features/manager/posting/ui/PostingFormFields'
import type {
  Posting,
  PostingFormValues,
} from '@/features/manager/posting/types/posting'
import { showToast } from '@/shared/stores/useToastStore'
import { AuthButton } from '@/shared/ui/common/AuthButton'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Skeleton } from '@/shared/ui/common/Skeleton'

export function ManagerPostingEditPage() {
  const navigate = useNavigate()
  const { postingId } = useParams()
  const numericPostingId = Number(postingId)

  const { posting, isLoading, isError } =
    useManagerPostingDetailQuery(numericPostingId)
  const updatePosting = useUpdatePostingMutation(numericPostingId)

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="공고 수정" />
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col gap-3 px-4 pt-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </main>
      </div>
    )
  }

  if (isError || !posting) {
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

  const handleSubmit = (
    values: PostingFormValues,
    onError: (error: unknown) => void
  ) => {
    const originalScheduleIds = posting.schedules
      .map(schedule => schedule.id)
      .filter((id): id is number => id !== null)

    updatePosting.mutate(
      { values, originalScheduleIds },
      {
        onSuccess: () => {
          showToast(
            values.schedules.length === 0
              ? '공고를 수정하고 모집을 마감했어요'
              : '공고를 수정했어요'
          )
          navigate(-1)
        },
        onError,
      }
    )
  }

  return (
    // key로 리마운트해야 폼 초기값(lazy useState)이 재계산된다
    <PostingEditContent
      key={numericPostingId}
      posting={posting}
      isSubmitting={updatePosting.isPending}
      onSubmit={handleSubmit}
    />
  )
}

interface PostingEditContentProps {
  posting: Posting
  isSubmitting: boolean
  onSubmit: (
    values: PostingFormValues,
    onError: (error: unknown) => void
  ) => void
}

function PostingEditContent({
  posting,
  isSubmitting,
  onSubmit,
}: PostingEditContentProps) {
  const form = usePostingForm({ posting })

  const handleSubmit = () => {
    if (!form.attemptSubmit()) return
    onSubmit(form.values, handleError)
  }

  const handleError = (error: unknown) => {
    const { fieldErrors, message } = resolvePostingFormError(
      error,
      '공고를 수정하지 못했어요.'
    )
    form.setServerErrors(fieldErrors)
    if (message) showToast(message, 'error')
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="공고 수정" />

      <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col px-4 pb-28 pt-4">
        <PostingFormFields form={form} />
      </main>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[428px] -translate-x-1/2 border-t border-line-1 bg-white px-4 pb-8 pt-3">
        <AuthButton
          onClick={handleSubmit}
          disabled={form.isSubmitDisabled || isSubmitting}
        >
          수정 완료
        </AuthButton>
      </div>
    </div>
  )
}
