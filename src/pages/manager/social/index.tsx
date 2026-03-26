import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '@/shared/ui/MobileLayout'
import { Navbar } from '@/shared/ui/common/Navbar'
import { SocialCategory } from '@/shared/ui/manager/social/SocialCategory'
import { SwipeableSocialItem } from '@/shared/ui/manager/social/SocialList'
import { SocialSearch } from '@/shared/ui/manager/social/SocialSearch'
import { FloatingActionButton } from '@/shared/ui/common/FloatingActionButton'

import SearchIcon from '@/assets/icons/search.svg'
import messageIcon from '@/assets/icons/message.svg'

const SOCIAL_CATEGORY = [
  {
    id: 1,
    name: '전체',
  },
  {
    id: 2,
    name: '알바1',
  },
  {
    id: 3,
    name: '알바 2',
  },
  {
    id: 4,
    name: '알바 3',
  },
]

const SOCIAL_LIST = [
  {
    id: 1,
    name: '나영채',
    message: '메시지 내용 최대 한 줄만 출력 됩니다.',
    timeAgo: '1시간 전',
    unread: true,
  },
  {
    id: 2,
    name: '나영채',
    message: '메시지 내용 최대 한 줄만 출력 됩니다.',
    timeAgo: '1시간 전',
    unread: false,
  },
]

export function SocialPage() {
  const [searchPopupOpen, setSearchPopupOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <MobileLayout>
      <div className="min-h-[100dvh] flex flex-col">
        <Navbar />
        <div className="px-3 py-3 flex gap-2 mb-[15px]">
          {SOCIAL_CATEGORY.map((item, index) => (
            <SocialCategory
              key={item.id}
              label={item.name}
              active={index === 0}
            />
          ))}
        </div>

        <main className="flex-1 overflow-y-auto">
          <section>
            {SOCIAL_LIST.map(item => (
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

        <div className="px-3 pb-2 pt-3">
          <div className="flex items-center gap-3">
            <SocialSearch onClick={() => setSearchPopupOpen(true)} />

            <FloatingActionButton />
          </div>
        </div>
      </div>

      {searchPopupOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/20 px-3 flex items-center justify-center"
          onClick={() => setSearchPopupOpen(false)}
        >
          <div
            className="w-[358px] rounded-[20px] bg-white px-4 pt-[38px] pb-[44px]"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="w-full rounded-[16px] gap-2 bg-[#e7e7e7] h-12 px-5 flex items-center border border-[#d8d8d8]"
            >
              <img src={SearchIcon} alt="search" />
              <span className="typography-body01-regular text-text-50">
                검색
              </span>
            </button>

            <div className="mt-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="py-4 border-b border-line-1 flex items-center gap-3"
                >
                  <div className="h-12 w-12 rounded-full bg-[#f4f4f4] border border-[#e6e6e6]" />
                  <div className="flex-1">
                    <div className="typography-body01-semibold text-text-100">
                      나영채
                    </div>
                    <div className="typography-body02-regular text-text-100">
                      근무지 이름
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
                    <img src={messageIcon} alt="message" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  )
}
