import { useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader'
import AuthGate from './pages/AuthGate'
import Journal from './pages/Journal'
import Reels from './pages/Reels'
import Birthday from './pages/Birthday'
import Secret from './pages/Secret'
import Ending from './pages/Ending'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import MobileNav from './components/MobileNav'
import AudioManager from './components/AudioManager'

function GlobalChrome({ preloaderDone }) {
  const location = useLocation()
  const isAuth = location.pathname === '/'
  const navVisible = !isAuth

  return (
    <>
      <Cursor />
      <Navbar visible={navVisible} herName="Nurin" />
      <MobileNav visible={navVisible} />
      <AudioManager />
    </>
  )
}

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <>
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}
      <HashRouter>
        <GlobalChrome preloaderDone={preloaderDone} />
        <Routes>
          <Route path="/"         element={<AuthGate />} />
          <Route path="/journal"  element={<Journal />} />
          <Route path="/reels"    element={<Reels />} />
          <Route path="/birthday" element={<Birthday />} />
          <Route path="/secret"   element={<Secret />} />
          <Route path="/ending"   element={<Ending />} />
        </Routes>
      </HashRouter>
    </>
  )
}
