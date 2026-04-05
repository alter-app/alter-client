interface SocialCategoryProps {
  label: string
  active?: boolean
}

export function SocialCategory({ label, active = false }: SocialCategoryProps) {
  return (
    <button
      type="button"
      className={`h-[30px] rounded-full px-4 typography-body03-semibold transition-colors ${
        active
          ? 'bg-main text-text-100'
          : 'bg-[#e9e9e9] text-text-90 hover:bg-[#dfdfdf]'
      }`}
    >
      {label}
    </button>
  )
}
