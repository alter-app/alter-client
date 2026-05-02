interface ReadOnlyFieldProps {
  label: string
  value: string
}

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="pl-3 text-text-100 typography-body01-regular">{label}</p>
      <div className="flex h-[46px] w-full items-center rounded-2xl bg-bg-dark px-4">
        <span className="text-text-50 typography-body03-regular">{value}</span>
      </div>
    </div>
  )
}
