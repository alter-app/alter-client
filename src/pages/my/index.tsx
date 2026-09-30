import { useNavigate } from 'react-router-dom'
import { logoutSession } from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/shared/constants/routes'
import { useUserMe } from '@/features/user/me'
import { ProfileCard } from './components/ProfileCard'
import { MenuListItem } from './components/MenuListItem'
import BookmarkIcon from '@/assets/icons/job-lookup-map/Bookmark.svg?react'
import StoreIcon from '@/assets/icons/my/store.svg?react'
import BellIcon from '@/assets/icons/my/bell.svg?react'

interface MenuItem {
  key: string
  label: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  path: string
  onlyManager?: boolean
  onlyWorker?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'scrapped-postings',
    label: '스크랩한 알바',
    description: '저장해 둔 채용 공고를 확인해요',
    icon: BookmarkIcon,
    path: ROUTES.MY.SCRAPPED_POSTINGS,
    onlyWorker: true,
  },
  {
    key: 'store-apply',
    label: '업장 등록 신청',
    description: '신청 현황과 처리 결과를 확인해요',
    icon: StoreIcon,
    path: ROUTES.STORE_REGISTER.REQUESTS,
  },
  {
    key: 'notifications',
    label: '알림 설정',
    description: '받고 싶은 알림을 선택해요',
    icon: BellIcon,
    path: ROUTES.NOTIFICATION_SETTINGS,
  },
]

function MyPageHeader() {
  return (
    <header className="flex h-14 w-full items-center bg-white/95 px-5 backdrop-blur">
      <h1 className="text-text-100 typography-headline02">마이페이지</h1>
    </header>
  )
}

export function MyPage() {
  const navigate = useNavigate()
  const { scope, logout, isLoggedIn } = useAuthStore()
  const { user, isLoading, isError } = useUserMe()

  const isManager = scope === 'MANAGER'
  const nickname = user.nickname || user.name || '알터'
  const realName = user.name
  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (item.onlyManager && !isManager) return false
    if (item.onlyWorker && isManager) return false
    return true
  })

  const handleEditProfile = () => {
    navigate(ROUTES.MY.PROFILE)
  }

  const handleLogout = async () => {
    try {
      await logoutSession(scope, isLoggedIn)
    } catch {
      // 서버 로그아웃 실패 시에도 로컬 세션은 정리
    } finally {
      logout()
      navigate(ROUTES.AUTH.LOGIN, { replace: true })
    }
  }

  const handleWithdraw = () => {
    navigate(ROUTES.MY.WITHDRAW)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-bg-light">
      <div className="sticky top-0 z-10 bg-white">
        <MyPageHeader />
      </div>

      <main className="flex flex-1 flex-col px-4 pb-8 pt-5">
        <ProfileCard
          nickname={nickname}
          realName={realName}
          isManager={isManager}
          avatarUrl={user.profileImageUrl}
          onEditClick={handleEditProfile}
        />

        {isLoading && (
          <p
            className="mt-2 px-1 text-text-70 typography-body03-regular"
            role="status"
          >
            사용자 정보를 불러오는 중입니다.
          </p>
        )}
        {isError && (
          <p
            className="mt-2 px-1 text-error typography-body03-regular"
            role="alert"
          >
            사용자 정보를 불러오지 못했습니다.
          </p>
        )}

        <section className="mt-7">
          <h2 className="mb-2 px-1 text-text-70 typography-body02-semibold">
            내 활동 및 설정
          </h2>
          <nav
            aria-label="마이페이지 메뉴"
            className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(35,35,35,0.04)]"
          >
            {visibleMenuItems.map((item, index) => (
              <MenuListItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                description={item.description}
                isLast={index === visibleMenuItems.length - 1}
                onClick={() => navigate(item.path)}
              />
            ))}
          </nav>
        </section>

        {!isManager && (
          <div className="mt-3 rounded-xl bg-main-100 px-4 py-3">
            <p className="text-sub typography-body03-regular">
              업장 등록 승인 후 사장님으로 전환할 수 있어요.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3 text-text-70 typography-body03-regular">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-2 py-1 underline-offset-4 hover:text-text-100 hover:underline"
          >
            로그아웃
          </button>
          <span aria-hidden="true" className="h-3 w-px bg-line-2" />
          <button
            type="button"
            onClick={handleWithdraw}
            className="rounded-md px-2 py-1 underline-offset-4 hover:text-error hover:underline"
          >
            회원 탈퇴
          </button>
        </div>
      </main>
    </div>
  )
}
