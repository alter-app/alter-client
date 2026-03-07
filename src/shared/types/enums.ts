export const StatusEnum = {
  PLANNED: 'PLANNED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  DELETED: 'DELETED',
} as const

export type StatusEnum = (typeof StatusEnum)[keyof typeof StatusEnum]
