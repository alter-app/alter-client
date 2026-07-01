import { useEffect, useRef, useState } from 'react'
import { uploadAppFile } from '@/shared/api/appFileUpload'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { useWorkspaceImagesQuery } from '@/features/manager/workspace-image/hooks/useWorkspaceImagesQuery'
import { useUpdateWorkspaceImagesMutation } from '@/features/manager/workspace-image/hooks/useUpdateWorkspaceImagesMutation'
import {
  MAX_WORKSPACE_IMAGE_COUNT,
  WORKSPACE_IMAGE_ACCEPT,
  WORKSPACE_IMAGE_ALLOWED_TYPES,
  WORKSPACE_IMAGE_MAX_BYTES,
} from '@/features/manager/workspace-image/constants/workspaceImage'

export interface EditableWorkspaceImage {
  fileId: string
  /** 서버 URL 또는 새로 추가한 파일의 미리보기 objectURL */
  url: string
  isNew: boolean
}

export function useWorkspaceImageEditViewModel(workspaceId: number) {
  const { images, isLoading, isError, refetch } =
    useWorkspaceImagesQuery(workspaceId)
  const updateMutation = useUpdateWorkspaceImagesMutation(workspaceId)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<EditableWorkspaceImage[]>([])
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // 서버 데이터를 최초 1회(조회 성공 시에만) 로컬 편집 상태로 복사.
  // 조회 실패 시 빈 목록으로 초기화하면, 전체 교체 저장으로 기존 이미지가
  // 삭제될 수 있으므로 isError 동안에는 초기화하지 않는다.
  useEffect(() => {
    if (initialized || isLoading || isError) return
    setItems(
      images.map(img => ({ fileId: img.fileId, url: img.url, isNew: false }))
    )
    setInitialized(true)
  }, [images, isLoading, isError, initialized])

  // 최초 조회가 실패해 편집할 데이터가 없는 상태(저장 차단 + 재시도 UI용)
  const isLoadError = isError && !initialized

  // 언마운트 시 새로 추가한 이미지의 objectURL 정리
  const itemsRef = useRef(items)
  itemsRef.current = items
  useEffect(() => {
    return () => {
      itemsRef.current.forEach(it => {
        if (it.isNew) URL.revokeObjectURL(it.url)
      })
    }
  }, [])

  const canAddMore = items.length < MAX_WORKSPACE_IMAGE_COUNT

  const openPicker = () => {
    setError('')
    fileInputRef.current?.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!canAddMore) {
      setError(
        `대표 이미지는 최대 ${MAX_WORKSPACE_IMAGE_COUNT}장까지 등록할 수 있어요.`
      )
      return
    }
    if (!WORKSPACE_IMAGE_ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG 형식의 이미지만 업로드할 수 있어요.')
      return
    }
    if (file.size > WORKSPACE_IMAGE_MAX_BYTES) {
      setError('이미지 용량은 20MB를 넘을 수 없어요.')
      return
    }

    try {
      setError('')
      setIsUploading(true)
      const fileId = await uploadAppFile({
        file,
        targetType: 'WORKSPACE_REPRESENTATIVE_IMAGE',
        bucketType: 'PUBLIC',
        scope: 'MANAGER',
      })
      setItems(prev => [
        ...prev,
        { fileId, url: URL.createObjectURL(file), isNew: true },
      ])
    } catch (err) {
      setError(getAxiosErrorMessage(err, '이미지 업로드에 실패했어요.'))
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (fileId: string) => {
    setItems(prev => {
      const target = prev.find(it => it.fileId === fileId)
      if (target?.isNew) URL.revokeObjectURL(target.url)
      return prev.filter(it => it.fileId !== fileId)
    })
  }

  const setAsMain = (fileId: string) => {
    setItems(prev => {
      const index = prev.findIndex(it => it.fileId === fileId)
      if (index <= 0) return prev
      const next = [...prev]
      const [picked] = next.splice(index, 1)
      next.unshift(picked)
      return next
    })
  }

  const save = async () => {
    setError('')
    try {
      await updateMutation.mutateAsync({
        images: items.map((it, index) => ({
          fileId: it.fileId,
          sortOrder: index,
        })),
      })
      return true
    } catch (err) {
      setError(
        getAxiosErrorMessage(err, '저장에 실패했어요. 다시 시도해 주세요.')
      )
      return false
    }
  }

  return {
    items,
    maxCount: MAX_WORKSPACE_IMAGE_COUNT,
    canAddMore,
    fileInputRef,
    accept: WORKSPACE_IMAGE_ACCEPT,
    error,
    isLoading,
    isLoadError,
    refetch,
    isUploading,
    isSaving: updateMutation.isPending,
    openPicker,
    onFileChange,
    removeImage,
    setAsMain,
    save,
  }
}
