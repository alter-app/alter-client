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
  onClick,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  alt: string
  isSelected: boolean
  titleKey: TabKey
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
        {TAB_TITLE_MAP[titleKey]}
      </p>
    </button>
  )
}

export type DocbarSelectedTab = Record<TabKey, boolean>

interface DocbarViewProps {
  selectedTab: DocbarSelectedTab
  onTabClick: (tab: TabKey) => void
  tabs: TabKey[]
}

export function DocbarView({ selectedTab, onTabClick, tabs }: DocbarViewProps) {
  const iconByTab: Record<TabKey, ComponentType<SVGProps<SVGSVGElement>>> = {
    home: HomeIcon,
    search: SearchIcon,
    substitute: SubstituteIcon,
    my: MYIcon,
  }

  const altByTab: Record<TabKey, string> = {
    home: 'Home',
    search: 'Search',
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

  const tabs = useMemo<TabKey[]>(
    () => ['home', 'search', 'substitute', 'my'],
    []
  )

  const pathByTab: Record<TabKey, string> = useMemo(
    () => ({
      home: homePathForScope(scope),
      search: ROUTES.USER.JOB_LOOKUP_MAP,
      substitute:
        scope === 'MANAGER'
          ? ROUTES.MANAGER.SUBSTITUTE_REQUEST
          : ROUTES.USER.SUBSTITUTE_REQUEST,
      my: ROUTES.MY.ROOT,
    }),
    [scope]
  )

  const onTabClick = (tab: TabKey) => {
    navigate(pathByTab[tab])
  }

  return (
    <DocbarView selectedTab={selectedTab} onTabClick={onTabClick} tabs={tabs} />
  )
}
