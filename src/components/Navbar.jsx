import { useEffect, useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function QuillIcon({ active }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M13.5 1C10 1 6 4 5 8L3 13l2-1c1-3 3.5-5.5 7-6.5"
        stroke={active ? 'var(--flame-warm)' : 'var(--text-tertiary)'}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M5 8c0 0 1.5 0.5 2 2"
        stroke={active ? 'var(--flame-warm)' : 'var(--text-tertiary)'}
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg
      width="10" height="13" viewBox="0 0 10 13" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'flameFlicker 2s ease-in-out infinite alternate' }}
    >
      <path
        d="M5 12C2.5 12 1 10 1 8C1 5.5 3 4 3 2C3 2 4 3.5 4 5C4 5 5.5 3 5.5 1C5.5 1 9 3.5 9 7C9 10 7.5 12 5 12Z"
        fill="var(--flame-amber)"
        opacity="0.4"
      />
    </svg>
  )
}

// ── NavLink wrapper with animated underline + active dot ─────────────────────
function NavItem({ to, label, onClick, disabled, title }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <NavLink
        to={to}
        onClick={onClick}
        title={title}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.08em',
          color: disabled
            ? 'var(--text-ghost)'
            : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          paddingBottom: 2,
        }}
      >
        {label}

        {!disabled && (
          <span
            className="nav-underline"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 1,
              width: '100%',
              background: 'var(--ink-primary)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.25s ease',
            }}
          />
        )}
      </NavLink>

      {isActive && !disabled && (
        <div
          style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'var(--flame-warm)',
            boxShadow: '0 0 6px rgba(255,180,60,0.5)',
          }}
        />
      )}
    </div>
  )
}

// ── Secret link — animates when it unlocks ────────────────────────────────────
function SecretNavItem({ unlocked, justUnlocked }) {
  const location = useLocation()
  const isActive = location.pathname === '/secret'

  if (!unlocked) {
    return (
      <NavLink
        to="/secret"
        onClick={e => e.preventDefault()}
        title="Not yet..."
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.08em',
          color: 'var(--text-ghost)',
          textDecoration: 'none',
          cursor: 'not-allowed',
          position: 'relative',
          paddingBottom: 2,
        }}
      >
        ?
      </NavLink>
    )
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
    }}>
      <NavLink
        to="/secret"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.08em',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          textDecoration: 'none',
          cursor: 'pointer',
          position: 'relative',
          paddingBottom: 2,
          // Amber glow on the text itself — fades after unlock
          textShadow: justUnlocked
            ? '0 0 16px rgba(255,180,60,0.6), 0 0 32px rgba(255,160,40,0.3)'
            : 'none',
          transition: 'color 0.8s ease, text-shadow 1.5s ease',
        }}
      >
        Secret

        <span
          className="nav-underline"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 1,
            width: '100%',
            background: 'var(--ink-primary)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.25s ease',
          }}
        />
      </NavLink>

      {/* Pulse ring — appears only at unlock moment */}
      {justUnlocked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,180,60,0.4)',
          animation: 'secretPulse 1.8s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {isActive && (
        <div style={{
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: 'var(--flame-warm)',
          boxShadow: '0 0 6px rgba(255,180,60,0.5)',
        }} />
      )}
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar({ herName = 'Her Name', visible = true }) {
  const location = useLocation()
  const isSecret = location.pathname === '/secret'

  const [secretUnlocked, setSecretUnlocked] = useState(false)
  const [justUnlocked, setJustUnlocked]     = useState(false)
  const [musicOn, setMusicOn]               = useState(() => {
    return localStorage.getItem('music_muted') !== 'true'
  })

  // Was already unlocked before this session?
  const wasUnlocked = useRef(
    localStorage.getItem('candle_blown') === 'true' &&
    localStorage.getItem('birthday_letter_read') === 'true'
  )

  // Poll localStorage every 2s for secret unlock
  useEffect(() => {
    const check = () => {
      const unlocked =
        localStorage.getItem('candle_blown') === 'true' &&
        localStorage.getItem('birthday_letter_read') === 'true'

      if (unlocked && !secretUnlocked) {
        setSecretUnlocked(true)
        // Only fire the animation if this is the MOMENT it unlocked —
        // not if it was already unlocked when she arrived
        if (!wasUnlocked.current) {
          setJustUnlocked(true)
          // Glow fades after 3s
          setTimeout(() => setJustUnlocked(false), 3000)
        }
      }
    }
    check()
    const id = setInterval(check, 2000)
    return () => clearInterval(id)
  }, [secretUnlocked])

  const toggleMusic = () => {
    const next = !musicOn
    setMusicOn(next)
    localStorage.setItem('music_muted', next ? 'false' : 'true')
  }

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    zIndex: 'var(--z-nav)',
    background: 'rgba(18,14,8,0.92)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderBottom: '1px solid rgba(139,109,74,0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    boxShadow: '0 1px 20px rgba(0,0,0,0.5)',
  }

  return (
    <>
      {/* Inject the pulse keyframe once */}
      <style>{`
        @keyframes secretPulse {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.7; }
          60%  { opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
      `}</style>

      <nav
        className="desktop-nav"
        style={{
          ...navStyle,
          opacity: !visible ? 0 : isSecret ? 0.3 : 1,
          transform: !visible ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onMouseEnter={isSecret ? e => { e.currentTarget.style.opacity = 1 } : undefined}
        onMouseLeave={isSecret ? e => { e.currentTarget.style.opacity = 0.3 } : undefined}
      >
        {/* LEFT — Her name */}
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 17,
            color: 'var(--flame-warm)',
            letterSpacing: '0.07em',
            userSelect: 'none',
          }}
        >
          ✦ {herName}
        </span>

        {/* CENTER — Nav links */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 36 }}>
          <div className="nav-item-wrap"><NavItem to="/journal"  label="Journal"  /></div>
          <div className="nav-item-wrap"><NavItem to="/letters"  label="Letters"  /></div>
          <div className="nav-item-wrap"><NavItem to="/reels"    label="Reels"    /></div>
          <div className="nav-item-wrap"><NavItem to="/birthday" label="Birthday" /></div>

          {/* Secret link — handles its own unlock animation */}
          <div className="nav-item-wrap">
            <SecretNavItem
              unlocked={secretUnlocked}
              justUnlocked={justUnlocked}
            />
          </div>
        </div>

        {/* RIGHT — Music toggle + flame */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={toggleMusic}
            title={musicOn ? 'mute' : 'play music'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <QuillIcon active={musicOn} />
          </button>
          <FlameIcon />
        </div>
      </nav>
    </>
  )
}
