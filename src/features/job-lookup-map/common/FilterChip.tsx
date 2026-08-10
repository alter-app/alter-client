type FilterChipProps = {
  selected: boolean
  label: string
  onClick: () => void
}

export function FilterChip({ selected, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[34px] items-center rounded-full px-4 transition-colors ${
        selected
          ? 'bg-main typography-body03-semibold text-text-100'
          : 'bg-bg-dark typography-body03-regular text-text-90'
      }`}
    >
      {label}
    </button>
  )
}
