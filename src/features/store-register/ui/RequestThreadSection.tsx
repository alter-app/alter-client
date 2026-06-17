import { useRequestCommentThreadViewModel } from '@/features/store-register/hooks/useRequestCommentThreadViewModel'
import { RequestCommentItem } from '@/features/store-register/ui/RequestCommentItem'
import { RequestCommentComposer } from '@/features/store-register/ui/RequestCommentComposer'

type ThreadVariant = 'PENDING' | 'REVOKED' | 'ACTIVATED'

type Props = {
  requestId: number
  variant: ThreadVariant
}

type VariantCopy = {
  emptyTitle: string
  emptyDescription: string
  placeholder: string
}

/** 입력바/빈 상태 안내는 상호작용 variant(PENDING·REVOKED)에서만 사용 */
const VARIANT_COPY: Record<'PENDING' | 'REVOKED', VariantCopy> = {
  PENDING: {
    emptyTitle: '아직 주고받은 메시지가 없어요',
    emptyDescription:
      '검토 관련 문의나 보완 자료를 미리 남기면 관리자가 답변해 드려요.',
    placeholder: '관리자에게 메시지를 남겨 보세요',
  },
  REVOKED: {
    emptyTitle: '아직 관리자가 남긴 코멘트가 없어요',
    emptyDescription:
      '반려 사유가 등록되면 여기에서 바로 확인하고 답글을 남길 수 있어요. 먼저 궁금한 점을 남겨도 좋아요.',
    placeholder: '추가 자료나 설명을 남겨 재심사를 요청하세요',
  },
}

/** 신청 1건의 단일 댓글 스레드 섹션 — 헤더 + 안내 + 말풍선 목록 + 입력바 */
export function RequestThreadSection({ requestId, variant }: Props) {
  const thread = useRequestCommentThreadViewModel(requestId, true)
  const readOnly = variant === 'ACTIVATED'

  // 승인 완료(읽기 전용): 주고받은 메시지가 없으면 섹션 자체를 숨김.
  // comments 는 로딩 중·에러 시에도 []라 messageCount === 0 이므로
  // "메시지 없음 / 불러오는 중 / 불러오기 실패" 세 경우 모두 여기서 감춰진다.
  if (readOnly && thread.messageCount === 0) return null

  const copy = readOnly ? null : VARIANT_COPY[variant]
  const isEmpty =
    !thread.isLoading && !thread.isError && thread.messageCount === 0
  const composerDisabled = thread.isLoading || thread.isError

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <h2 className="typography-headline03 text-text-100">스레드</h2>
        <span className="inline-flex h-[22px] items-center rounded-full bg-bg-dark px-2 typography-body03-semibold text-text-70">
          메시지 {thread.messageCount}개
        </span>
      </div>

      {variant === 'REVOKED' ? (
        <p className="rounded-xl bg-main-100 px-4 py-3.5 typography-body02-regular text-text-100">
          댓글로 자료를 보강해{' '}
          <span className="typography-body02-semibold text-main">재심사</span>를
          요청할 수 있어요. 관리자 첫 댓글이 곧 반려 사유예요.
        </p>
      ) : null}

      {thread.isLoading ? (
        <p className="typography-body02-regular text-text-50">불러오는 중…</p>
      ) : null}

      {thread.isError ? (
        <div className="flex flex-col items-start gap-2.5 rounded-xl bg-bg-dark px-4 py-3.5">
          <div className="flex flex-col gap-1">
            <p className="typography-body02-semibold text-text-100">
              문의 내용을 불러오지 못했어요
            </p>
            <p className="typography-body03-regular text-text-70">
              네트워크 연결을 확인한 뒤 다시 시도해 주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => thread.refetch()}
            className="h-9 rounded-lg border border-line-2 bg-white px-3.5 typography-body03-semibold text-text-90"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {copy && isEmpty ? (
        <div className="flex flex-col gap-1 rounded-xl bg-bg-dark px-4 py-5 text-center">
          <p className="typography-body02-semibold text-text-100">
            {copy.emptyTitle}
          </p>
          <p className="typography-body03-regular text-text-70">
            {copy.emptyDescription}
          </p>
        </div>
      ) : null}

      {thread.messageCount > 0 ? (
        <div className="flex flex-col gap-3.5">
          {thread.comments.map(comment => (
            <RequestCommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : null}

      {copy ? (
        <RequestCommentComposer
          comment={thread.comment}
          onCommentChange={thread.onCommentChange}
          attachment={thread.attachment}
          submitError={thread.submitError}
          isSubmitting={thread.isSubmitting}
          canSubmit={thread.canSubmit}
          onSubmit={thread.submit}
          placeholder={
            composerDisabled ? '불러온 뒤 입력할 수 있어요' : copy.placeholder
          }
          disabled={composerDisabled}
        />
      ) : null}
    </section>
  )
}
