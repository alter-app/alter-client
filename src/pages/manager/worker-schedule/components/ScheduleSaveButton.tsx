interface ScheduleSaveButtonProps {
  onClick?: () => void
  disabled?: boolean
}

export function ScheduleSaveButton({
  onClick,
  disabled,
}: ScheduleSaveButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-12 w-full rounded-2xl bg-[#07c079] typography-body01-semibold text-white disabled:opacity-50"
    >
      저장
    </button>
  )
}
