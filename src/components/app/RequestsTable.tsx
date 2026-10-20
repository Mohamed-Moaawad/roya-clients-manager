import * as React from 'react'
import { Inbox, Search } from 'lucide-react'

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { getSystemFields } from '@/config/systems'
import { formatFieldValue } from '@/lib/format'
import type { ActivationRequest } from '@/types/request'

interface RequestsTableProps {
  systemId: string
  requests: ActivationRequest[]
  loading: boolean
  onRowClick: (request: ActivationRequest) => void
}

export function RequestsTable({ systemId, requests, loading, onRowClick }: RequestsTableProps) {
  const [search, setSearch] = React.useState('')
  const fields = getSystemFields(systemId)

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return requests
    return requests.filter((r) => {
      const name = String(r.clientName ?? '').toLowerCase()
      const phone = String(r.phoneNumber ?? '').toLowerCase()
      const machine = String(r.machineId ?? '').toLowerCase()
      return name.includes(term) || phone.includes(term) || machine.includes(term)
    })
  }, [requests, search])

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم أو الهاتف أو رقم الجهاز..."
            className="ps-9"
          />
        </div>
        <span className="ms-auto whitespace-nowrap text-sm text-muted-foreground">
          {filtered.length} من {requests.length} عميل
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-center text-muted-foreground">
            <Inbox className="size-10 opacity-40" />
            <p className="text-sm">
              {requests.length === 0 ? 'لا يوجد عملاء مسجلين في هذا النظام لسه' : 'مفيش نتائج مطابقة للبحث'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {fields.map((field) => (
                  <TableHead key={field.key}>{field.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((request) => (
                <TableRow
                  key={request.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick(request)}
                >
                  {fields.map((field, idx) => (
                    <TableCell
                      key={field.key}
                      className={idx === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}
                    >
                      {field.type === 'id' ? (
                        <span className="font-mono text-xs" dir="ltr">
                          {String(request[field.key] ?? '—').slice(0, 14)}
                          {String(request[field.key] ?? '').length > 14 ? '…' : ''}
                        </span>
                      ) : (
                        <span dir={field.type === 'phone' ? 'ltr' : undefined}>
                          {formatFieldValue(request[field.key], field.type)}
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
