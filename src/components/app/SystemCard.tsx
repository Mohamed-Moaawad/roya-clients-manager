import { Link } from 'react-router-dom'
import { Gamepad2, Smartphone, Coffee, LayoutGrid, ArrowLeft, Users } from 'lucide-react'
import { collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/firebase/config'
import { Card } from '@/components/ui/card'
import type { SystemDef } from '@/config/systems'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'roya-PS-Manager': Gamepad2,
  'roya-PS-Cafe-Manager': Coffee,
  'roya-Mobile': Smartphone,
}

export function SystemCard({ system }: { system: SystemDef }) {
  const [snapshot, loading] = useCollection(collection(db, 'systems', system.id, 'activationRequests'))
  const Icon = ICONS[system.id] ?? LayoutGrid

  return (
    <Link to={`/system/${system.id}`}>
      <Card className="group flex h-full flex-col gap-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-6" />
          </div>
          <ArrowLeft className="size-4 rotate-180 text-muted-foreground transition-transform group-hover:-translate-x-1" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{system.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{system.description}</p>
        </div>

        <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-sm text-muted-foreground">
          <Users className="size-4" />
          {loading ? 'جاري التحميل...' : `${snapshot?.size ?? 0} عميل مسجل`}
        </div>
      </Card>
    </Link>
  )
}
