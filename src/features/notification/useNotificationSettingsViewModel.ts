import { useState } from 'react'

export function useNotificationSettingsViewModel() {
  const [allEnabled, setAllEnabled] = useState(true)
  const [substituteEnabled, setSubstituteEnabled] = useState(true)
  const [reputationEnabled, setReputationEnabled] = useState(true)

  const handleAllChange = (checked: boolean) => {
    setAllEnabled(checked)
    setSubstituteEnabled(checked)
    setReputationEnabled(checked)
  }

  return {
    allEnabled,
    substituteEnabled,
    reputationEnabled,
    handleAllChange,
    setSubstituteEnabled,
    setReputationEnabled,
  }
}
