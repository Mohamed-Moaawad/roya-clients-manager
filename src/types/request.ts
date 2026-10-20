import type { Timestamp } from 'firebase/firestore'

/**
 * طلب تفعيل واحد زي ما بييجي من Firestore (collection activationRequests).
 * الحقول مختلفة شوية حسب النظام (شوف src/config/systems.ts) فالـ type هنا مرن
 * (index signature) عشان يستوعب أي حقل إضافي في أي نظام جديد.
 */
export interface ActivationRequest {
  id: string
  clientName?: string
  phoneNumber?: string
  machineId?: string
  devicesCount?: number
  tablesCount?: number
  createdAt?: Timestamp | null
  [key: string]: unknown
}
