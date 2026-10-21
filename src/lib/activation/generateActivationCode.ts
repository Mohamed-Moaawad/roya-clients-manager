
import type { ActivationSystem } from '@/config/activationSystems'

export type GenerateActivationInput = {
    machineId: string
    deviceLimit?: number
    tableLimit?: number
    /** null = مدى الحياة (Lifetime) */
    durationMs: number | null
}

export type ActivationResult = {
    code: string
    expiryToken: string
    durationLabel: string
    expiresAt: Date | null
    deviceLimit?: number
    tableLimit?: number
}

/**
 * نفس الـ HMAC-SHA256 بالظبط اللي بيعمله dev-tools/keygen.js بـ Node (`crypto.createHmac`)،
 * بس بـ Web Crypto API (`crypto.subtle`) عشان يشتغل في المتصفح من غير أي باكدج زيادة.
 */

async function computeSignature(secretKey: string, raw: string): Promise<string> {
    const encoder = new TextEncoder()

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secretKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    )

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(raw))

    return Array.from(new Uint8Array(signature))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 12)
        .toUpperCase()
}

export async function generateActivationCode(
    system: ActivationSystem,
    input: GenerateActivationInput,
): Promise<ActivationResult> {
    const machineId = input.machineId.trim()

    if (!machineId) {
        throw new Error('رقم الجهاز مطلوب')
    }

    if (system.hasDeviceLimit && (!Number.isInteger(input.deviceLimit) || (input.deviceLimit ?? 0) <= 0)) {
        throw new Error('عدد الأجهزة لازم يكون رقمًا صحيحًا أكبر من صفر')
    }

    if (system.hasTableLimit && (!Number.isInteger(input.tableLimit) || (input.tableLimit ?? 0) <= 0)) {
        throw new Error('عدد الترابيزات لازم يكون رقمًا صحيحًا أكبر من صفر')
    }

    const expiresAt = input.durationMs === null ? null : new Date(Date.now() + input.durationMs)

    const expiryToken =
        expiresAt === null ? 'LIFE' : Math.floor(expiresAt.getTime() / 1000).toString(36).toUpperCase()

    let raw: string
    let code: string

    if (system.id === 'ps-manager') {
        const deviceLimit = input.deviceLimit!
        raw = `${machineId}|${deviceLimit}|${expiryToken}`
        const signature = await computeSignature(system.secretKey, raw)
        code = `${system.prefix}-${deviceLimit}-${expiryToken}-${signature}`
    } else if (system.id === 'ps-cafe-manager') {
        const deviceLimit = input.deviceLimit!
        const tableLimit = input.tableLimit!
        raw = `${machineId}|${deviceLimit}|${tableLimit}|${expiryToken}`
        const signature = await computeSignature(system.secretKey, raw)
        code = `${system.prefix}-${deviceLimit}-${tableLimit}-${expiryToken}-${signature}`
    } else if (system.id === 'mobile-manager') {
        raw = `${machineId}|${expiryToken}`
        const signature = await computeSignature(system.secretKey, raw)
        code = `${system.prefix}-${expiryToken}-${signature}`
    } else {
        throw new Error('نظام التفعيل غير مدعوم')
    }

    const selectedDuration = system.durations.find((duration) => duration.ms === input.durationMs)

    const durationLabel = input.durationMs === null ? 'مدى الحياة' : (selectedDuration?.label ?? 'مدة مخصصة')

    return {
        code,
        expiryToken,
        durationLabel,
        expiresAt,
        ...(system.hasDeviceLimit ? { deviceLimit: input.deviceLimit } : {}),
        ...(system.hasTableLimit ? { tableLimit: input.tableLimit } : {}),
    }
}