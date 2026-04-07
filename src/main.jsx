import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import Blog from './pages/Blog.jsx'
import Article1 from './pages/Article1.jsx'
import Article2 from './pages/Article2.jsx'
import Article3 from './pages/Article3.jsx'
import Personvern from './pages/Personvern.jsx'
import Vilkar from './pages/Vilkar.jsx'
import Enterprise from './pages/Enterprise.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blogg" element={<Blog />} />
          <Route path="/blogg/hva-er-speed-to-lead" element={<Article1 />} />
          <Route path="/blogg/speed-to-lead-prosess" element={<Article2 />} />
          <Route path="/blogg/speed-to-lead-feil" element={<Article3 />} />
          <Route path="/personvern" element={<Personvern />} />
          <Route path="/vilkar" element={<Vilkar />} />
          <Route path="/enterprise" element={<Enterprise />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
