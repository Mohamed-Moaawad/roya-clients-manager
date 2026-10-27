import type { Timestamp } from 'firebase/firestore'

export function formatTimestamp(value: unknown): string {
  if (!value) return '—'
  const ts = value as Timestamp
  if (typeof ts.toDate !== 'function') return String(value)
  const date = ts.toDate()
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  return `${formattedDate} _ ${formattedTime}`
}

export function timestampToMillis(value: unknown): number {
  const ts = value as Timestamp | undefined
  if (ts && typeof ts.toMillis === 'function') return ts.toMillis()
  return 0
}

export function formatFieldValue(value: unknown, type?: string): string {
  if (value === undefined || value === null || value === '') return '—'
  if (type === 'date') return formatTimestamp(value)
  if (type === 'number') return new Intl.NumberFormat('en-us').format(Number(value))
  return String(value)
}
