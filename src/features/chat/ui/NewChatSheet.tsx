import { useNewChatViewModel } from '@/features/chat/hooks/useNewChatViewModel'
import { ContactPickerRow } from '@/features/chat/ui/ContactPicker'
import { Modal } from '@/shared/ui/common/Modal'
import { SearchBar } from '@/shared/ui/common/SearchBar'
import { Skeleton } from '@/shared/ui/common/Skeleton'

interface NewChatSheetProps {
  isOpen: boolean
  onClose: () => void
}

function ContactSkeleton() {
  return (
    <div aria-busy>
      {[0, 1, 2, 3].map(index => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-line-1 py-3"
        >
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function NewChatSheet({ isOpen, onClose }: NewChatSheetProps) {
  const {
    keyword,
    setKeyword,
    contacts,
    isLoading,
    isError,
    refetch,
    isEmpty,
    hasKeyword,
    isCreating,
    selectContact,
  } = useNewChatViewModel({ enabled: isOpen, onNavigated: onClose })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 채팅">
      <SearchBar
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
        placeholder="이름 또는 근무지 검색"
        aria-label="대화 상대 검색"
      />

      <div className="mt-3">
        {isLoading ? <ContactSkeleton /> : null}

        {isError && !isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="typography-body02-regular text-text-70">
              동료 목록을 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="h-11 rounded-[12px] border border-line-2 px-6 typography-body02-semibold text-text-100"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="typography-body01-semibold text-text-100">
              {hasKeyword ? '검색 결과가 없어요' : '대화할 동료가 없어요'}
            </p>
            <p className="typography-body02-regular text-text-70">
              {hasKeyword
                ? '다른 이름이나 근무지로 검색해보세요.'
                : '같은 근무지에 동료가 등록되면 여기에 표시돼요.'}
            </p>
          </div>
        ) : null}

        {!isLoading && !isError && contacts.length > 0 ? (
          <ul>
            {contacts.map(contact => (
              <li key={contact.key}>
                <ContactPickerRow
                  contact={contact}
                  disabled={isCreating}
                  onSelect={() => void selectContact(contact)}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Modal>
  )
}
