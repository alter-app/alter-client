import SearchIcon from '@/assets/icons/search.svg'

interface SocialSearchProps {
  onClick?: () => void
}

export function SocialSearch({ onClick }: SocialSearchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-12 w-full rounded-full bg-[#e7e7e7] px-5 typography-body01-regular text-text-50 flex items-center"
    >
      <img src={SearchIcon} alt="search" />
    </button>
  )
}
