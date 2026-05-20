import { useState } from 'react'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useNotificationConsent } from '@/features/notification/hooks/useNotificationConsent'
import { useUpdateNotificationConsent } from '@/features/notification/hooks/useUpdateNotificationConsent'
import { CONSENT_TYPE } from '@/features/notification/types/consent'

function getConsent(
  items: Array<{ type: { value: string }; consent: boolean }>,
  typeValue: string
): boolean {
  return items.find(i => i.type.value === typeValue)?.consent ?? true
}

export function useNotificationSettingsViewModel() {
  const scope = useAuthStore(s => s.scope)

  const { data, isLoading } = useNotificationConsent(scope)
  const { mutate } = useUpdateNotificationConsent(scope)

  const items = data?.data.items ?? []
  const allEnabled = getConsent(items, CONSENT_TYPE.GENERAL)

  const [substituteEnabled, setSubstituteEnabled] = useState(true)
  const [reputationEnabled, setReputationEnabled] = useState(true)

  const handleAllChange = (checked: boolean) => {
    mutate({ type: CONSENT_TYPE.GENERAL, consent: checked })
    setSubstituteEnabled(checked)
    setReputationEnabled(checked)
  }

  return {
    isLoading,
    allEnabled,
    substituteEnabled,
    reputationEnabled,
    handleAllChange,
    setSubstituteEnabled,
    setReputationEnabled,
  }
}
