import { useRef, useState } from 'react'
import { uploadAppFile } from '@/shared/api/appFileUpload'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import {
  useDeleteProfileImageMutation,
  useUpdateProfileImageMutation,
} from './useUserMeMutations'

export function useProfileImageEditor(avatarUrl?: string) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [imageError, setImageError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const updateProfileImageMutation = useUpdateProfileImageMutation()
  const deleteProfileImageMutation = useDeleteProfileImageMutation()

  const isImagePending =
    updateProfileImageMutation.isPending || deleteProfileImageMutation.isPending

  const triggerFileInput = () => {
    setImageError('')
    fileInputRef.current?.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const fileId = await uploadAppFile({
        file,
        targetType: 'USER_PROFILE',
        bucketType: 'PUBLIC',
      })
      await updateProfileImageMutation.mutateAsync(fileId)
    } catch (error) {
      setImageError(
        getAxiosErrorMessage(error, '프로필 이미지 변경에 실패했습니다.')
      )
    }
  }

  const openDeleteModal = () => {
    if (!avatarUrl) return
    setImageError('')
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
  }

  const confirmDelete = async () => {
    if (!avatarUrl) return
    setImageError('')
    try {
      await deleteProfileImageMutation.mutateAsync()
      setDeleteModalOpen(false)
    } catch (error) {
      setImageError(
        getAxiosErrorMessage(error, '프로필 이미지 삭제에 실패했습니다.')
      )
    }
  }

  return {
    fileInputRef,
    imageError,
    isImagePending,
    deleteModalOpen,
    isDeletePending: deleteProfileImageMutation.isPending,
    triggerFileInput,
    onFileChange,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  }
}
