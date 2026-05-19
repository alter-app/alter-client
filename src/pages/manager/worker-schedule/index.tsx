import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { Spinner } from '@/shared/ui/Spinner'
import type { ScheduleTab } from '@/features/manager'
import {
  ScheduleColor,
  useWorkerScheduleManageViewModel,
} from '@/features/manager'
import { ROUTES } from '@/shared/constants/routes'
import { ColorSelectSection } from '@/pages/manager/worker-schedule/components/ColorSelectSection'
import { FixedScheduleDateSection } from '@/pages/manager/worker-schedule/components/FixedScheduleDateSection'
import { GeneralScheduleDateSection } from '@/pages/manager/worker-schedule/components/GeneralScheduleDateSection'
import type { ScheduleRecurrence } from '@/pages/manager/worker-schedule/components/RecurrenceSelect'
import { ScheduleSaveButton } from '@/pages/manager/worker-schedule/components/ScheduleSaveButton'
import { ScheduleTabBar } from '@/pages/manager/worker-schedule/components/ScheduleTabBar'
import { WorkerSelectSection } from '@/pages/manager/worker-schedule/components/WorkerSelectSection'

function parsePositiveRouteInt(raw: string | undefined): number | null {
  if (raw === undefined) return null
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function ManagerWorkerSchedulePage() {
  const { workspaceId: workspaceIdParam, workerId: workerIdParam } = useParams<{
    workspaceId: string
    workerId: string
  }>()
  const workspaceId = parsePositiveRouteInt(workspaceIdParam)
  const workerId = parsePositiveRouteInt(workerIdParam)

  if (workspaceId === null || workerId === null) {
    return <Navigate to={ROUTES.MANAGER.HOME} replace />
  }

  return (
    <ManagerWorkerSchedulePageContent
      workspaceId={workspaceId}
      workerId={workerId}
    />
  )
}

type ManagerWorkerSchedulePageContentProps = {
  workspaceId: number
  workerId: number
}

function ManagerWorkerSchedulePageContent({
  workspaceId,
  workerId,
}: ManagerWorkerSchedulePageContentProps) {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('고정')
  const [isWorkerDropdownOpen, setIsWorkerDropdownOpen] = useState(false)
  const [isDateSectionOpen, setIsDateSectionOpen] = useState(true)
  const [isColorSectionOpen, setIsColorSectionOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [startDate, setStartDate] = useState(() => new Date())
  const [endDate, setEndDate] = useState(() => new Date())
  const [recurrence, setRecurrence] = useState<ScheduleRecurrence>('매주')
  const [selectedColor, setSelectedColor] = useState<ScheduleColor>(
    ScheduleColor.Pink
  )

  const {
    workersLoading,
    worker,
    workers,
    fixedScheduleLoading,
    goToWorker,
    workdayOptions,
    selectedDays,
    toggleDay,
    workTime,
    handleSave,
    isSaving,
    saveError,
  } = useWorkerScheduleManageViewModel({
    workspaceId,
    workerId,
    activeTab,
    generalSelectedDate: selectedDate,
  })

  if (workersLoading || !worker) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-bg-light">
        <Navbar variant="detail" title="근무자 스케줄 관리" />
        <div className="flex flex-1 items-center justify-center px-4 pt-8">
          <Spinner />
        </div>
      </div>
    )
  }

  const handleSelectWorker = (nextWorkerId: number) => {
    goToWorker(nextWorkerId)
    setIsWorkerDropdownOpen(false)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <Navbar variant="detail" title="근무자 스케줄 관리" />
      <ScheduleTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex flex-1 flex-col gap-8 px-4 pb-4 pt-[30px]">
        <WorkerSelectSection
          worker={worker}
          workers={workers}
          isOpen={isWorkerDropdownOpen}
          onToggle={() => setIsWorkerDropdownOpen(prev => !prev)}
          onSelectWorker={handleSelectWorker}
        />

        {activeTab === '고정' ? (
          <FixedScheduleDateSection
            isOpen={isDateSectionOpen}
            onToggle={() => setIsDateSectionOpen(prev => !prev)}
            workdayOptions={workdayOptions}
            selectedDays={selectedDays}
            onToggleDay={toggleDay}
            recurrence={recurrence}
            onRecurrenceChange={setRecurrence}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            workTime={workTime}
            fixedScheduleLoading={fixedScheduleLoading}
          />
        ) : (
          <GeneralScheduleDateSection
            isOpen={isDateSectionOpen}
            onToggle={() => setIsDateSectionOpen(prev => !prev)}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            workTime={workTime}
          />
        )}

        <ColorSelectSection
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          isOpen={isColorSectionOpen}
          onToggle={() => setIsColorSectionOpen(prev => !prev)}
        />

        {saveError ? (
          <p
            className="px-1 typography-body02-regular text-red-500"
            role="alert"
          >
            {saveError}
          </p>
        ) : null}

        <ScheduleSaveButton
          onClick={handleSave}
          disabled={isSaving || workersLoading || fixedScheduleLoading}
        />
      </main>
    </div>
  )
}
