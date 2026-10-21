import { KeyRound, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'

import { auth } from '@/firebase/config'
import { systems } from '@/config/systems'
import { SystemCard } from '@/components/app/SystemCard'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div dir="rtl" className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
            R
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">RO'YA Clients Manager</h1>
            <p className="text-sm text-muted-foreground">اختار نظام عشان تشوف العملاء المسجلين فيه</p>
          </div>
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link to="/activation">
              <KeyRound className="size-4" />
              أكواد التفعيل
            </Link>
          </Button>
          <Button variant="destructive" size="sm" className="gap-2" onClick={() => signOut(auth)}>
            <LogOut className="size-4" />
            خروج
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {systems.map((system) => (
            <SystemCard key={system.id} system={system} />
          ))}
        </div>
      </main>
    </div>
  )
}
