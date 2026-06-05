import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useNotificationConsent } from '@/features/notification/hooks/useNotificationConsent'
import { useUpdateNotificationConsent } from '@/features/notification/hooks/useUpdateNotificationConsent'
import {
  CONSENT_TYPE,
  type NotificationConsentResponse,
} from '@/features/notification/types/consent'
import { queryKeys } from '@/shared/lib/queryKeys'

function getConsent(
  items: Array<{ type: { value: string }; consent: boolean }>,
  typeValue: string
): boolean {
  return items.find(i => i.type.value === typeValue)?.consent ?? true
}

export function useNotificationSettingsViewModel() {
  const scope = useAuthStore(s => s.scope)
  const queryClient = useQueryClient()

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

  const getFreshItems = async () => {
    await queryClient.refetchQueries({
      queryKey: queryKeys.notification.consent(scope),
    })
    return (
      queryClient.getQueryData<NotificationConsentResponse>(
        queryKeys.notification.consent(scope)
      )?.data.items ?? []
    )
  }

  const handleSubstituteChange = async (checked: boolean) => {
    await mutateAsync({ type: CONSENT_TYPE.SUBSTITUTE, consent: checked })
    if (!checked) {
      const freshItems = await getFreshItems()
      if (!getConsent(freshItems, CONSENT_TYPE.REPUTATION)) {
        await mutateAsync({ type: CONSENT_TYPE.GENERAL, consent: false })
      }
    }
  }

  const handleReputationChange = async (checked: boolean) => {
    await mutateAsync({ type: CONSENT_TYPE.REPUTATION, consent: checked })
    if (!checked) {
      const freshItems = await getFreshItems()
      if (!getConsent(freshItems, CONSENT_TYPE.SUBSTITUTE)) {
        await mutateAsync({ type: CONSENT_TYPE.GENERAL, consent: false })
      }
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
