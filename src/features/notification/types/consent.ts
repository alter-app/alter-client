export const CONSENT_TYPE = {
  GENERAL: 'GENERAL',
  NIGHT: 'NIGHT',
  SUBSTITUTE: 'SUBSTITUTE',
  REPUTATION: 'REPUTATION',
} as const

export type ConsentType = (typeof CONSENT_TYPE)[keyof typeof CONSENT_TYPE]

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
  type: ConsentType
  consent: boolean
}
