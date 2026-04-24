import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Personvern from './pages/Personvern.jsx'
import Vilkar from './pages/Vilkar.jsx'
import { NySide } from './pages/NySide.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NySide />} />
          <Route path="/personvern" element={<Personvern />} />
          <Route path="/vilkar" element={<Vilkar />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
