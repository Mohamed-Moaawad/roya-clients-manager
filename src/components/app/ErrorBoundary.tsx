import * as React from 'react'

interface State {
  error: Error | null
}

/**
 * لو حصل خطأ في الاتصال بـ Firebase (غالبًا لإن .env لسه مش متظبط أو القيم غلط)،
 * بدل ما الصفحة تفضل فاضية بيضا، بنعرض رسالة واضحة توضح المشكلة.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          dir="rtl"
          className="flex min-h-dvh items-center justify-center bg-background px-6 text-center"
        >
          <div className="max-w-md">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
              R
            </div>
            <h1 className="mb-2 text-lg font-bold text-foreground">الإعداد لسه ناقص</h1>
            <p className="text-sm leading-7 text-muted-foreground">
              فيه مشكلة في الاتصال بـ Firebase - غالبًا متغيرات البيئة (<code>.env</code>) لسه مش
              متظبطة أو القيم غلط. انسخ ملف <code>.env.example</code> لـ <code>.env</code> واملأ
              القيم من Firebase Console، وراجع README.md للشرح كامل.
            </p>
            <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground" dir="ltr">
              {this.state.error.message}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
