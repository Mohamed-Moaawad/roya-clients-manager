/**
 * أنظمة توليد أكواد التفعيل (Activation Codes)
 * ---------------------------------------------
 * كل نظام هنا بيقابل سكريبت keygen.js بتاعه (dev-tools/keygen.js في كل مشروع) - نفس
 * SECRET_KEY ونفس شكل الكود بالظبط، بس بيتولد من المتصفح هنا بدل ما تشغل سكريبت Node.
 *
 * عايز تضيف نظام جديد (متاجر / صيدليات...)؟ أضف عنصر جديد في `activationSystems` تحت،
 * وخلي `id` بتاعه يطابق الـ switch في src/lib/activation/generateActivationCode.ts
 * (أو وسّع الـ switch لو شكل الكود مختلف).
 */

export type DurationOption = {
    label: string
    ms: number | null | 'CUSTOM'
}

export type ActivationSystem = {
    id: string
    name: string
    description: string
    secretKey: string
    prefix: string
    hasDeviceLimit: boolean
    hasTableLimit: boolean
    allowCustomDays: boolean
    durations: DurationOption[]
}


const standardDurations: DurationOption[] = [
    { label: '1 دقيقة', ms: 60_000 },
    { label: '3 دقائق', ms: 3 * 60_000 },
    { label: '30 دقيقة', ms: 30 * 60_000 },
    { label: 'ساعة واحدة', ms: 60 * 60_000 },
    { label: 'ساعتان', ms: 2 * 60 * 60_000 },
    { label: 'يوم واحد', ms: 24 * 60 * 60_000 },
    { label: 'يومان', ms: 2 * 24 * 60 * 60_000 },
    { label: '3 أيام', ms: 3 * 24 * 60 * 60_000 },
    { label: '4 أيام', ms: 4 * 24 * 60 * 60_000 },
    { label: '5 أيام', ms: 5 * 24 * 60 * 60_000 },
    { label: 'أسبوع', ms: 7 * 24 * 60 * 60_000 },
    { label: 'أسبوعان', ms: 14 * 24 * 60 * 60_000 },
    { label: 'شهر', ms: 30 * 24 * 60 * 60_000 },
    { label: 'شهرين', ms: 60 * 24 * 60 * 60_000 },
    { label: '3 شهور', ms: 90 * 24 * 60 * 60_000 },
    { label: '4 شهور', ms: 120 * 24 * 60 * 60_000 },
    { label: '6 شهور', ms: 182 * 24 * 60 * 60_000 },
    { label: 'سنة', ms: 365 * 24 * 60 * 60_000 },
    { label: 'سنتان', ms: 2 * 365 * 24 * 60 * 60_000 },
    { label: 'مدى الحياة', ms: null },
    { label: 'مدة مخصصة بالأيام', ms: 'CUSTOM' },
]

export const activationSystems: ActivationSystem[] = [
    {
        id: 'ps-manager',
        name: "RO'YA PS Manager",
        description: 'تفعيل نظام إدارة البلايستيشن',
        secretKey: 'rPS-7f3a9k2m8x1qL0zW6bV4nY5cH2eR9tU3iO8pA1sD6fG-2026',
        prefix: "R'PS",
        hasDeviceLimit: true,
        hasTableLimit: false,
        allowCustomDays: false,
        durations: standardDurations,
    },
    {
        id: 'ps-cafe-manager',
        name: "RO'YA PS Cafe Manager",
        description: 'تفعيل نظام إدارة كافيه البلايستيشن',
        secretKey: 'rPSC-7f3a9k2m8x1qL0zW6bV4nY5cH2eR9tU3iO8pA1sD6fG-2026',
        prefix: "R'PSC",
        hasDeviceLimit: true,
        hasTableLimit: true,
        allowCustomDays: true,
        durations: standardDurations,
    },
    {
        id: 'mobile-manager',
        name: "RO'YA Mobile Manager",
        description: 'تفعيل نظام إدارة محلات الموبايلات',
        secretKey: 'rMOB-3d8e1k9p2qX7zW4bV6nY0cH8eR1tU5iO3pA9sD2fG-2026',
        prefix: "R'MOB",
        hasDeviceLimit: false,
        hasTableLimit: false,
        allowCustomDays: true,
        durations: standardDurations,
    },
]

export function getActivationSystemById(id: string): ActivationSystem | undefined {
    return activationSystems.find((system) => system.id === id)
}
