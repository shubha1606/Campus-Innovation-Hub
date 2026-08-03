import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function TempHome() {
  return (
    <main className="temp-home">
      <h1>Welcome to Campus Innovation Hub</h1>
      <p>Connect. Collaborate. Innovate.</p>
      <p style={{ color: '#8b949e', fontSize: '0.95rem' }}>
        Full pages coming soon — Navbar and Footer are live!
      </p>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/*" element={<TempHome />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
