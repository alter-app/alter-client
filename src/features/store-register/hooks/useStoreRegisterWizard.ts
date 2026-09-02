import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCertificateFilePick } from '@/shared/hooks/useCertificateFilePick'
import useAuthStore from '@/shared/stores/useAuthStore'
import { createWorkspaceRegistrationRequest } from '@/features/store-register/api/workspaceRequests'
import { uploadWorkspaceRegistrationFile } from '@/features/store-register/api/workspaceFileUpload'
import { useBusinessTypes } from '@/features/store-register/hooks/useBusinessTypes'
import { useRepresentativeImagePick } from '@/features/store-register/hooks/useRepresentativeImagePick'
import { maskBrn, maskContact } from '@/features/store-register/lib/inputMask'
import { getAxiosErrorMessage } from '@/shared/lib/getAxiosErrorMessage'
import { queryKeys } from '@/shared/lib/queryKeys'
import { ROUTES } from '@/shared/constants/routes'

type Step = 'info' | 'certificate' | 'done'

/** 증명원: JPG/PNG/PDF ≤10MB, 신분증·위임장: ≤5MB */
const CERTIFICATE_MAX_BYTES = 10 * 1024 * 1024
const IDENTITY_MAX_BYTES = 5 * 1024 * 1024

export function useStoreRegisterWizard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const scope = useAuthStore(state => state.scope)
  const certFile = useCertificateFilePick({ maxBytes: CERTIFICATE_MAX_BYTES })
  const identityFile = useCertificateFilePick({ maxBytes: IDENTITY_MAX_BYTES })
  const warrantFile = useCertificateFilePick({ maxBytes: IDENTITY_MAX_BYTES })
  const {
    businessTypes,
    isLoading: isBusinessTypesLoading,
    isError: isBusinessTypesError,
    refetch: refetchBusinessTypes,
  } = useBusinessTypes()
  const representativeImages = useRepresentativeImagePick(scope)

  const [step, setStep] = useState<Step>('info')
  const [bizName, setBizName] = useState('')
  const [brn, setBrn] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [town, setTown] = useState('')
  const [address, setAddress] = useState('')
  const [businessTypeId, setBusinessTypeId] = useState<number | null>(null)
  const [businessTypeDetail, setBusinessTypeDetail] = useState('')
  const [contact, setContact] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setBrnMasked = useCallback((v: string) => setBrn(maskBrn(v)), [])
  const setContactMasked = useCallback(
    (v: string) => setContact(maskContact(v)),
    []
  )

  const selectedBusinessType =
    businessTypes.find(type => type.id === businessTypeId) ?? null
  // '기타'처럼 requiresDetail 인 업종은 상세 입력이 필수
  const businessTypeValid =
    selectedBusinessType !== null &&
    (!selectedBusinessType.requiresDetail ||
      businessTypeDetail.trim().length > 0)

  const infoValid =
    bizName.trim().length > 0 &&
    brn.replace(/\D/g, '').length === 10 &&
    province.trim().length > 0 &&
    district.trim().length > 0 &&
    town.trim().length > 0 &&
    address.trim().length > 0 &&
    businessTypeValid &&
    contact.trim().length > 0

  // 위임장은 선택 — 증명원·신분증만 필수
  const certificateValid = !!certFile.file && !!identityFile.file

  const goInfo = () => setStep('info')
  const goCertificate = () => setStep('certificate')

  const submit = useCallback(async () => {
    if (!certFile.file || !identityFile.file || !infoValid || !businessTypeId) {
      return
    }

    setSubmitError(null)
    setIsSubmitting(true)
    try {
      let workspaceCertFileId: string
      let workspaceOwnIdentityFileId: string
      let workspaceWarrantFileId: string | null = null
      try {
        ;[workspaceCertFileId, workspaceOwnIdentityFileId] = await Promise.all([
          uploadWorkspaceRegistrationFile(certFile.file, 'CERTIFICATE', scope),
          uploadWorkspaceRegistrationFile(
            identityFile.file,
            'OWN_IDENTITY',
            scope
          ),
        ])
        if (warrantFile.file) {
          workspaceWarrantFileId = await uploadWorkspaceRegistrationFile(
            warrantFile.file,
            'WARRANT',
            scope
          )
        }
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
        await createWorkspaceRegistrationRequest(scope, {
          bizName,
          brn,
          province,
          district,
          town,
          address,
          businessTypeId,
          businessTypeDetail: businessTypeDetail.trim() || null,
          contact,
          workspaceCertFileId,
          workspaceOwnIdentityFileId,
          workspaceWarrantFileId,
          // 화면에 보이는 순서가 곧 sortOrder — 첫 장이 메인
          representativeImages: representativeImages.images.map(
            (image, index) => ({ fileId: image.fileId, sortOrder: index })
          ),
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
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeRegisterRequest.list(scope),
      })

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
    representativeImages.images,
    scope,
    town,
    businessTypeId,
    businessTypeDetail,
    warrantFile.file,
    bizName,
    queryClient,
  ])

  const exitToHome = () => navigate(ROUTES.MANAGER.HOME)
  const goRequests = () => navigate(ROUTES.STORE_REGISTER.REQUESTS)

  return {
    step,
    bizName,
    brn,
    province,
    district,
    town,
    address,
    businessTypeId,
    businessTypeDetail,
    businessTypes,
    isBusinessTypesLoading,
    isBusinessTypesError,
    refetchBusinessTypes,
    /** 선택한 업종이 상세 입력을 요구하는지 */
    businessTypeDetailRequired: selectedBusinessType?.requiresDetail ?? false,
    contact,
    setBizName,
    setBrn: setBrnMasked,
    setProvince,
    setDistrict,
    setTown,
    setAddress,
    setBusinessTypeId,
    setBusinessTypeDetail,
    setContact: setContactMasked,
    certFile,
    identityFile,
    warrantFile,
    representativeImages,
    infoValid,
    certificateValid,
    submitError,
    isSubmitting,
    goInfo,
    goCertificate,
    submit,
    exitToHome,
    goRequests,
  }
}
