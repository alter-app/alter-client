import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  createWorkspaceReasonComment,
  fetchWorkspaceReasonComments,
} from '@/features/store-register/api/workspaceRequests'
import { uploadWorkspaceReasonCommentFile } from '@/features/store-register/api/workspaceFileUpload'

export const COMMENT_MAX_LENGTH = 255

/** 첨부 파일 ≤ 5MB */
const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024

/** 반려 사유 한 건의 댓글 스레드 + 작성 ViewModel */
export function useReasonCommentThreadViewModel(
  requestId: number,
  reasonId: number,
  enabled: boolean
) {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)
  const attachment = useCertificateFilePick({ maxBytes: ATTACHMENT_MAX_BYTES })

  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const commentsKey = queryKeys.storeRegisterRequest.comments(
    scope,
    requestId,
    reasonId
  )

  const query = useQuery({
    queryKey: commentsKey,
    queryFn: () => fetchWorkspaceReasonComments(scope, requestId, reasonId),
    enabled: enabled && Number.isFinite(requestId) && Number.isFinite(reasonId),
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const trimmed = comment.trim()
      let fileIds: string[] | undefined
      if (attachment.file) {
        const fileId = await uploadWorkspaceReasonCommentFile(
          attachment.file,
          scope
        )
        fileIds = [fileId]
      }
      await createWorkspaceReasonComment(scope, requestId, reasonId, {
        comment: trimmed,
        fileIds,
      })
    },
    onSuccess: async () => {
      setComment('')
      attachment.clear()
      await queryClient.invalidateQueries({ queryKey: commentsKey })
    },
    onError: (e: unknown) => {
      setSubmitError(
        getAxiosErrorMessage(
          e,
          '댓글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.'
        )
      )
    },
  })

  const onCommentChange = useCallback((value: string) => {
    setSubmitError(null)
    setComment(value.slice(0, COMMENT_MAX_LENGTH))
  }, [])

  const canSubmit =
    comment.trim().length > 0 && !mutation.isPending && !attachment.error

  const submit = useCallback(() => {
    if (!canSubmit) return
    setSubmitError(null)
    mutation.mutate()
  }, [canSubmit, mutation])

  return {
    comments: query.data ?? [],
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    comment,
    onCommentChange,
    attachment,
    submitError,
    isSubmitting: mutation.isPending,
    canSubmit,
    submit,
  }
}
