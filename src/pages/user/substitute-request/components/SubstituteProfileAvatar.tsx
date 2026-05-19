interface SubstituteProfileAvatarProps {
  imageUrl?: string | null
  alt?: string
  size?: number
}

export function SubstituteProfileAvatar({
  imageUrl,
  alt = '',
  size = 38,
}: SubstituteProfileAvatarProps) {
  const dimension = `${size}px`

  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border border-line-1 bg-bg-light"
      style={{ width: dimension, height: dimension }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full bg-[repeating-conic-gradient(#ececec_0%_25%,transparent_0%_50%)] [background-size:8px_8px]"
          aria-hidden
        />
      )}
    </div>
  )
}
