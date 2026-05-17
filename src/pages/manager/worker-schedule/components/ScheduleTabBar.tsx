import type { ScheduleTab } from '@/features/manager'
import { SCHEDULE_TABS } from '@/features/manager'
import { cn } from '@/shared/lib/utils'

interface ScheduleTabBarProps {
  activeTab: ScheduleTab
  onTabChange: (tab: ScheduleTab) => void
}

export function ScheduleTabBar({
  activeTab,
  onTabChange,
}: ScheduleTabBarProps) {
  return (
    <div className="flex w-full border-b border-line-2 bg-white">
      {SCHEDULE_TABS.map(tab => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              'flex h-[46px] flex-1 items-center justify-center border-b-2 typography-body01-semibold',
              isActive
                ? 'border-line-3 text-text-100'
                : 'border-line-2 text-text-50'
            )}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
