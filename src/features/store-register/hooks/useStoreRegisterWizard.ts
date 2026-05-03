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
      let workspaceCertFileId: string
      let workspaceOwnIdentityFileId: string
      let workspaceWarrantFileId: string
      try {
        ;[
          workspaceCertFileId,
          workspaceOwnIdentityFileId,
          workspaceWarrantFileId,
        ] = await Promise.all([
          uploadWorkspaceRegistrationFile(certFile.file, 'CERTIFICATE'),
          uploadWorkspaceRegistrationFile(identityFile.file, 'OWN_IDENTITY'),
          uploadWorkspaceRegistrationFile(warrantFile.file, 'WARRANT'),
        ])
      } catch (e) {
        setSubmitError(
          getAxiosErrorMessage(
            e,
            '파일 업로드에 실패했습니다. 형식과 용량을 확인해 주세요.'
          )
        )
        return
      }

      try {
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
          latitude: 37.5665,
          longitude: 126.978,
        })
      } catch (e) {
        setSubmitError(
          getAxiosErrorMessage(
            e,
            '업장 등록 신청에 실패했습니다. 입력값·파일 연동을 서버 로그에서 확인해 주세요.'
          )
        )
        return
      }

      await queryClient.invalidateQueries({ queryKey: ['managerWorkspace'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace'] })

      setStep('done')
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
