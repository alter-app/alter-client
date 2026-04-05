import { useState } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/features/social/ui/drawer'
import {
  AlbaFindCategoryBar,
  type AlbaFindFilterId,
  type AlbaFindMode,
} from '@/shared/ui/manager/alba-find/AlbaFindCategoryBar'
import { AlbaFindList } from '@/shared/ui/manager/alba-find/AlbaFindList'
import {
  Albabox,
  type AlbaboxProps,
} from '@/shared/ui/manager/alba-find/Albabox'

export type AlbaFindDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobs: AlbaboxProps[]
}

export function AlbaFindDrawer({
  open,
  onOpenChange,
  jobs,
}: AlbaFindDrawerProps) {
  const [mode, setMode] = useState<AlbaFindMode>('nearby')
  const [activeFilter, setActiveFilter] = useState<AlbaFindFilterId>('sort')

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex max-h-[90vh] flex-col gap-0 p-0">
        <div className="sr-only">
          <DrawerTitle>알바 찾기</DrawerTitle>
          <DrawerDescription>
            주변 또는 지역 기준으로 알바 공고를 확인할 수 있습니다.
          </DrawerDescription>
        </div>

        <div className="shrink-0 px-4 pb-4 pt-1">
          <AlbaFindCategoryBar
            mode={mode}
            onModeChange={setMode}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <AlbaFindList className="px-4 pb-6">
            {jobs.map((job, index) => (
              <Albabox key={`${job.title}-${index}`} {...job} />
            ))}
          </AlbaFindList>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
