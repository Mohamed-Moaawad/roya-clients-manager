import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/app/ErrorBoundary.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
