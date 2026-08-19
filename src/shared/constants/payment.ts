/** 급여 지급 형태 — 서버 enum */
export const PAYMENT_TYPES = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'] as const

export type PaymentType = (typeof PAYMENT_TYPES)[number]

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  HOURLY: '시급',
  DAILY: '일급',
  WEEKLY: '주급',
  MONTHLY: '월급',
}
