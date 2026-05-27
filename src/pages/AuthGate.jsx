import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CandleParticles from '../components/CandleParticles'
import { checkPassword, setAuthenticated } from '../utils/auth'
import { setTrack } from '../utils/audio'

// ── SVG Ornament ──────────────────────────────────────────────────────────────
function Ornament({ flipped = false, opacity = 0.7 }) {
  return (
    <svg width="80" height="12" viewBox="0 0 80 12" fill="none"
      style={{ display: 'block', margin: '0 auto', opacity,
        transform: flipped ? 'scaleY(-1)' : undefined }}>
      <line x1="0"  y1="6" x2="35" y2="6" stroke="#6B4E35" strokeWidth="1" />
      <rect x="37" y="3" width="6" height="6" fill="#6B4E35" transform="rotate(45 40 6)" />
      <line x1="45" y1="6" x2="80" y2="6" stroke="#6B4E35" strokeWidth="1" />
    </svg>
  )
}

// ── Custom Checkbox ───────────────────────────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 14, height: 14,
      border: `1px solid ${checked ? 'var(--flame-warm)' : 'rgba(139,109,74,0.35)'}`,
      borderRadius: 1, display: 'flex', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
      transition: 'border-color 0.2s', backgroundColor: 'transparent',
    }}>
      {checked && <span style={{ color: 'var(--flame-warm)', fontSize: 9, lineHeight: 1 }}>✦</span>}
    </div>
  )
}

// ── Input Field ───────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: '"DM Sans", sans-serif',
        fontSize: 10, letterSpacing: '0.15em', color: 'var(--text-tertiary)',
        marginBottom: 6, textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="auth-input"
        style={{
          width: '100%', padding: '9px 0',
          background: 'transparent', border: 'none',
          borderBottom: focused
            ? '1px solid rgba(255,180,60,0.5)'
            : '1px solid rgba(139,109,74,0.25)',
          boxShadow: focused ? '0 1px 0 0 rgba(255,180,60,0.2)' : 'none',
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: 16, color: 'var(--text-primary)',
          outline: 'none', borderRadius: 0,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      />
    </div>
  )
}

// ── AuthGate ──────────────────────────────────────────────────────────────────
export default function AuthGate() {
  const navigate  = useNavigate()
  const [name, setName]           = useState('')
  const [password, setPassword]   = useState('')
  const [remember, setRemember]   = useState(false)
  const [error, setError]         = useState(false)
  const [loading, setLoading]     = useState(false)
  const [shakeKey, setShakeKey]   = useState(0)
  const [dimCandle, setDimCandle] = useState(false)
  const [cardExit, setCardExit]   = useState(false)

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    setError(false)

    // ── This click is the first user interaction.
    // Calling setTrack here unlocks the audio context and starts music
    // immediately on correct password — no separate click needed ever.
    setTrack('journal')

    const correct = await checkPassword(password)

    if (correct) {
      if (name.trim()) sessionStorage.setItem('visitor_name', name.trim())
      setAuthenticated(remember)
      setCardExit(true)
      setTimeout(() => navigate('/journal'), 600)
    } else {
      setLoading(false)
      setPassword('')
      setError(true)
      setShakeKey(k => k + 1)
      setDimCandle(true)
      setTimeout(() => setDimCandle(false), 1200)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: 'var(--bg-void)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="candle-ambient" style={{
        opacity: dimCandle ? 0.3 : 1,
        transition: 'opacity 0.4s ease', zIndex: 1,
      }} />

      <CandleParticles count={15} />

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(to right, transparent 0%, rgba(180,100,30,0.4) 50%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <motion.div
        key={shakeKey}
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={cardExit
          ? { opacity: 0, scale: 0.96, y: -8 }
          : { opacity: 1, y: 0, scale: 1 }}
        transition={cardExit
          ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          : { duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        {...(shakeKey > 0 && !cardExit ? {
          animate: { x: [0, -9, 9, -6, 6, -3, 3, 0], opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.5, ease: 'easeInOut' },
        } : {})}
        className="paper-card"
        style={{
          position: 'relative', zIndex: 10,
          width: 400, maxWidth: '90vw',
          padding: '44px 40px 40px', borderRadius: 3,
          boxShadow: '0 40px 100px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(139,109,74,0.20)',
        }}
        onKeyDown={handleKeyDown}
      >
        <Ornament />

        <h1 style={{
          marginTop: 20, fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic', fontSize: 21, fontWeight: 400,
          color: 'var(--text-primary)', textAlign: 'center', letterSpacing: '0.03em',
        }}>
          For you, and only you.
        </h1>

        <p style={{
          marginTop: 6, fontFamily: "'Crimson Pro', Georgia, serif",
          fontSize: 15, fontWeight: 300, fontStyle: 'italic',
          color: 'var(--text-secondary)', textAlign: 'center',
        }}>
          If you know, you know.
        </p>

        <div style={{ height: 28 }} />

        <Field label="YOUR NAME" type="text" value={name}
          onChange={setName} placeholder="write your name here..." />

        <div style={{ marginTop: 20 }}>
          <Field label="YOUR WORD" type="password" value={password}
            onChange={setPassword} placeholder="the one only you know..." />
        </div>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center',
          gap: 8, cursor: 'pointer' }} onClick={() => setRemember(r => !r)}>
          <Checkbox checked={remember} onChange={setRemember} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11,
            color: 'var(--text-tertiary)', userSelect: 'none' }}>
            Remember me on this device
          </span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0, y: -3 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: 8, fontFamily: "'Crimson Pro', Georgia, serif",
                fontStyle: 'italic', fontSize: 13,
                color: 'var(--blush)', overflow: 'hidden',
              }}
            >
              That's not quite right.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          whileHover={{
            backgroundColor: 'rgba(255,220,150,0.04)',
            borderColor: 'rgba(212,149,106,0.5)',
            color: 'var(--text-primary)',
            boxShadow: '0 0 20px rgba(200,130,30,0.06)',
          }}
          transition={{ duration: 0.35 }}
          style={{
            marginTop: 24, width: '100%', height: 44,
            background: 'transparent',
            border: '1px solid rgba(139,109,74,0.35)',
            borderRadius: 2, color: 'var(--text-secondary)',
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {loading ? '·  ·  ·' : 'Enter'}
        </motion.button>

        <div style={{ marginTop: 32 }}>
          <Ornament flipped opacity={0.4} />
        </div>
      </motion.div>

      <style>{`
        .auth-input::placeholder { opacity: 0.4; font-style: italic; }
      `}</style>
    </div>
  )
}
