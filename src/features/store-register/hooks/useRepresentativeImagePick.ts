import { useCallback, useEffect, useRef, useState } from 'react'
import { uploadAppFile } from '@/shared/api/appFileUpload'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  MAX_WORKSPACE_IMAGE_COUNT,
  WORKSPACE_IMAGE_ACCEPT,
  WORKSPACE_IMAGE_ALLOWED_TYPES,
  WORKSPACE_IMAGE_MAX_BYTES,
} from '@/features/manager/workspace-image/constants/workspaceImage'

export interface PickedRepresentativeImage {
  fileId: string
  /** 미리보기용 objectURL */
  url: string
}

/**
 * 업장 등록 신청의 대표 이미지 선택 — 고른 즉시 업로드해 fileId 를 확보하고,
 * 신청 본문에는 배열 순서대로 sortOrder 를 매겨 보냅니다(첫 장이 메인).
 */
export function useRepresentativeImagePick(scope?: 'MANAGER' | 'USER' | null) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<PickedRepresentativeImage[]>([])
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // 언마운트 시 미리보기 objectURL 정리
  const imagesRef = useRef(images)
  imagesRef.current = images
  useEffect(() => {
    return () => {
      imagesRef.current.forEach(image => URL.revokeObjectURL(image.url))
    }
  }, [])

  const canAddMore = images.length < MAX_WORKSPACE_IMAGE_COUNT

  const openPicker = useCallback(() => {
    setError('')
    inputRef.current?.click()
  }, [])

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      if (images.length >= MAX_WORKSPACE_IMAGE_COUNT) {
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
          scope,
        })
        setImages(prev => [...prev, { fileId, url: URL.createObjectURL(file) }])
      } catch (e) {
        setError(getAxiosErrorMessage(e, '이미지 업로드에 실패했어요.'))
      } finally {
        setIsUploading(false)
      }
    },
    [images.length, scope]
  )

  const removeImage = useCallback((fileId: string) => {
    setImages(prev => {
      const target = prev.find(image => image.fileId === fileId)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter(image => image.fileId !== fileId)
    })
  }, [])

  const setAsMain = useCallback((fileId: string) => {
    setImages(prev => {
      const index = prev.findIndex(image => image.fileId === fileId)
      if (index <= 0) return prev
      const next = [...prev]
      const [picked] = next.splice(index, 1)
      next.unshift(picked)
      return next
    })
  }, [])

  return {
    images,
    inputRef,
    accept: WORKSPACE_IMAGE_ACCEPT,
    maxCount: MAX_WORKSPACE_IMAGE_COUNT,
    canAddMore,
    error,
    isUploading,
    openPicker,
    onFileChange,
    removeImage,
    setAsMain,
  }
}
