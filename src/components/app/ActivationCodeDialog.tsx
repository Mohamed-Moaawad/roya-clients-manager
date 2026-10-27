import * as React from 'react'
import { KeyRound, Trash2 } from 'lucide-react'
import { deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/firebase/config'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/app/CopyButton'
import { formatTimestamp } from '@/lib/format'
import type { ActivationCodeRecord } from '@/types/activationCode'

interface ActivationCodeDialogProps {
    record: ActivationCodeRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

function Row({ label, value, mono, copyable }: { label: string; value: string; mono?: boolean; copyable?: boolean }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 py-3 last:border-0">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex items-center gap-1.5">
                <span
                    className={mono ? 'max-w-[220px] truncate font-mono text-xs text-foreground' : 'text-sm font-semibold text-foreground'}
                    dir="ltr"
                >
                    {value}
                </span>
                {copyable && <CopyButton value={value} />}
            </div>
        </div>
    )
}

export function ActivationCodeDialog({ record, open, onOpenChange }: ActivationCodeDialogProps) {
    const [deleting, setDeleting] = React.useState(false)
    const [confirmDelete, setConfirmDelete] = React.useState(false)

    const handleOpenChange = (next: boolean) => {
        if (!next) setConfirmDelete(false)
        onOpenChange(next)
    }

    if (!record) return null

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }

        setDeleting(true)
        try {
            await deleteDoc(doc(db, 'activationCodes', record.id))
            handleOpenChange(false)
        } catch (err) {
            console.error('تعذر حذف الكود:', err)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md lg:max-w-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <KeyRound className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="font-mono text-base" dir="ltr">
                                {record.systemName}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="rounded-lg border border-border bg-muted/30 px-4">
                    <Row label="كود التفعيل" value={record.code} mono copyable />
                    <Row label="Machine ID" value={record.machineId} mono copyable />
                    <Row label="System Name" value={record.systemName} />
                    {record.deviceLimit !== undefined && <Row label="عدد الأجهزة" value={String(record.deviceLimit)} />}
                    {record.tableLimit !== undefined && <Row label="عدد الترابيزات" value={String(record.tableLimit)} />}
                    <Row label="مدة التفعيل" value={record.durationLabel} />
                    <Row label="تاريخ الانتهاء" value={record.expiresAt ? formatTimestamp(record.expiresAt) : 'مدى الحياة'} />
                    <Row label="تاريخ الإنشاء" value={record.createdAt ? formatTimestamp(record.createdAt) : '—'} />
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="destructive"
                        className="gap-2"
                        disabled={deleting}
                        onClick={handleDelete}
                    >
                        <Trash2 className="size-4" />
                        {deleting ? 'جاري الحذف...' : confirmDelete ? 'متأكد؟ دوس تاني للحذف' : 'حذف الكود'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
