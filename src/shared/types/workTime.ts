export interface WorkTimeEditorState {
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  setStartTime: (hour: string, minute: string) => void
  setEndTime: (hour: string, minute: string) => void
}
