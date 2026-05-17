import { useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader'
import AuthGate from './pages/AuthGate'
import Journal from './pages/Journal'
import Letters from './pages/Letters'
import Reels from './pages/Reels'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'

// ── Placeholder for routes not yet built ──────────────────────────────────────
function Placeholder({ name }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <p
        className="font-display"
        style={{
          color: 'var(--text-tertiary)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        route
      </p>
      <h1
        className="font-display"
        style={{ color: 'var(--text-secondary)', fontSize: '2rem', fontWeight: 400 }}
      >
        {name}
      </h1>
    </div>
  )
}

// ── Global chrome — nav + cursor, hidden on auth route ────────────────────────
function GlobalChrome({ preloaderDone }) {
  const location = useLocation()
  // Hide navbar on the auth gate (/) and while preloader is running
  const isAuth    = location.hash === '' || location.hash === '#/'
  const navVisible = preloaderDone && !isAuth

  return (
    <>
      <Cursor />
      <Navbar visible={navVisible} herName="Her Name" />
      <MobileNav visible={navVisible} />
    </>
  )
}

// ── Root app ──────────────────────────────────────────────────────────────────
export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <>
      {/* Preloader — overlays everything for 5.5s */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <HashRouter>
        {/* Global chrome needs to be inside HashRouter to read location */}
        <GlobalChrome preloaderDone={preloaderDone} />

        <Routes>
          <Route path="/"         element={<AuthGate />} />
          <Route path="/journal"  element={<Journal />} />
          <Route path="/letters"  element={<Letters />} />
          <Route path="/reels"    element={<Reels />} />
          <Route path="/birthday" element={<Placeholder name="Birthday" />} />
          <Route path="/secret"   element={<Placeholder name="Secret" />} />
          <Route path="/ending"   element={<Placeholder name="Ending" />} />
        </Routes>
      </HashRouter>
    </>
  )
}
