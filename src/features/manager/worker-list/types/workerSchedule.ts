export type WorkerScheduleData = Record<string, string[]>

export interface WorkerScheduleCalendarProps {
  baseDate: Date
  data: WorkerScheduleData | null
  onEditClick?: () => void
}
