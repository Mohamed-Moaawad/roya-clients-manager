import { User } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getSystemFields, getSystemById, type SystemFieldDef } from '@/config/systems'
import { formatFieldValue } from '@/lib/format'
import { CopyButton } from '@/components/app/CopyButton'
import type { ActivationRequest } from '@/types/request'

interface RequestDetailsDialogProps {
  systemId: string
  request: ActivationRequest | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function FieldRow({ field, request }: { field: SystemFieldDef; request: ActivationRequest }) {
  const rawValue = request[field.key]
  const display = formatFieldValue(rawValue, field.type)
  const copyable = field.type === 'id' || field.type === 'phone'

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/70 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{field.label}</span>
      <div className="flex items-center gap-1.5">
        <span
          className={
            field.type === 'id'
              ? 'max-w-[220px] truncate font-mono text-xs text-foreground'
              : 'text-sm font-semibold text-foreground'
          }
          dir="ltr"
        >
          {display}
        </span>
        {copyable && display !== '—' && <CopyButton value={display} />}
      </div>
    </div>
  )
}

export function RequestDetailsDialog({ systemId, request, open, onOpenChange }: RequestDetailsDialogProps) {
  const system = getSystemById(systemId)
  const fields = getSystemFields(systemId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {request && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-5" />
                </div>
                <div>
                  <DialogTitle>{(request.clientName as string) || 'بدون اسم'}</DialogTitle>
                  <DialogDescription>{system?.name}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-muted/30 px-4">
              {fields.map((field) => (
                <FieldRow key={field.key} field={field} request={request} />
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
