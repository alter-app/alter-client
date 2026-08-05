export function formatApplicantBirthDate(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 8) return value

  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6, 8)}`
}

export function formatCertificateAcquiredMonth(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 6) return value

  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}`
}

export function formatApplicantPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return value
}
