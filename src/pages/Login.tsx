import * as React from 'react'
import { LogIn, Lock, Mail, EyeClosed, Eye } from 'lucide-react'

// Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

function mapAuthError(code: string): string {
  switch (code) {
    // بيانات الدخول غير صحيحة
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-login-credentials':
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة'

    // البريد الإلكتروني
    case 'auth/invalid-email':
      return 'من فضلك أدخل بريد إلكتروني صحيح'
    case 'auth/missing-email':
      return 'من فضلك أدخل البريد الإلكتروني'

    // كلمة المرور
    case 'auth/missing-password':
      return 'من فضلك أدخل كلمة المرور'
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة، لازم تكون 6 أحرف على الأقل'

    // محاولات تسجيل الدخول
    case 'auth/too-many-requests':
      return 'تم إجراء محاولات كتير، من فضلك استنى شوية وجرب تاني'

    // حالة الحساب
    case 'auth/user-disabled':
      return 'الحساب ده تم تعطيله، تواصل مع المسؤول'

    // إعدادات Firebase
    case 'auth/operation-not-allowed':
      return 'تسجيل الدخول بالبريد الإلكتروني غير مُفعّل حاليًا'
    case 'auth/network-request-failed':
      return 'فشل الاتصال بالإنترنت، اتأكد من اتصالك وجرب تاني'
    case 'auth/invalid-api-key':
      return 'في مشكلة في إعدادات الاتصال، من فضلك تواصل مع المسؤول'
    case 'auth/app-not-authorized':
      return 'التطبيق غير مُصرّح له باستخدام خدمة تسجيل الدخول'

    default:
      return 'حصل خطأ أثناء تسجيل الدخول، من فضلك حاول تاني'
  }
}

export function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  const [isPassword, setIsPassword] = React.useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

      navigate('/')
    } catch (err: unknown) {
      const code =
        typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          typeof err.code === 'string'
          ? err.code
          : ''

      setError(mapAuthError(code))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-roya-primary via-roya-primary to-roya-secondary px-4"
    >
      <Card className="w-full max-w-sm p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground">
            R
          </div>
          <h1 className="text-xl font-bold text-foreground">RO'YA Clients Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">لوحة تحكم إدارة عملاء أنظمة RO'YA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                dir="ltr"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@roya.com"
                className="ps-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">كلمة السر</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <div>
                <Input
                  id="password"
                  type={isPassword ? 'text' : 'password'}
                  dir="ltr"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="ps-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute end-0 top-1/2 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:bg-muted/50"
                  onClick={() => setIsPassword(!isPassword)}
                >
                  {isPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            <LogIn className="size-4" />
            {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
