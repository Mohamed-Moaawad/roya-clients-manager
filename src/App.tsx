import { Routes, Route } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '@/firebase/config'
import { Login } from '@/pages/Login'
import { Home } from '@/pages/Home'
import { SystemPage } from '@/pages/SystemPage'

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <div dir="rtl" className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/system/:systemId" element={<SystemPage />} />
    </Routes>
  )
}

export default App
