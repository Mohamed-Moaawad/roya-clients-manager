import * as React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/firebase/config'
import { getSystemById } from '@/config/systems'
import { RequestsTable } from '@/components/app/RequestsTable'
import { RequestDetailsDialog } from '@/components/app/RequestDetailsDialog'
import { StatCards } from '@/components/app/StatCards'
import { Button } from '@/components/ui/button'
import type { ActivationRequest } from '@/types/request'

export function SystemPage() {
  const { systemId = '' } = useParams<{ systemId: string }>()
  const system = getSystemById(systemId)

  const [selectedRequest, setSelectedRequest] = React.useState<ActivationRequest | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const col = collection(db, 'systems', systemId, 'activationRequests')
  const [snapshot, loading, error] = useCollection(query(col, orderBy('createdAt', 'desc')))

  const requests: ActivationRequest[] =
    snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ActivationRequest) ?? []

  const handleRowClick = (request: ActivationRequest) => {
    setSelectedRequest(request)
    setDialogOpen(true)
  }

  return (
    <div dir="rtl" className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowRight className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground sm:text-xl">
              {system?.name ?? 'نظام غير معروف'}
            </h1>
            <p className="text-sm text-muted-foreground">{system?.description}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {error ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
            <p className="font-medium text-destructive">حصل خطأ في جلب البيانات</p>
            <p className="max-w-md text-sm text-muted-foreground" dir="ltr">
              {error.message}
            </p>
            <p className="text-sm text-muted-foreground">
              تأكد إنك مسجل دخول وإن Firestore Rules بتسمح بالقراءة لليوزرز اللي عاملين تسجيل دخول.
            </p>
          </div>
        ) : (
          <>
            <StatCards requests={requests} />
            <RequestsTable
              systemId={systemId}
              requests={requests}
              loading={loading}
              onRowClick={handleRowClick}
            />
          </>
        )}
      </main>

      <RequestDetailsDialog
        systemId={systemId}
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
