import { useEffect, useRef, useState } from 'react'
import CandleParticles from '../components/CandleParticles'
import Ornament from '../components/Ornament'
import Envelope from '../components/Envelope'
import { letters } from '../data/letters'

// ── Page header ───────────────────────────────────────────────────────────────
function LettersHeader() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger immediately on mount — header is always above the fold
    const id = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(id)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        paddingTop: 100,
        textAlign: 'center',
        position: 'relative',
        zIndex: 3,
      }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <Ornament width={120} opacity={0.5} />
      </div>

      <h1
        style={{
          marginTop: 16,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 5vw, 40px)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 1.0s ease 0.15s, transform 1.0s ease 0.15s',
        }}
      >
        যা কখনো বলা হয়নি
      </h1>

      <p
        style={{
          marginTop: 8,
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 15,
          color: 'var(--text-secondary)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.0s ease 0.3s',
        }}
      >
        কথার অভাবে না। কথা ছিল অনেক বেশি।
      </p>

      {/* Horizontal rule */}
      <div
        style={{
          marginTop: 20,
          width: 72,
          height: 1,
          background: 'var(--ink-faded)',
          opacity: 0.35,
          margin: '20px auto 0',
        }}
      />

      {/* Sound hint */}
      <p
        style={{
          marginTop: 28,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          color: 'var(--text-ghost)',
          letterSpacing: '0.1em',
          opacity: 0.5,
        }}
      >
        ♪ শব্দসহ পড়লে ভালো লাগবে
      </p>
    </div>
  )
}

// ── Letters page ──────────────────────────────────────────────────────────────
export default function Letters() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-void)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Soft lamp light from top center */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 45% 30% at 50% 0%, rgba(200,130,40,0.11) 0%, transparent 55%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Particles — quiet, intimate */}
      <CandleParticles count={12} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>

        {/* Header */}
        <LettersHeader />

        {/* Envelope list */}
        <div
          style={{
            maxWidth: 540,
            margin: '48px auto 0',
            padding: '0 24px 120px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {letters.map((letter, i) => (
            <Envelope key={letter.id} letter={letter} index={i} />
          ))}
        </div>

      </div>
    </div>
  )
}
