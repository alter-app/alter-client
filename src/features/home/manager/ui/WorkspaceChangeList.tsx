import {
  WorkspaceChangeCard,
  type WorkspaceChangeItem,
} from './WorkspaceChangeCard'

interface WorkspaceChangeListProps {
  workspaces: WorkspaceChangeItem[]
  selectedWorkspaceId?: number
  categoryLabel?: string
  className?: string
  onSelectWorkspace?: (workspaceId: number) => void
  onEditWorkspace?: (workspaceId: number) => void
}

export function WorkspaceChangeList({
  workspaces,
  selectedWorkspaceId,
  categoryLabel = '',
  className = '',
  onSelectWorkspace,
  onEditWorkspace,
}: WorkspaceChangeListProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {workspaces.map(workspace => (
        <WorkspaceChangeCard
          key={workspace.id}
          workspace={workspace}
          categoryLabel={categoryLabel}
          isSelected={workspace.id === selectedWorkspaceId}
          onClick={onSelectWorkspace}
          onEdit={onEditWorkspace}
        />
      ))}
    </div>
  )
}

export type { WorkspaceChangeListProps }
