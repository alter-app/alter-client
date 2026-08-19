import type { ReactNode } from 'react'

import type { WorkspaceFilter } from '@/features/manager/posting/hooks/query/useWorkspaceFilterOptions'
import { FilterBar } from '@/features/manager/posting/ui/FilterBar'
import type { SelectOption } from '@/shared/ui/common/SelectDropdown'
import { Navbar } from '@/shared/ui/common/Navbar'

interface PostingListStickyHeaderProps<TStatus extends string> {
  rightAction: ReactNode
  workspaceOptions: SelectOption<WorkspaceFilter>[]
  workspaceValue: WorkspaceFilter
  onWorkspaceChange: (value: WorkspaceFilter) => void
  statusOptions: readonly SelectOption<TStatus>[]
  statusValue: TStatus
  onStatusChange: (value: TStatus) => void
  totalCount: number
}

export function PostingListStickyHeader<TStatus extends string>({
  rightAction,
  workspaceOptions,
  workspaceValue,
  onWorkspaceChange,
  statusOptions,
  statusValue,
  onStatusChange,
  totalCount,
}: PostingListStickyHeaderProps<TStatus>) {
  return (
    <div className="sticky top-0 z-40 bg-bg-light">
      <Navbar
        variant="detail"
        title="내 공고"
        showBack={false}
        rightAction={rightAction}
      />
      <div className="mx-auto w-full max-w-[400px] px-4 pt-4">
        <FilterBar
          workspaceOptions={workspaceOptions}
          workspaceValue={workspaceValue}
          onWorkspaceChange={onWorkspaceChange}
          statusOptions={statusOptions}
          statusValue={statusValue}
          onStatusChange={onStatusChange}
          totalCount={totalCount}
        />
      </div>
    </div>
  )
}
