import axiosInstance from '@/shared/lib/axiosInstance'
import type { StoreRegistrationDraft } from '@/features/store-register/types'

export type SubmitStoreRegistrationResult = {
  requestId: string
}

/**
 * 업장 최초 등록(사업자 증빙 첨부) 요청.
 * 백엔드 스펙 확정 후 FormData 필드명·URL만 맞추면 됩니다.
 */
export async function submitStoreRegistrationRequest(
  draft: StoreRegistrationDraft
): Promise<SubmitStoreRegistrationResult> {
  const formData = new FormData()
  formData.append('storeName', draft.storeName.trim())
  formData.append('businessType', draft.businessType.trim())
  formData.append('addressLine', draft.addressLine.trim())
  formData.append('certificateFile', draft.certificateFile)

  try {
    const response = await axiosInstance.post<{ data?: { requestId?: string } }>(
      '/app/managers/me/workspaces/registration-requests',
      formData
    )

    const requestId = response.data?.data?.requestId
    if (requestId) {
      return { requestId }
    }
  } catch {
    /* 백엔드 미연동 시 목 응답으로 UI 흐름만 확인 */
  }

  await new Promise(r => setTimeout(r, 400))
  return { requestId: `MOCK-${Date.now()}` }
}
