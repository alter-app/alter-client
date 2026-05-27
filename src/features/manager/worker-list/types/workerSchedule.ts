export type WorkerScheduleData = Record<string, string[]>

export interface WorkerScheduleCalendarProps {
  baseDate: Date
  data: WorkerScheduleData | null
  selectedDate?: string | null
  onEditClick?: () => void
  onDateClick?: (dateKey: string) => void
}
