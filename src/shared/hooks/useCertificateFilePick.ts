import type { ChangeEventHandler } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  validateCertificateFile,
  isPdfCertificateFile,
} from '@/shared/lib/certificateFileValidation'

type UseCertificateFilePickOptions = {
  maxBytes?: number
}

/** 단일 증빙 파일 선택, 미리보기(URL), 검증 에러 및 정리(revoke) */
export function useCertificateFilePick(
  options?: UseCertificateFilePickOptions
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFileState] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const revokePreview = useCallback(() => {
    setPreviewUrl(url => {
      if (url) URL.revokeObjectURL(url)
      return null
    })
  }, [])

  useEffect(() => () => revokePreview(), [revokePreview])

  const setFileFromInput = useCallback(
    (next: File | null) => {
      setError(null)
      revokePreview()

      if (!next) {
        setFileState(null)
        return
      }

      const validationMessage = validateCertificateFile(next, {
        maxBytes: options?.maxBytes,
      })
      if (validationMessage) {
        setError(validationMessage)
        setFileState(null)
        return
      }

      setFileState(next)

      if (!isPdfCertificateFile(next)) {
        setPreviewUrl(URL.createObjectURL(next))
      }
    },
    [options?.maxBytes, revokePreview]
  )

  const onInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    const picked = e.target.files?.[0]
    setFileFromInput(picked ?? null)
    e.target.value = ''
  }

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const clear = useCallback(() => {
    revokePreview()
    setFileState(null)
    setError(null)
  }, [revokePreview])

  return {
    file,
    previewUrl,
    error,
    isPdf: file ? isPdfCertificateFile(file) : false,
    inputRef,
    onInputChange,
    openPicker,
    clear,
  }
}
