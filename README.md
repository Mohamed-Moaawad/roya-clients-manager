# RO'YA Clients Manager

صفحة واحدة بسيطة فيها كارت لكل نظام من أنظمة RO'YA (PS Manager, PS Cafe Manager, Mobile Manager، وأي نظام تضيفه بعد كده)، تدوس على أي كارت يوديك لصفحته وفيها جدول بكل العملاء اللي سجلوا من Firebase/Firestore، ولما تدوس على أي عميل تفتحلك البيانات كلها في popup مرتب.

مبنية بـ **Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui**، وبتستخدم `firebase` + `react-firebase-hooks` بنفس الطريقة اللي انت متعود عليها في مشاريعك التانية. جاهزة للرفع على **Vercel**.

- يسجل دخول بإيميل وباسورد (Firebase Authentication) - اللينك بتاعك إنت بس، محدش يقدر يدخل من غيره.
- صفحة رئيسية فاضية فيها كارت لكل نظام (وعدد العملاء المسجلين فيه realtime)، تحت بعض تلقائي على الموبايل.
- دوس على كارت يوديك لصفحة النظام ده، فيها جدول بكل بيانات العملاء (الاسم، الهاتف، رقم الجهاز، عدد الأجهزة/الترابيزات حسب النظام، تاريخ الطلب).
- بحث سريع بالاسم أو الهاتف أو رقم الجهاز.
- دوس على أي صف يفتح popup فيه كل البيانات مرتبة + زرار نسخ لرقم الهاتف ورقم الجهاز.
- كروت إحصائيات سريعة فوق الجدول (إجمالي العملاء، طلبات اليوم، آخر 7 أيام).
- تصميم بألوان براند RO'YA بتاعتك، وواجهة عربية RTL بالكامل، ومتجاوب على الموبايل.

---

## 1) هيكل المشروع

```
src/
  firebase/config.ts       إعداد اتصال Firebase (auth, db, storageDB) - بنفس شكل اللي انت متعود عليه
  config/systems.ts        ⭐ هنا بتضيف أي نظام جديد وحقوله (بدون أي كود تاني)
  pages/
    Login.tsx               صفحة تسجيل الدخول (signInWithEmailAndPassword مباشرة)
    Home.tsx                 الصفحة الرئيسية - كروت الأنظمة
    SystemPage.tsx           صفحة نظام واحد - الجدول + الإحصائيات
  components/
    app/                     SystemCard, RequestsTable, RequestDetailsDialog, StatCards, CopyButton
    ui/                      مكونات shadcn/ui (Button, Table, Dialog...)
firestore.rules             ملف مرجعي لقواعد الأمان - تنسخه في Firebase Console
.env.example                 مثال لمتغيرات البيئة
```

فيه `BrowserRouter` بسيط (`react-router-dom`) بس لصفحتين: `/` (الكروت) و `/system/:systemId` (جدول نظام معين) - مفيش dashboard ولا sidebar، الصفحة فاضية زي ما طلبت بالظبط.

### إزاي تضيف نظام جديد (مثلاً RO'YA Repair Manager)؟

افتح `src/config/systems.ts` فقط وأضف:

```ts
// 1. أضف النظام في مصفوفة systems
{
  id: 'roya-Repair-Manager', // لازم يكون نفس FIRESTORE_SYSTEM_ID اللي في كود الـ license
  name: "RO'YA Repair Manager",
  shortName: 'Repair Manager',
  description: 'نظام إدارة محلات الصيانة',
},

// 2. لو فيه حقول خاصة بيه مختلفة عن باقي الأنظمة، أضفها هنا
'roya-Repair-Manager': [
  { key: 'devicesCount', label: 'عدد الأجهزة', type: 'number' },
],
```

كده بس - هيظهر تلقائي كارت جديد في الصفحة الرئيسية وهيكون ليه صفحة وجدول و popup مظبوطين لوحدهم، من غير ما تلمس أي كود تاني. لو عايز أيقونة مخصصة للكارت بتاعه، ضيفها في `ICONS` جوه `src/components/app/SystemCard.tsx` (سطرين بس، اختياري).

---

## 2) طريقة الاتصال بـ Firebase (زي مشاريعك التانية بالظبط)

`src/firebase/config.ts` مكتوب بنفس الباترن اللي انت بتستخدمه:

```ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  // ...
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const storageDB = getStorage(app)
export const db = getFirestore(app)
```

وفي الصفحات بتاعة الجداول بنستخدم `react-firebase-hooks` زي ما انت متعود:

```ts
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/config'

const [snapshot, loading, error] = useCollection(
  query(collection(db, 'systems', systemId, 'activationRequests'), orderBy('createdAt', 'desc'))
)
```

(استخدمنا `useCollection` مش `useDocument` لأن `activationRequests` دي **collection** فيها كذا عميل، مش document واحد - `useDocument` بيستخدم لما تجيب document واحد بالـ id بتاعه).

وتسجيل الدخول في `Login.tsx` بنفس الطريقة اللي انت كاتبها:

```ts
await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => { ... })
  .catch((error) => { ... })
```

> الفرق الوحيد عن الطريقة اللي انت متعود عليها في مشاريع CRA: هنا المشروع شغال بـ **Vite**، فمتغيرات البيئة لازم تبدأ بـ `VITE_` مش `REACT_APP_` (وبتتقرا بـ `import.meta.env` مش `process.env`). غيرت أسماء المتغيرات لـ `VITE_API_KEY` بدل `VITE_FIREBASE_API_KEY` عشان تكون أقرب لـ `REACT_APP_API_KEY` اللي انت متعود عليها.

---

## 3) إعداد Firebase (مرة واحدة بس)

المشروع ده بيقرا من **نفس مشروع Firebase** اللي أنظمة RO'YA (PS Manager / PS Cafe Manager / Mobile) بتبعتله البيانات (`ro-ya-systems`)، بس بيضيف طبقة حماية: القراءة متاحة بس لو عامل تسجيل دخول.

### أ) هات بيانات الاتصال (Firebase Config)

1. ادخل على [Firebase Console](https://console.firebase.google.com) → اختار مشروع `ro-ya-systems`.
2. ⚙️ Project settings → تبويب **General** → انزل لـ **Your apps**.
3. لو مفيش Web App مضافة قبل كده: دوس على أيقونة `</>` وأضف واحدة باسم "RO'YA Clients Manager" (مش محتاج Firebase Hosting، بس دوس Register app).
4. هيظهرلك كود فيه object اسمه `firebaseConfig` فيه القيم دي: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`. انسخهم.

### ب) فعّل تسجيل الدخول بالإيميل

1. من القائمة الجانبية: **Build → Authentication → Get started**.
2. تبويب **Sign-in method** → فعّل **Email/Password**.
3. تبويب **Users** → **Add user** → حط الإيميل والباسورد اللي عاوز تدخل بيهم إنت (ده الحساب اللي هتسجل بيه دخول في الموقع). تقدر تضيف أكتر من حساب لو حابب فريقك يدخلوا برضو.

### ج) اضبط صلاحيات القراءة (Firestore Rules)

1. **Build → Firestore Database → Rules**.
2. استبدل المحتوى بمحتوى ملف `firestore.rules` الموجود في المشروع ده (أو خليه بجانبه وافتحه عشان تشوف القواعد وتضيفها يدوي).
3. دوس **Publish**.

القواعد دي بتخلي "الكتابة" (create) مفتوحة زي ما هي دلوقتي (عشان أنظمة PS Manager / PS Cafe Manager / Mobile تقدر تبعت طلبات التفعيل عادي من غير ما تحتاج تعدل فيهم)، وبتمنع "القراءة" إلا لمين عامل تسجيل دخول بس.

> ⚠️ لو الـ Rules الحالية عندك مختلفة عن اللي في `firestore.rules`، خد بالك إنك متمسحش أي قاعدة تانية محتاجها لأنظمة تانية - دمج القواعد مع بعض عادي.

---

## 4) تشغيل المشروع محليًا

```bash
npm install
cp .env.example .env
```

افتح ملف `.env` واملاه بالقيم اللي جبتها من الخطوة (أ) فوق:

```
VITE_API_KEY=AIza...
VITE_AUTH_DOMAIN=ro-ya-systems.firebaseapp.com
VITE_PROJECT_ID=ro-ya-systems
VITE_STORAGE_BUCKET=ro-ya-systems.appspot.com
VITE_MESSAGING_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:abcdef
```

> ⚠️ المتغيرات دي لازم تتملى بقيم حقيقية **قبل** أول تشغيل (`npm run dev`) - لو سبتها فاضية Firebase بيعمل crash للصفحة بتاعة تسجيل الدخول لحد ما تحطهم (ده سلوك طبيعي لـ Firebase SDK مش حاجة غلط في الكود).

بعد كده:

```bash
npm run dev
```

افتح `http://localhost:5173` وسجل دخول بالإيميل والباسورد اللي عملتهم في خطوة (ب).

---

## 5) الرفع على Vercel

1. ارفع المشروع على GitHub (ريبو خاص Private يفضل، لأن فيه إشارة لمشروع Firebase بتاعك).
2. من [vercel.com](https://vercel.com) → **Add New → Project** → اختار الريبو.
3. Vercel هيكتشف إنه مشروع Vite تلقائي (Framework Preset: Vite، Build Command: `npm run build`، Output Directory: `dist`).
4. قبل الـ Deploy، افتح **Environment Variables** وضيف نفس الـ 6 متغيرات اللي في `.env.example` بنفس القيم.
5. دوس **Deploy**. بعد ما يخلص هيديك لينك خاص بيك (مثلا `roya-clients-manager.vercel.app`) - ده اللينك اللي هتستخدمه إنت بس لمتابعة العملاء.

> كل مرة تضيف نظام جديد في `src/config/systems.ts` وتعمل push على GitHub، Vercel بيعمل Deploy تلقائي للنسخة الجديدة.

---

## 6) أسئلة شائعة

**هل لازم أعدل حاجة في كود الـ license بتاع الأنظمة (PS Manager / PS Cafe Manager / Mobile)؟**
لأ، المشروع ده بيقرا من نفس الـ collections اللي الأنظمة دي بالفعل بتكتب فيها (`systems/{systemId}/activationRequests`) - مفيش أي تعديل مطلوب في أي نظام حالي.

**ليه مش عامل تحقق بباسورد بسيط بدل Firebase Auth؟**
لأن Firestore Rules محتاجة طريقة موثوقة تتأكد بيها إن اللي بيقرا هو إنت فعلاً (`request.auth != null`) - باسورد ثابت جوه كود الواجهة سهل جدًا إن أي حد يكتشفه من كود الموقع نفسه. Firebase Auth بيحل المشكلة دي بأمان وبسهولة.

**نسيت الباسورد بتاعي؟**
من Firebase Console → Authentication → Users → دوس على التلات نقط جنب اليوزر → Reset password (أو امسح اليوزر واعمل واحد جديد).

**عاوز أضيف حد تاني يشوف اللوحة؟**
ضيفه كـ user جديد في Firebase Authentication (Email/Password)، وهيقدر يسجل دخول بنفس اللينك.

**الصفحة طلعت فاضية بيضا أول ما شغلت المشروع؟**
يا إما `.env` لسه فاضي (راجع خطوة 4)، يا إما القيم غلط. املا `.env` بالقيم الصح وأعد التشغيل.

**الجدول مش عارض بيانات / ظاهر خطأ "permission-denied"؟**
يا إما الـ Firestore Rules لسه مش متحدثة (راجع خطوة 3-ج)، يا إما المتصفح مسجل Auth منتهي (سجل خروج ودخول تاني).
