export interface NotificationConsentType {
  value: string
  description: string
}

export interface NotificationConsentItem {
  type: NotificationConsentType
  consent: boolean
}

export interface NotificationConsentResponse {
  timestamp: string
  data: {
    items: NotificationConsentItem[]
  }
}

export interface UpdateNotificationConsentRequest {
  type: string
  consent: boolean
}

export const CONSENT_TYPE = {
  GENERAL: 'GENERAL',
  NIGHT: 'NIGHT',
} as const
