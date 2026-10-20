import { Users, CalendarDays, CalendarClock } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { timestampToMillis } from '@/lib/format'
import type { ActivationRequest } from '@/types/request'

function startOf(daysAgo: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  return d.getTime()
}

export function StatCards({ requests }: { requests: ActivationRequest[] }) {
  const todayStart = startOf(0)
  const weekStart = startOf(6)

  const today = requests.filter((r) => timestampToMillis(r.createdAt) >= todayStart).length
  const week = requests.filter((r) => timestampToMillis(r.createdAt) >= weekStart).length

  const stats = [
    { label: 'إجمالي العملاء', value: requests.length, icon: Users },
    { label: 'طلبات اليوم', value: today, icon: CalendarDays },
    { label: 'آخر 7 أيام', value: week, icon: CalendarClock },
  ]

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <stat.icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
