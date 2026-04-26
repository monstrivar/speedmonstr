import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Personvern from './pages/Personvern.jsx'
import Vilkar from './pages/Vilkar.jsx'
import AiRevisjon from './pages/AiRevisjon.jsx'
import AiPartner from './pages/AiPartner.jsx'
import Side2 from './pages/Side2.jsx'
import Takk from './pages/Takk.jsx'
import Preso from './pages/Preso.jsx'
import Onboarding from './pages/Onboarding.jsx'
import { NySide } from './pages/NySide.jsx'
import { ScrollToTop } from './components/ScrollToTop.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<NySide />} />
          <Route path="/personvern" element={<Personvern />} />
          <Route path="/vilkar" element={<Vilkar />} />
          <Route path="/ai-revisjon" element={<AiRevisjon />} />
          <Route path="/ai-partner" element={<AiPartner />} />
          <Route path="/side2" element={<Side2 />} />
          <Route path="/takk" element={<Takk />} />
          <Route path="/preso/:id" element={<Preso />} />
          <Route path="/onboarding/:token" element={<Onboarding />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
