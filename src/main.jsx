/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Side2 from './pages/Side2.jsx'
import { ScrollToTop } from './components/ScrollToTop.jsx'
import { AuthProvider } from './lib/auth.jsx'
import './index.css'

// Lazy-load everything except the landing page so the homepage bundle stays small.
const Personvern = lazy(() => import('./pages/Personvern.jsx'))
const Vilkar = lazy(() => import('./pages/Vilkar.jsx'))
const AiRevisjon = lazy(() => import('./pages/AiRevisjon.jsx'))
const AiPartner = lazy(() => import('./pages/AiPartner.jsx'))
const Takk = lazy(() => import('./pages/Takk.jsx'))
const Preso = lazy(() => import('./pages/Preso.jsx'))
const Onboarding = lazy(() => import('./pages/Onboarding.jsx'))
const Partner = lazy(() => import('./pages/Partner.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const PostLogin = lazy(() => import('./pages/PostLogin.jsx'))
const SetPassword = lazy(() => import('./pages/SetPassword.jsx'))
const Admin = lazy(() => import('./pages/Admin.jsx'))
const AdminPartner = lazy(() => import('./pages/AdminPartner.jsx'))
const AdminNyPartner = lazy(() => import('./pages/AdminNyPartner.jsx'))
const NySide = lazy(() => import('./pages/NySide.jsx').then((m) => ({ default: m.NySide })))
const Nes = lazy(() => import('./pages/Nes.jsx'))

const RouteFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      background: '#0f151d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: '2px solid rgba(79, 195, 176, 0.18)',
        borderTopColor: '#4FC3B0',
        borderRadius: '50%',
        animation: 'agentik-spin 0.9s linear infinite',
      }}
    />
    <style>{`@keyframes agentik-spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Side2 er den nye landingsiden — erstatter NySide */}
              <Route path="/" element={<Side2 />} />
              <Route path="/side2" element={<Side2 />} />
              {/* NySide arkivert — tilgjengelig for sammenligning */}
              <Route path="/gammel" element={<NySide />} />
              <Route path="/personvern" element={<Personvern />} />
              <Route path="/vilkar" element={<Vilkar />} />
              <Route path="/ai-revisjon" element={<AiRevisjon />} />
              <Route path="/ai-partner" element={<AiPartner />} />
              <Route path="/nes" element={<Nes />} />
              <Route path="/takk" element={<Takk />} />
              <Route path="/preso/:id" element={<Preso />} />
              <Route path="/onboarding/:token" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post-login" element={<PostLogin />} />
              <Route path="/sett-passord" element={<SetPassword />} />
              <Route path="/partner/:slug" element={<Partner />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/ny-partner" element={<AdminNyPartner />} />
              <Route path="/admin/partner/:slug" element={<AdminPartner />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
