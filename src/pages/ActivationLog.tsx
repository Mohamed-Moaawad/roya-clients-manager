import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, History, Inbox, Search } from 'lucide-react'
import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/firebase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ActivationCodeDialog } from '@/components/app/ActivationCodeDialog'
import { formatTimestamp } from '@/lib/format'
import type { ActivationCodeRecord } from '@/types/activationCode'

export function ActivationLog() {
    const [search, setSearch] = React.useState('')
    const [selected, setSelected] = React.useState<ActivationCodeRecord | null>(null)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const [snapshot, loading, error] = useCollection(
        query(collection(db, 'activationCodes'), orderBy('createdAt', 'desc')),
    )

    const records: ActivationCodeRecord[] = React.useMemo(
        () => snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ActivationCodeRecord) ?? [],
        [snapshot],
    )

    const filtered = React.useMemo(() => {
        const term = search.trim().toLowerCase()
        if (!term) return records
        return records.filter((r) => {
            return (
                r.code.toLowerCase().includes(term) ||
                r.machineId.toLowerCase().includes(term) ||
                r.systemName.toLowerCase().includes(term)
            )
        })
    }, [records, search])

    const handleRowClick = (record: ActivationCodeRecord) => {
        setSelected(record)
        setDialogOpen(true)
    }

    return (
        <div dir="rtl" className="min-h-dvh bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <History className="size-5" />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-foreground">سجل أكواد التفعيل</h1>
                        <p className="text-sm text-muted-foreground">كل الأكواد اللي اتولدت من كل الأنظمة</p>
                    </div>

                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/activation">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                {error ? (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
                        <p className="font-medium text-destructive">حصل خطأ في جلب السجل</p>
                        <p className="max-w-md text-sm text-muted-foreground" dir="ltr">
                            {error.message}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            تأكد إن Firestore Rules بتسمح بالقراءة من activationCodes لليوزرز المسجلين دخول.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative w-full max-w-sm">
                                <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ابحث بالكود أو رقم الجهاز أو النظام..."
                                    className="ps-9"
                                />
                            </div>
                            <span className="ms-auto whitespace-nowrap text-sm text-muted-foreground">
                                {filtered.length} من {records.length} كود
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
                                        {records.length === 0 ? 'لسه مفيش أكواد تفعيل اتولدت' : 'مفيش نتائج مطابقة للبحث'}
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                                            <TableHead>النظام</TableHead>
                                            <TableHead>كود التفعيل</TableHead>
                                            <TableHead>Machine ID</TableHead>
                                            <TableHead>المدة</TableHead>
                                            <TableHead>تاريخ الإنشاء</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filtered.map((record) => (
                                            <TableRow key={record.id} className="cursor-pointer" onClick={() => handleRowClick(record)}>
                                                <TableCell className="font-medium text-foreground">{record.systemName}</TableCell>
                                                <TableCell>
                                                    <span className="font-mono text-xs" dir="ltr">
                                                        {record.code}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    <span className="font-mono text-xs" dir="ltr">
                                                        {record.machineId.slice(0, 14)}
                                                        {record.machineId.length > 14 ? '…' : ''}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{record.durationLabel}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {record.createdAt ? formatTimestamp(record.createdAt) : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </>
                )}
            </main>

            <ActivationCodeDialog record={selected} open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    )
}
