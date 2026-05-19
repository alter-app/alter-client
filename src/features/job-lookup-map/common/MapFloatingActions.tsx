import type { ReactNode } from 'react'
import ListViewIcon from '@/assets/icons/job-lookup-map/List.svg?react'
import MyLocationIcon from '@/assets/icons/job-lookup-map/Mappin.svg?react'
type MapFabButtonProps = {
  onClick?: () => void
  ariaLabel: string
  children: ReactNode
}

function MapFabButton({ onClick, ariaLabel, children }: MapFabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.12)] transition-transform active:scale-95"
    >
      {children}
    </button>
  )
}

type MapFloatingActionsProps = {
  onListClick?: () => void
  onMyLocationClick?: () => void
  className?: string
}

export function MapFloatingActions({
  onListClick,
  onMyLocationClick,
  className = '',
}: MapFloatingActionsProps) {
  return (
    <div
      className={`pointer-events-auto flex flex-col gap-2 ${className}`}
      role="group"
      aria-label="지도 도구"
    >
      <MapFabButton onClick={onListClick} ariaLabel="목록 보기">
        <ListViewIcon className="h-6 w-6 " />
      </MapFabButton>
      <MapFabButton onClick={onMyLocationClick} ariaLabel="내 위치로 이동">
        <MyLocationIcon className="h-6 w-6 " />
      </MapFabButton>
    </div>
  )
}
