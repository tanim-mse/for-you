import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandleParticles from '../components/CandleParticles'

export default function Ending() {
  const navigate  = useNavigate()
  const ref       = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger immediately — this is a destination, not a scroll section
    const id = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(id)
  }, [])

  const line = (delay) => ({
    opacity:    visible ? 1 : 0,
    transition: `opacity 1.2s ease ${delay}ms`,
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Candle ambient — returns to warmth after the black of Secret */}
      <div className="candle-ambient" style={{ position: 'fixed', inset: 0, zIndex: 1 }} />

      {/* Few particles — like embers dying */}
      <CandleParticles count={10} />

      {/* Content */}
      <div
        ref={ref}
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 460,
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Line 1 */}
        <p
          style={{
            ...line(0),
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 3.5vw, 28px)',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          If another universe exists,
        </p>

        {/* Line 2 — warmer color, the only emphasis */}
        <p
          style={{
            ...line(1500),
            marginTop: 8,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 3.5vw, 28px)',
            color: 'var(--text-primary)',
            lineHeight: 1.5,
          }}
        >
          I hope I still find you there.
        </p>

        {/* Line 3 — attribution */}
        <p
          style={{
            ...line(2800),
            marginTop: 32,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.14em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          — Six years of drafts, finally sent.
        </p>

        {/* Go back button — last thing to appear */}
        <div style={{ ...line(4000), marginTop: 52 }}>
          <button
            onClick={() => navigate('/journal')}
            className="ending-back-btn"
            style={{
              background: 'transparent',
              border: 'none',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              padding: 0,
              position: 'relative',
            }}
          >
            Go back to the beginning
          </button>
        </div>
      </div>
    </div>
  )
}
