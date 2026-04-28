import SearchIcon from '@/assets/icons/search.svg'

interface SocialSearchProps {
  onClick?: () => void
}

export function SocialSearch({ onClick }: SocialSearchProps) {
  return (
    <div className="w-full p-4">
      <button
        type="button"
        onClick={onClick}
        className="px-[15px] py-[13px] h-12 w-full rounded-[16px] bg-line-1 flex items-center border border-line-2"
      >
        <img src={SearchIcon} alt="search" />
      </button>
    </div>
  )
}
