import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import { createWorkspaceRegistrationRequest } from '@/features/store-register/api/workspaceRequests'
import { uploadWorkspaceRegistrationFile } from '@/features/store-register/api/workspaceFileUpload'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'

type Step = 'info' | 'certificate' | 'done'

export function useStoreRegisterWizard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const certFile = useCertificateFilePick()
  const identityFile = useCertificateFilePick()
  const warrantFile = useCertificateFilePick()

  const [step, setStep] = useState<Step>('info')
  const [bizName, setBizName] = useState('')
  const [brn, setBrn] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [town, setTown] = useState('')
  const [address, setAddress] = useState('')
  const [type, setType] = useState('')
  const [contact, setContact] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const infoValid =
    bizName.trim().length > 0 &&
    brn.trim().length > 0 &&
    province.trim().length > 0 &&
    district.trim().length > 0 &&
    town.trim().length > 0 &&
    address.trim().length > 0 &&
    type.trim().length > 0 &&
    contact.trim().length > 0

  const certificateValid =
    !!certFile.file && !!identityFile.file && !!warrantFile.file

  const goInfo = () => setStep('info')
  const goCertificate = () => setStep('certificate')

  const submit = useCallback(async () => {
    if (
      !certFile.file ||
      !identityFile.file ||
      !warrantFile.file ||
      !infoValid
    ) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const [
        workspaceCertFileId,
        workspaceOwnIdentityFileId,
        workspaceWarrantFileId,
      ] = await Promise.all([
        uploadWorkspaceRegistrationFile(certFile.file),
        uploadWorkspaceRegistrationFile(identityFile.file),
        uploadWorkspaceRegistrationFile(warrantFile.file),
      ])

      await createWorkspaceRegistrationRequest({
        bizName,
        brn,
        province,
        district,
        town,
        address,
        type,
        contact,
        workspaceCertFileId,
        workspaceOwnIdentityFileId,
        workspaceWarrantFileId,
      })

      await queryClient.invalidateQueries({ queryKey: ['managerWorkspace'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })

      setStep('done')
    } catch (e) {
      setSubmitError(
        getAxiosErrorMessage(
          e,
          '등록 신청 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [
    address,
    brn,
    certFile.file,
    contact,
    district,
    identityFile.file,
    infoValid,
    province,
    town,
    type,
    warrantFile.file,
    bizName,
    queryClient,
  ])

  const exitToHome = () => navigate('/manager/home')

  return {
    step,
    bizName,
    brn,
    province,
    district,
    town,
    address,
    type,
    contact,
    setBizName,
    setBrn,
    setProvince,
    setDistrict,
    setTown,
    setAddress,
    setType,
    setContact,
    certFile,
    identityFile,
    warrantFile,
    infoValid,
    certificateValid,
    submitError,
    isSubmitting,
    goInfo,
    goCertificate,
    submit,
    exitToHome,
  }
}
