import { cn } from '@/shared/lib/utils'

export type SubstituteDirectionTab = 'sent' | 'received'

interface SubstituteRequestTabsProps {
  activeTab: SubstituteDirectionTab
  onTabChange: (tab: SubstituteDirectionTab) => void
}

export function SubstituteRequestTabs({
  activeTab,
  onTabChange,
}: SubstituteRequestTabsProps) {
  return (
    <div className="flex h-[46px] w-full border-b border-line-1 bg-white">
      <button
        type="button"
        className={cn(
          'flex-1 typography-body01-semibold transition-colors',
          activeTab === 'sent'
            ? 'border-b-2 border-line-3 text-text-100'
            : 'border-b-2 border-line-1 text-text-50'
        )}
        onClick={() => onTabChange('sent')}
      >
        보낸 대타요청
      </button>
      <button
        type="button"
        className={cn(
          'flex-1 typography-body01-semibold transition-colors',
          activeTab === 'received'
            ? 'border-b-2 border-line-3 text-text-100'
            : 'border-b-2 border-line-1 text-text-50'
        )}
        onClick={() => onTabChange('received')}
      >
        받은 대타요청
      </button>
    </div>
  )
}
