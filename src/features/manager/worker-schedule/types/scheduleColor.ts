export const ScheduleColor = {
  Pink: '#EB98AD',
  Purple: '#9FA4F8',
  Blue: '#9EC9FD',
  Yellow: '#FCD680',
  LightPink: '#F0BFC0',
  LightPurple: '#CCBAF9',
  Gray: '#C8D2E1',
  DarkGray: '#9E9EA3',
} as const

export type ScheduleColor = (typeof ScheduleColor)[keyof typeof ScheduleColor]
