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
  const { mutate, mutateAsync } = useUpdateNotificationConsent(scope)

  const items = data?.data.items ?? []
  const allEnabled = getConsent(items, CONSENT_TYPE.GENERAL)
  const nightEnabled = getConsent(items, CONSENT_TYPE.NIGHT)
  const substituteEnabled = getConsent(items, CONSENT_TYPE.SUBSTITUTE)
  const reputationEnabled = getConsent(items, CONSENT_TYPE.REPUTATION)

  const handleAllChange = (checked: boolean) => {
    mutate({ type: CONSENT_TYPE.GENERAL, consent: checked })
  }

  const handleNightChange = (checked: boolean) => {
    mutate({ type: CONSENT_TYPE.NIGHT, consent: checked })
  }

  const handleSubstituteChange = async (checked: boolean) => {
    await mutateAsync({ type: CONSENT_TYPE.SUBSTITUTE, consent: checked })
    if (!checked && !reputationEnabled) {
      await mutateAsync({ type: CONSENT_TYPE.GENERAL, consent: false })
    }
  }

  const handleReputationChange = async (checked: boolean) => {
    await mutateAsync({ type: CONSENT_TYPE.REPUTATION, consent: checked })
    if (!checked && !substituteEnabled) {
      await mutateAsync({ type: CONSENT_TYPE.GENERAL, consent: false })
    }
  }

  return {
    isLoading,
    allEnabled,
    nightEnabled,
    substituteEnabled,
    reputationEnabled,
    handleAllChange,
    handleNightChange,
    handleSubstituteChange,
    handleReputationChange,
  }
}
