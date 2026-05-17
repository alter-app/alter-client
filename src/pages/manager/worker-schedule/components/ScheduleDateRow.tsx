import {
  buildDateFromParts,
  dateToPartStrings,
} from '@/pages/manager/worker-schedule/lib/scheduleDateParts'

interface DatePartInputProps {
  value: string
  unit: string
  maxDigits: number
  max: number
  inputWidthClass: string
  onChange: (value: string) => void
}

function DatePartInput({
  value,
  unit,
  maxDigits,
  max,
  inputWidthClass,
  onChange,
}: DatePartInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, '')

    if (!inputValue) {
      onChange('')
      return
    }

    if (inputValue.length > maxDigits) {
      inputValue = inputValue.slice(-maxDigits)
    }

    const num = Math.min(Number.parseInt(inputValue, 10), max)
    const next =
      unit === '년' ? String(num) : num.toString().padStart(maxDigits, '0')
    onChange(next)
  }

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        placeholder={unit === '년' ? '0000' : '00'}
        onChange={handleChange}
        className={`${inputWidthClass} bg-transparent text-center typography-body01-semibold text-text-100 placeholder:text-text-50 outline-none`}
        aria-label={unit}
      />
      <span className="typography-body01-semibold text-text-100">{unit}</span>
    </>
  )
}

interface ScheduleDateRowProps {
  label: string
  date: Date
  onDateChange: (date: Date) => void
}

export function ScheduleDateRow({
  label,
  date,
  onDateChange,
}: ScheduleDateRowProps) {
  const parts = dateToPartStrings(date)

  const updatePart = (patch: Partial<typeof parts>) => {
    const next = buildDateFromParts(
      patch.year ?? parts.year,
      patch.month ?? parts.month,
      patch.day ?? parts.day,
      date
    )
    onDateChange(next)
  }

  return (
    <div className="flex items-center justify-between px-1">
      <span className="typography-body02-semibold text-text-70">{label}</span>
      <div className="flex h-12 items-center gap-1.5 rounded-2xl bg-bg-light px-3">
        <DatePartInput
          value={parts.year}
          unit="년"
          maxDigits={4}
          max={9999}
          inputWidthClass="w-11"
          onChange={year => updatePart({ year })}
        />
        <DatePartInput
          value={parts.month}
          unit="월"
          maxDigits={2}
          max={12}
          inputWidthClass="w-8"
          onChange={month => updatePart({ month })}
        />
        <DatePartInput
          value={parts.day}
          unit="일"
          maxDigits={2}
          max={31}
          inputWidthClass="w-8"
          onChange={day => updatePart({ day })}
        />
      </div>
    </div>
  )
}
