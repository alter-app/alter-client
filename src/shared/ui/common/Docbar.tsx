import ApplicantIcon from '@/assets/icons/doc/Applicant.svg?react'
import HomeIcon from '@/assets/icons/doc/Home.svg?react'
import MYIcon from '@/assets/icons/doc/MY.svg?react'
import SearchIcon from '@/assets/icons/doc/Search.svg?react'
import SubstituteIcon from '@/assets/icons/doc/Substitute.svg?react'
import type { ComponentType, SVGProps } from 'react'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDocStore } from '@/shared/stores/useDocStore'
import { typography } from '@/shared/lib/tokens'
import { TAB_TITLE_MAP, type TabKey } from '@/shared/types/tab'
import { homePathForScope } from '@/shared/lib/homePath'
import { ROUTES } from '@/shared/constants/routes'
import useAuthStore from '@/shared/stores/useAuthStore'

function DocContent({
  icon,
  alt,
  isSelected,
  titleKey,
  label,
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  alt: string
  isSelected: boolean
  titleKey: TabKey
  label?: string
  onClick: () => void
}) {
  const Icon = icon

  return (
    <button
      type="button"
      className="flex min-w-0 flex-1 flex-col items-center gap-1 cursor-pointer h-[78px] pt-2.5 pb-3"
      onClick={onClick}
    >
      <Icon
        className={`${isSelected ? 'text-text-100' : 'text-text-50'} h-6 w-6 [&_*]:!fill-current [&_*]:!stroke-current`}
        aria-label={alt}
      />
      <p
        className={isSelected ? 'text-text-100' : 'text-text-50'}
        style={{
          fontSize: typography.doc.fontSize,
          fontWeight: typography.doc.fontWeight,
          lineHeight: typography.doc.lineHeight,
          letterSpacing: typography.doc.letterSpacing,
        }}
      >
        {label ?? TAB_TITLE_MAP[titleKey]}
      </p>
    </button>
  )
}

export type DocbarSelectedTab = Record<TabKey, boolean>

interface DocbarViewProps {
  selectedTab: DocbarSelectedTab
  onTabClick: (tab: TabKey) => void
  tabs: TabKey[]
  /** 탭별 라벨 오버라이드 — 미지정 탭은 TAB_TITLE_MAP 기본값을 사용 */
  labelByTab?: Partial<Record<TabKey, string>>
}

export function DocbarView({
  selectedTab,
  onTabClick,
  tabs,
  labelByTab,
}: DocbarViewProps) {
  const iconByTab: Record<TabKey, ComponentType<SVGProps<SVGSVGElement>>> = {
    home: HomeIcon,
    search: SearchIcon,
    applicant: ApplicantIcon,
    substitute: SubstituteIcon,
    my: MYIcon,
  }

  const altByTab: Record<TabKey, string> = {
    home: 'Home',
    search: 'Search',
    applicant: 'Applicant',
    substitute: 'Substitute',
    my: 'MY',
  }

  return (
    <div className="flex items-center justify-between w-full px-4 bg-white shadow-[0px_-4px_10px_rgba(0,_0,_0,_0.1)]">
      <div className="flex items-center justify-between w-full">
        {tabs.map(tab => (
          <DocContent
            key={tab}
            icon={iconByTab[tab]}
            alt={altByTab[tab]}
            isSelected={selectedTab[tab]}
            titleKey={tab}
            label={labelByTab?.[tab]}
            onClick={() => onTabClick(tab)}
          />
        ))}
      </div>
    </div>
  )
}

export function Docbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const selectedTab = useDocStore(state => state.selectedTab)
  const setSelectedTabByPathname = useDocStore(
    state => state.setSelectedTabByPathname
  )
  const { scope } = useAuthStore()

  useEffect(() => {
    setSelectedTabByPathname(pathname)
  }, [pathname, setSelectedTabByPathname])

  const isManager = scope === 'MANAGER'

  /** 지원자 탭은 사장님 전용 — 일반 유저는 기존 4탭을 유지합니다 */
  const tabs = useMemo<TabKey[]>(
    () =>
      isManager
        ? ['home', 'search', 'applicant', 'substitute', 'my']
        : ['home', 'search', 'substitute', 'my'],
    [isManager]
  )

  const pathByTab: Record<TabKey, string> = useMemo(
    () => ({
      home: homePathForScope(scope),
      // 사장님은 구인구직(내 공고 목록), 일반 유저는 기존 알바찾기 경로 유지
      search: isManager ? ROUTES.MANAGER.POSTINGS : ROUTES.USER.JOB_LOOKUP_MAP,
      // 사장님 전용 탭 — 일반 유저에게는 렌더링되지 않습니다
      applicant: ROUTES.MANAGER.POSTING_APPLICATIONS,
      substitute: isManager
        ? ROUTES.MANAGER.SUBSTITUTE_REQUEST
        : ROUTES.USER.SUBSTITUTE_REQUEST,
      my: ROUTES.MY.ROOT,
    }),
    [scope, isManager]
  )

  /** 사장님에게는 '알바 찾기' 대신 '내 공고'로 노출 */
  const labelByTab = useMemo<Partial<Record<TabKey, string>> | undefined>(
    () => (isManager ? { search: '내 공고' } : undefined),
    [isManager]
  )

  const onTabClick = (tab: TabKey) => {
    navigate(pathByTab[tab])
  }

  return (
    <DocbarView
      selectedTab={selectedTab}
      onTabClick={onTabClick}
      tabs={tabs}
      labelByTab={labelByTab}
    />
  )
}
