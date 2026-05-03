import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import { submitStoreRegistrationRequest } from '@/features/store-register/api/submitStoreRegistration'

type Step = 'info' | 'certificate' | 'done'

export function useStoreRegisterWizard() {
  const navigate = useNavigate()
  const certificate = useCertificateFilePick()

  const [step, setStep] = useState<Step>('info')
  const [storeName, setStoreName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)

  const infoValid =
    storeName.trim().length > 0 &&
    businessType.trim().length > 0 &&
    addressLine.trim().length > 0

  const certificateValid = !!certificate.file

  const goInfo = () => setStep('info')
  const goCertificate = () => setStep('certificate')

  const submit = useCallback(async () => {
    if (!certificate.file || !infoValid) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const { requestId: id } = await submitStoreRegistrationRequest({
        storeName,
        businessType,
        addressLine,
        certificateFile: certificate.file,
      })
      setRequestId(id)
      setStep('done')
    } catch {
      setSubmitError('등록 신청 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }, [addressLine, businessType, certificate.file, infoValid, storeName])

  const exitToHome = () => navigate('/manager/home')

  return {
    step,
    storeName,
    businessType,
    addressLine,
    setStoreName,
    setBusinessType,
    setAddressLine,
    certificate,
    infoValid,
    certificateValid,
    submitError,
    isSubmitting,
    requestId,
    goInfo,
    goCertificate,
    submit,
    exitToHome,
  }
}
