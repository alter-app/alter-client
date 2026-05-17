export interface WorkTimeEditorState {
  startHour: string
  startMinute: string
  endHour: string
  endMinute: string
  setStartHour: (value: string) => void
  setStartMinute: (value: string) => void
  setEndHour: (value: string) => void
  setEndMinute: (value: string) => void
}
