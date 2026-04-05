import PlusIcon from '@/assets/icons/Plus.svg'
export function FloatingActionButton() {
  return (
    <button
      type="button"
      className="h-14 w-14 shrink-0 rounded-full bg-main text-4xl text-white leading-none cursor-pointer inline-flex items-center justify-center aspect-square"
      aria-label="추가"
    >
      <img src={PlusIcon} alt="plus" />
    </button>
  )
}
