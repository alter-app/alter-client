import { WorkspaceChangeCard } from './WorkspaceChangeCard'
import type { WorkspaceItemDto } from '@/features/manager/home/types/workspace'

interface WorkspaceChangeListProps {
  workspaces: WorkspaceItemDto[]
  selectedWorkspaceId?: number
  className?: string
  onSelectWorkspace?: (workspaceId: number) => void
}

export function WorkspaceChangeList({
  workspaces,
  selectedWorkspaceId,
  className = '',
  onSelectWorkspace,
}: WorkspaceChangeListProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {workspaces.map(workspace => (
        <WorkspaceChangeCard
          key={workspace.id}
          workspace={workspace}
          isSelected={workspace.id === selectedWorkspaceId}
          onClick={onSelectWorkspace}
        />
      ))}
    </div>
  )
}

export type { WorkspaceChangeListProps }
