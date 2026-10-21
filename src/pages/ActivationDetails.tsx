import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, Copy, KeyRound, LoaderCircle } from 'lucide-react'

import { getActivationSystemById } from '@/config/activationSystems'
import { generateActivationCode, type ActivationResult } from '@/lib/activation/generateActivationCode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const selectClassName =
    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50'


const ActivationDetails = () => {

    const { systemId } = useParams<{ systemId: string }>()
    const system = getActivationSystemById(systemId ?? '')

    const [machineId, setMachineId] = useState('')
    const [deviceLimit, setDeviceLimit] = useState('3')
    const [tableLimit, setTableLimit] = useState('10')
    const [durationIndex, setDurationIndex] = useState('0')
    const [customDays, setCustomDays] = useState('30')
    const [result, setResult] = useState<ActivationResult | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    if (!system) {
        return (
            <div dir="rtl" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-8 text-center">
                <h1 className="text-xl font-bold text-foreground">النظام غير موجود</h1>
                <Button variant="outline" asChild>
                    <Link to="/activation">الرجوع إلى أنظمة التفعيل</Link>
                </Button>
            </div>
        )
    }

    const selectedDuration = system.durations[Number(durationIndex)]
    const isCustom = selectedDuration?.ms === 'CUSTOM'

    async function handleGenerate() {
        setError('')
        setResult(null)
        setCopied(false)

        if (!machineId.trim()) {
            setError('من فضلك أدخل رقم الجهاز')
            return
        }

        if (isCustom && (!Number.isFinite(Number(customDays)) || Number(customDays) <= 0)) {
            setError('أدخل عدد أيام صحيحًا أكبر من صفر')
            return
        }

        const durationMs = isCustom ? Number(customDays) * 24 * 60 * 60 * 1000 : selectedDuration?.ms

        if (durationMs === undefined || durationMs === 'CUSTOM') {
            setError('اختار مدة التفعيل')
            return
        }

        setLoading(true)

        try {
            const generated = await generateActivationCode(system!, {
                machineId,
                durationMs,
                ...(system!.hasDeviceLimit ? { deviceLimit: Number(deviceLimit) } : {}),
                ...(system!.hasTableLimit ? { tableLimit: Number(tableLimit) } : {}),
            })

            setResult({
                ...generated,
                durationLabel: isCustom ? `${customDays} يوم` : generated.durationLabel,
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حصل خطأ أثناء توليد الكود')
        } finally {
            setLoading(false)
        }
    }

    async function handleCopy() {
        if (!result) return

        try {
            await navigator.clipboard.writeText(result.code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            setError('تعذر النسخ تلقائيًا. حدد الكود وانسخه يدويًا.')
        }
    }


    return (
        <div dir="rtl" className="min-h-dvh bg-background">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-6">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <KeyRound className="size-5" />
                    </div>

                    <div className="flex-1">
                        <h1 className="font-bold text-foreground">{system.name}</h1>
                        <p className="text-sm text-muted-foreground">توليد كود تفعيل جديد</p>
                    </div>

                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/activation">
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">إعدادات التفعيل</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        أدخل بيانات الجهاز وحدد المدة والإعدادات المطلوبة.
                    </p>
                </div>

                <Card className="space-y-5 p-5 sm:p-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="machineId">
                            Machine ID <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="machineId"
                            value={machineId}
                            onChange={(e) => setMachineId(e.target.value)}
                            placeholder="أدخل رقم الجهاز الخاص بالعميل"
                            dir="ltr"
                            autoComplete="off"
                        />
                    </div>

                    {system.hasDeviceLimit && (
                        <div className="space-y-1.5">
                            <Label htmlFor="deviceLimit">عدد الأجهزة المسموح بها</Label>
                            <Input
                                id="deviceLimit"
                                type="number"
                                min="1"
                                step="1"
                                value={deviceLimit}
                                onChange={(e) => setDeviceLimit(e.target.value)}
                            />
                        </div>
                    )}

                    {system.hasTableLimit && (
                        <div className="space-y-1.5">
                            <Label htmlFor="tableLimit">عدد الترابيزات المسموح بها</Label>
                            <Input
                                id="tableLimit"
                                type="number"
                                min="1"
                                step="1"
                                value={tableLimit}
                                onChange={(e) => setTableLimit(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <Label htmlFor="duration">مدة التفعيل</Label>
                        <select
                            id="duration"
                            value={durationIndex}
                            onChange={(e) => setDurationIndex(e.target.value)}
                            className={selectClassName}
                        >
                            {system.durations.map((duration, index) => (
                                <option key={`${duration.label}-${index}`} value={index}>
                                    {duration.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isCustom && (
                        <div className="space-y-1.5">
                            <Label htmlFor="customDays">عدد الأيام</Label>
                            <Input
                                id="customDays"
                                type="number"
                                min="0.01"
                                step="any"
                                value={customDays}
                                onChange={(e) => setCustomDays(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">تقدر تدخل عدد أيام صحيح أو كسري، مثل 10 أو 30.5.</p>
                        </div>
                    )}

                    {error && (
                        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    <Button type="button" className="w-full gap-2" disabled={loading} onClick={handleGenerate}>
                        {loading ? <LoaderCircle className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
                        {loading ? 'جاري توليد الكود...' : 'توليد كود التفعيل'}
                    </Button>
                </Card>

                {result && (
                    <Card className="space-y-5 border-primary/30 p-5 sm:p-6">
                        <div className="flex items-center gap-2">
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Check className="size-5" />
                            </div>
                            <div>
                                <h2 className="font-bold text-foreground">تم توليد كود التفعيل</h2>
                                <p className="text-sm text-muted-foreground">راجع البيانات قبل إرسال الكود للعميل.</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="generatedCode">Activation Code</Label>
                            <textarea
                                id="generatedCode"
                                readOnly
                                value={result.code}
                                dir="ltr"
                                rows={2}
                                className="w-full resize-none rounded-lg border border-input bg-muted p-3 text-start font-mono text-sm font-semibold text-foreground outline-none"
                            />
                            <Button type="button" className="w-full gap-2" onClick={handleCopy}>
                                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                                {copied ? 'تم نسخ الكود' : 'نسخ كود التفعيل'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-muted/60 p-3">
                                <p className="text-sm text-muted-foreground">النظام</p>
                                <p className="mt-1 font-medium text-foreground">{system.name}</p>
                            </div>
                            <div className="rounded-xl bg-muted/60 p-3">
                                <p className="text-sm text-muted-foreground">مدة التفعيل</p>
                                <p className="mt-1 font-medium text-foreground">{result.durationLabel}</p>
                            </div>

                            {result.deviceLimit !== undefined && (
                                <div className="rounded-xl bg-muted/60 p-3">
                                    <p className="text-sm text-muted-foreground">عدد الأجهزة</p>
                                    <p className="mt-1 font-medium text-foreground">{result.deviceLimit}</p>
                                </div>
                            )}

                            {result.tableLimit !== undefined && (
                                <div className="rounded-xl bg-muted/60 p-3">
                                    <p className="text-sm text-muted-foreground">عدد الترابيزات</p>
                                    <p className="mt-1 font-medium text-foreground">{result.tableLimit}</p>
                                </div>
                            )}

                            <div className="rounded-xl bg-muted/60 p-3 sm:col-span-2">
                                <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                                <p className="mt-1 font-medium text-foreground">
                                    {result.expiresAt ? result.expiresAt.toLocaleString('ar-EG') : 'مدى الحياة'}
                                </p>
                            </div>

                            <div className="rounded-xl bg-muted/60 p-3 sm:col-span-2">
                                <p className="text-sm text-muted-foreground">Machine ID</p>
                                <p dir="ltr" className="mt-1 break-all text-start font-mono text-sm text-foreground">
                                    {machineId.trim()}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default ActivationDetails;