import MessageIcon from '@/assets/icons/doc/Message.svg?react'
import { Avatar } from '@/shared/ui/common/Avatar'
import type { ChatContact } from '@/features/chat/types/chat'

interface ContactPickerRowProps {
  contact: ChatContact
  onSelect: () => void
  disabled?: boolean
}

export function ContactPickerRow({
  contact,
  onSelect,
  disabled = false,
}: ContactPickerRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className="flex w-full items-center gap-3 border-b border-line-1 py-3 text-left disabled:opacity-60"
    >
      <Avatar src={contact.profileImageUrl} alt={contact.name} size={48} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="truncate typography-body01-semibold text-text-100">
            {contact.name}
          </span>
          {contact.existingRoomId !== undefined ? (
            <span className="shrink-0 rounded-full bg-main-100 px-2 py-0.5 typography-doc text-sub">
              대화중
            </span>
          ) : null}
        </div>
        <span className="truncate typography-body03-regular text-text-70">
          {contact.workspaceName}
        </span>
      </div>

      <MessageIcon
        aria-hidden
        className="h-6 w-6 shrink-0 text-main [&_*]:!fill-current"
      />
    </button>
  )
}
