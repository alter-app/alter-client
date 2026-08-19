import type { WorkspaceFilter } from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import { SelectDropdown } from '@/shared/ui/common/SelectDropdown'
import type { SelectOption } from '@/shared/ui/common/SelectDropdown'

interface FilterBarProps<TStatus extends string> {
  workspaceOptions: SelectOption<WorkspaceFilter>[]
  workspaceValue: WorkspaceFilter
  onWorkspaceChange: (value: WorkspaceFilter) => void
  statusOptions: readonly SelectOption<TStatus>[]
  statusValue: TStatus
  onStatusChange: (value: TStatus) => void
  totalCount: number
  showWorkspaceFilter?: boolean
}

export function FilterBar<TStatus extends string>({
  workspaceOptions,
  workspaceValue,
  onWorkspaceChange,
  statusOptions,
  statusValue,
  onStatusChange,
  totalCount,
  showWorkspaceFilter = true,
}: FilterBarProps<TStatus>) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {showWorkspaceFilter ? (
          <SelectDropdown
            className="flex-1"
            ariaLabel="업장 필터"
            options={workspaceOptions}
            value={workspaceValue}
            onChange={onWorkspaceChange}
          />
        ) : null}
        <SelectDropdown
          className="flex-1"
          ariaLabel="상태 필터"
          options={[...statusOptions]}
          value={statusValue}
          onChange={onStatusChange}
        />
      </div>
      <p className="mt-3 typography-body02-regular text-text-70">
        총{' '}
        <span className="text-main typography-body02-semibold">
          {totalCount}
        </span>
        건
      </p>
    </div>
  )
}
