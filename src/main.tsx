import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const AdminApp = lazy(() => import('./admin/AdminApp.tsx'))

const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-navy-950 text-sm text-blue-200">Carregando painel…</div>}>
        <AdminApp />
      </Suspense>
    ) : <App />}
  </StrictMode>,
)
