import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '@/shared/stores/useAuthStore'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  createWorkspaceRequestComment,
  fetchWorkspaceRequestComments,
} from '@/features/store-register/api/workspaceRequests'
import { uploadWorkspaceRequestCommentFile } from '@/features/store-register/api/workspaceFileUpload'

export const COMMENT_MAX_LENGTH = 255

/** 첨부 파일 ≤ 5MB */
const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024

/** 신청 1건의 단일 댓글 스레드 + 작성 ViewModel */
export function useRequestCommentThreadViewModel(
  requestId: number,
  enabled: boolean
) {
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)
  const attachment = useCertificateFilePick({ maxBytes: ATTACHMENT_MAX_BYTES })

  const [comment, setComment] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const commentsKey = queryKeys.storeRegisterRequest.comments(scope, requestId)

  const query = useQuery({
    queryKey: commentsKey,
    queryFn: () => fetchWorkspaceRequestComments(scope, requestId),
    enabled: enabled && Number.isFinite(requestId),
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const trimmed = comment.trim()
      let fileIds: string[] | undefined
      if (attachment.file) {
        const fileId = await uploadWorkspaceRequestCommentFile(
          attachment.file,
          scope
        )
        fileIds = [fileId]
      }
      await createWorkspaceRequestComment(scope, requestId, {
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

  // 오래된 → 최신 정렬 (createdAt 오름차순, 대화 흐름)
  const comments = [...(query.data ?? [])].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  return {
    comments,
    messageCount: comments.length,
    isLoading: query.isPending && query.fetchStatus !== 'idle',
    isError: query.isError,
    refetch: query.refetch,
    comment,
    onCommentChange,
    attachment,
    submitError,
    isSubmitting: mutation.isPending,
    canSubmit,
    submit,
  }
}
