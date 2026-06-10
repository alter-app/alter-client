import DefaultProfileImg from '@/assets/default-profile.svg'
import { cn } from '@/shared/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: number
  // 'person'(기본): 이미지 없으면 기본 프로필 이미지. 'neutral': 매장 썸네일 등 사람이 아닌 경우 중립 폴백.
  fallback?: 'person' | 'neutral'
  className?: string
}

export function Avatar({
  src,
  alt = '',
  size = 38,
  fallback = 'person',
  className,
}: AvatarProps) {
  const style = { width: `${size}px`, height: `${size}px` }

  if (fallback === 'neutral') {
    return src ? (
      <img
        src={src}
        alt={alt}
        style={style}
        className={cn('shrink-0 rounded-full object-cover', className)}
      />
    ) : (
      <div
        aria-hidden
        style={style}
        className={cn(
          'shrink-0 rounded-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]',
          className
        )}
      />
    )
  }

  return (
    <img
      src={src || DefaultProfileImg}
      alt={alt}
      style={style}
      onError={e => {
        e.currentTarget.src = DefaultProfileImg
      }}
      className={cn('shrink-0 rounded-full object-cover', className)}
    />
  )
}
