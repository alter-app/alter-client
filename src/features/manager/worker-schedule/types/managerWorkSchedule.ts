export type CreateWorkScheduleRequest = {
  workspaceId: number
  startDateTime: string
  endDateTime: string
  position: string
}

export type UpdateWorkScheduleRequest = {
  startDateTime: string
  endDateTime: string
  position: string
}

export type AssignWorkerToScheduleRequest = {
  workerId: number
}
