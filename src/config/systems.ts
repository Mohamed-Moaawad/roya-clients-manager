/**
 * سجل الأنظمة (Systems Registry)
 * ---------------------------------
 * كل نظام من أنظمة RO'YA (PS Manager, PS Cafe Manager, Mobile Manager...) بيبعت بيانات
 * مختلفة شوية لـ Firestore حسب كود الـ license بتاعه. عشان نضيف نظام جديد مستقبلاً،
 * كل اللي محتاجه هو إضافة عنصر جديد في المصفوفة `systems` تحت من غير ما تلمس أي كود تاني
 * في الصفحة - الجدول والـ popup بيتبنوا تلقائي من الـ `fields` بتاعة كل نظام.
 *
 * id: اسم الـ document جوه collection "systems" في Firestore
 *     (ده نفس FIRESTORE_SYSTEM_ID المكتوب في كود الـ license بتاع كل نظام)
 */

export type FieldType = 'text' | 'phone' | 'number' | 'id' | 'date'

export interface SystemFieldDef {
  /** اسم الحقل زي ما هو مخزن في Firestore */
  key: string
  /** الاسم اللي هيظهر في الواجهة */
  label: string
  type?: FieldType
  /** هل الحقل ده يظهر كعمود في جدول القائمة (افتراضيًا true) */
  showInTable?: boolean
}

export interface SystemDef {
  id: string
  name: string
  shortName: string
  description: string
}

export const systems: SystemDef[] = [
  {
    id: 'roya-PS-Manager',
    name: "RO'YA PS Manager",
    shortName: 'PS Manager',
    description: 'نظام إدارة محلات البلايستيشن - النسخة الأساسية',
  },
  {
    id: 'roya-PS-Cafe-Manager',
    name: "RO'YA PS Cafe Manager",
    shortName: 'PS Cafe Manager',
    description: 'نظام إدارة كافيهات ومحلات البلايستيشن - مع الترابيزات',
  },
  {
    id: 'roya-Mobile',
    name: "RO'YA Mobile Manager",
    shortName: 'Mobile Manager',
    description: 'نظام إدارة محلات الموبايلات وصيانتها',
  },
]

/**
 * الحقول الأساسية المشتركة بين كل الأنظمة (بترجع لكل نظام تلقائي حتى لو مش متكررة تحت)
 */
const baseFields: SystemFieldDef[] = [
  { key: 'clientName', label: 'اسم العميل', type: 'text' },
  { key: 'phoneNumber', label: 'رقم الهاتف', type: 'phone' },
]

const trailingFields: SystemFieldDef[] = [
  { key: 'machineId', label: 'رقم الجهاز (Machine ID)', type: 'id' },
  { key: 'createdAt', label: 'تاريخ الطلب', type: 'date' },
]

/**
 * الحقول الخاصة بكل نظام - دي اللي بتختلف من نظام لنظام.
 * عايز تضيف نظام جديد بحقول مختلفة؟ أضف مفتاح جديد هنا بنفس الـ id بتاع النظام.
 */
const systemSpecificFields: Record<string, SystemFieldDef[]> = {
  'roya-PS-Manager': [{ key: 'devicesCount', label: 'عدد الأجهزة', type: 'number' }],
  'roya-PS-Cafe-Manager': [
    { key: 'devicesCount', label: 'عدد الأجهزة', type: 'number' },
    { key: 'tablesCount', label: 'عدد الترابيزات', type: 'number' },
  ],
  'roya-Mobile': [],
}

export function getSystemFields(systemId: string): SystemFieldDef[] {
  return [...baseFields, ...(systemSpecificFields[systemId] ?? []), ...trailingFields]
}

export function getSystemById(systemId: string): SystemDef | undefined {
  return systems.find((s) => s.id === systemId)
}
