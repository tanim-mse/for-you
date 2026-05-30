import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function QuillIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: 'block' }}>
      <path
        d="M13.5 1C10 1 6 4 5 8L3 13l2-1c1-3 3.5-5.5 7-6.5"
        stroke={active ? 'var(--flame-warm)' : 'var(--text-tertiary)'}
        strokeWidth="1" strokeLinecap="round" fill="none"
      />
      <path
        d="M5 8c0 0 1.5 0.5 2 2"
        stroke={active ? 'var(--flame-warm)' : 'var(--text-tertiary)'}
        strokeWidth="1" strokeLinecap="round" fill="none"
      />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg width="10" height="13" viewBox="0 0 10 13" fill="none"
      style={{ animation: 'flameFlicker 2s ease-in-out infinite alternate' }}>
      <path
        d="M5 12C2.5 12 1 10 1 8C1 5.5 3 4 3 2C3 2 4 3.5 4 5C4 5 5.5 3 5.5 1C5.5 1 9 3.5 9 7C9 10 7.5 12 5 12Z"
        fill="var(--flame-amber)" opacity="0.4"
      />
    </svg>
  )
}

function NavItem({ to, label }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <NavLink
        to={to}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, fontWeight: 400, letterSpacing: '0.08em',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          textDecoration: 'none', cursor: 'pointer',
          position: 'relative', paddingBottom: 2,
        }}
      >
        {label}
        <span className="nav-underline" style={{
          position: 'absolute', bottom: 0, left: 0,
          height: 1, width: '100%',
          background: 'var(--ink-primary)',
          transform: 'scaleX(0)', transformOrigin: 'left',
          transition: 'transform 0.25s ease',
        }} />
      </NavLink>
      {isActive && (
        <div style={{
          width: 3, height: 3, borderRadius: '50%',
          background: 'var(--flame-warm)',
          boxShadow: '0 0 6px rgba(255,180,60,0.5)',
        }} />
      )}
    </div>
  )
}

export default function Navbar({ herName = 'Her Name', visible = true }) {
  const location = useLocation()
  const isSecret = false // Secret removed

  const [musicOn, setMusicOn] = useState(() => localStorage.getItem('music_muted') !== 'true')

  const toggleMusic = () => {
    const next = !musicOn
    setMusicOn(next)
    localStorage.setItem('music_muted', next ? 'false' : 'true')
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        .nav-item-wrap:hover .nav-underline { transform: scaleX(1) !important; }
      `}</style>

      <nav
        className="desktop-nav"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 64,
          zIndex: 'var(--z-nav)',
          background: 'rgba(18,14,8,0.92)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          borderBottom: '1px solid rgba(139,109,74,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px',
          boxShadow: '0 1px 20px rgba(0,0,0,0.5)',
          opacity: !visible ? 0 : 1,
          transform: !visible ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        {/* Left — her name */}
        <span style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic', fontSize: 17,
          color: 'var(--flame-warm)', letterSpacing: '0.07em', userSelect: 'none',
        }}>
          ✦ {herName}
        </span>

        {/* Center — nav links */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36 }}>
          <div className="nav-item-wrap"><NavItem to="/journal"  label="Journal"  /></div>
          <div className="nav-item-wrap"><NavItem to="/reels"    label="Reels"    /></div>
          <div className="nav-item-wrap"><NavItem to="/birthday" label="Birthday" /></div>
        </div>

        {/* Right — music toggle + flame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={toggleMusic} title={musicOn ? 'mute' : 'play music'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <QuillIcon active={musicOn} />
          </button>
          <FlameIcon />
        </div>
      </nav>
    </>
  )
}
