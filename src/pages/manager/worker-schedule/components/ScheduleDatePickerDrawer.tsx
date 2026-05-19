import { Drawer } from 'vaul'
import { ManagerMonthCalendar } from '@/shared/ui/schedule/ManagerMonthCalendar'

interface ScheduleDatePickerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function ScheduleDatePickerDrawer({
  open,
  onOpenChange,
  selectedDate,
  onDateChange,
}: ScheduleDatePickerDrawerProps) {
  const handleDateChange = (date: Date) => {
    onDateChange(date)
    onOpenChange(false)
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-[40px] bg-white px-4 pb-8 pt-7 shadow-[0_0_10px_rgba(0,0,0,0.15)] outline-none">
          <ManagerMonthCalendar
            variant="picker"
            weekStartsOn={0}
            headerFormat="monthYear"
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
