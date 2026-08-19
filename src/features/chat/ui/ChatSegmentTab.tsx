import { cn } from '@/shared/lib/utils'
import { UnreadBadge } from '@/shared/ui/common/UnreadBadge'
import {
  CHAT_SEGMENTS,
  CHAT_SEGMENT_LABEL,
  type ChatSegment,
} from '@/features/chat/types/chat'

interface ChatSegmentTabProps {
  activeSegment: ChatSegment
  onSegmentChange: (segment: ChatSegment) => void
  /** 세그먼트 라벨 옆 미읽음 합계 */
  unreadCountBySegment?: Partial<Record<ChatSegment, number>>
}

/** 근무표 ScheduleTabBar 의 밑줄 활성 패턴을 계승합니다 */
export function ChatSegmentTab({
  activeSegment,
  onSegmentChange,
  unreadCountBySegment,
}: ChatSegmentTabProps) {
  return (
    <div className="flex w-full border-b border-line-2 bg-white" role="tablist">
      {CHAT_SEGMENTS.map(segment => {
        const isActive = activeSegment === segment
        return (
          <button
            key={segment}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSegmentChange(segment)}
            className={cn(
              'flex h-[46px] flex-1 items-center justify-center gap-1.5 border-b-2 typography-body01-semibold',
              isActive
                ? 'border-line-3 text-text-100'
                : 'border-line-2 text-text-50'
            )}
          >
            {CHAT_SEGMENT_LABEL[segment]}
            <UnreadBadge
              count={unreadCountBySegment?.[segment] ?? 0}
              size="sm"
            />
          </button>
        )
      })}
    </div>
  )
}
