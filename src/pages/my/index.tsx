import { useNavigate } from 'react-router-dom'
import { logoutSession } from '@/shared/api/auth'
import useAuthStore from '@/shared/stores/useAuthStore'
import { ROUTES } from '@/shared/constants/routes'
import { useUserMe } from '@/features/user/me'
import { ProfileCard } from './components/ProfileCard'
import { MenuListItem } from './components/MenuListItem'
import UserIcon from '@/assets/icons/my/user.svg?react'
import StoreIcon from '@/assets/icons/my/store.svg?react'
import HeadphonesIcon from '@/assets/icons/my/headphones.svg?react'
import FileTextIcon from '@/assets/icons/my/file-text.svg?react'
import SirenIcon from '@/assets/icons/my/siren.svg?react'
import BellIcon from '@/assets/icons/my/bell.svg?react'
import MegaphoneIcon from '@/assets/icons/my/megaphone.svg?react'
import AlertCircleIcon from '@/assets/icons/my/alert-circle.svg?react'

interface MenuItem {
  key: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  path?: string
  onlyManager?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'info', label: '내 정보', icon: UserIcon, path: '/my/info' },
  {
    key: 'store-apply',
    label: '업장 등록 신청',
    icon: StoreIcon,
    path: '/my/store-apply',
  },
  {
    key: 'support',
    label: '문의하기',
    icon: HeadphonesIcon,
    path: '/my/support',
  },
  { key: 'faq', label: '자주 묻는 질문', icon: FileTextIcon, path: '/my/faq' },
  { key: 'reports', label: '신고 내역', icon: SirenIcon, path: '/my/reports' },
  {
    key: 'notifications',
    label: '알림 설정',
    icon: BellIcon,
    path: '/my/notifications',
  },
  { key: 'notice', label: '공지사항', icon: MegaphoneIcon, path: '/my/notice' },
  {
    key: 'app-info',
    label: '앱 정보',
    icon: AlertCircleIcon,
    path: '/my/app-info',
  },
]

function MyPageHeader() {
  return (
    <header className="flex h-14 w-full items-center justify-center border-b border-line-2 bg-bg-light px-4">
      <span className="text-text-100 typography-headline03">마이페이지</span>
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
      <div className="sticky top-0 z-10 bg-bg-light">
        <MyPageHeader />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4">
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

        <nav
          aria-label="마이페이지 메뉴"
          className="mt-3 flex flex-col rounded-2xl"
        >
          {MENU_ITEMS.map((item, index) => (
            <MenuListItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              isLast={index === MENU_ITEMS.length - 1}
              onClick={() => item.path && navigate(item.path)}
            />
          ))}
        </nav>

        <div className="mt-6 flex items-center gap-4 pb-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-main text-white typography-body01-regular"
          >
            로그아웃
          </button>
          <button
            type="button"
            onClick={handleWithdraw}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-white text-text-100 typography-body01-regular"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  )
}
