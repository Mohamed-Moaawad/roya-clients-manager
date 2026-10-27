import type { Timestamp } from 'firebase/firestore'

/**
 * سجل كود تفعيل واحد اتولد من صفحة "أكواد التفعيل" ومحفوظ في Firestore
 * (collection: activationCodes) عشان تقدر ترجعله وتشوفه تاني بعدين.
 */
export interface ActivationCodeRecord {
    id: string
    systemId: string
    systemName: string
    code: string
    machineId: string
    deviceLimit?: number
    tableLimit?: number
    durationLabel: string
    /** null = مدى الحياة */
    expiresAt: Timestamp | null
    createdAt?: Timestamp | null
}
