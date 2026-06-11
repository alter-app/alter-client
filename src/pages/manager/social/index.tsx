import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/shared/ui/common/Navbar'
import { useChatRoomsViewModel } from '@/features/social'
import { useNavbarNotificationProps } from '@/features/notification'
import { SwipeableSocialItem } from '@/features/social/ui/SocialList'

import SearchIcon from '@/assets/icons/search.svg'
import MessageIcon from '@/assets/icons/doc/Message.svg'
import { SocialSearch } from '@/features/social/common/SocialSearch'

export function SocialPage() {
  const [searchPopupOpen, setSearchPopupOpen] = useState(false)
  const navigate = useNavigate()
  const notificationProps = useNavbarNotificationProps()
  const { chatRooms, isLoading, isError } = useChatRoomsViewModel()

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar {...notificationProps} />

      <SocialSearch onClick={() => setSearchPopupOpen(true)} />
      <main className="flex-1 overflow-y-auto">
        <section>
          {isLoading && (
            <div className="px-4 py-6 typography-body02-regular text-text-70">
              목록을 불러오는 중입니다.
            </div>
          )}
          {isError && !isLoading && (
            <div className="px-4 py-6 typography-body02-regular text-error">
              목록을 불러오지 못했습니다.
            </div>
          )}
          {!isLoading &&
            !isError &&
            chatRooms.map(item => (
              <SwipeableSocialItem
                key={item.id}
                name={item.name}
                message={item.message}
                timeAgo={item.timeAgo}
                unread={item.unread}
              />
            ))}
        </section>
      </main>

      {searchPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 px-3 flex items-center justify-center"
          onClick={() => setSearchPopupOpen(false)}
        >
          <div
            className="w-full max-w-[358px] rounded-[20px] bg-white px-4 pt-[38px] pb-[44px]"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex h-12 w-full items-center gap-2 rounded-[16px] border border-line-2 bg-bg-dark px-5"
            >
              <img src={SearchIcon} alt="search" />
              <span className="typography-body01-regular text-text-50">
                검색
              </span>
            </button>

            <div className="mt-3">
              {chatRooms.map(item => (
                <div
                  key={item.id}
                  className="py-4 border-b border-line-1 flex items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full border border-line-2 bg-bg-light" />
                  <div className="flex-1">
                    <div className="typography-body01-semibold text-text-100">
                      {item.name}
                    </div>
                    <div className="typography-body02-regular text-text-100">
                      {item.message}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      setSearchPopupOpen(false)
                      navigate('/manager/social/chat')
                    }}
                  >
                    <img src={MessageIcon} alt="message" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
