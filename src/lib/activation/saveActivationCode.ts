import { addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore'

import { db } from '@/firebase/config'
import type { ActivationSystem } from '@/config/activationSystems'
import type { ActivationResult } from '@/lib/activation/generateActivationCode'

/**
 * بيحفظ كود التفعيل اللي اتولد دلوقتي في Firestore (collection: activationCodes)
 * عشان يظهر بعدين في صفحة سجل الأكواد (/activation/log).
 *
 * best-effort: لو الحفظ فشل (مشكلة شبكة/صلاحيات) بيرمي error عادي، بس ده منفصل عن
 * توليد الكود نفسه - الكود بيتولد وبيتعرض للمستخدم أول ما يتحسب محليًا، بغض النظر
 * عن نجاح الحفظ في السجل.
 */
export async function saveActivationCode(system: ActivationSystem, machineId: string, result: ActivationResult) {
    await addDoc(collection(db, 'activationCodes'), {
        systemId: system.id,
        systemName: system.name,
        code: result.code,
        machineId: machineId.trim(),
        durationLabel: result.durationLabel,
        expiresAt: result.expiresAt ? Timestamp.fromDate(result.expiresAt) : null,
        createdAt: serverTimestamp(),
        ...(result.deviceLimit !== undefined ? { deviceLimit: result.deviceLimit } : {}),
        ...(result.tableLimit !== undefined ? { tableLimit: result.tableLimit } : {}),
    })
}
