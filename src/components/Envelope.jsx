import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '../utils/audio'

// ── Typewriter hook — unchanged ───────────────────────────────────────────────
function useTypewriter(paragraphs, active) {
  const [displayed, setDisplayed] = useState(() => paragraphs.map(() => ''))
  const [paraIndex, setParaIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [finished, setFinished]   = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!active || finished) return
    if (paraIndex >= paragraphs.length) { setFinished(true); return }
    const currentPara = paragraphs[paraIndex]
    if (charIndex < currentPara.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev]
          next[paraIndex] = currentPara.slice(0, charIndex + 1)
          return next
        })
        setCharIndex(c => c + 1)
      }, 18)
    } else {
      timerRef.current = setTimeout(() => {
        setParaIndex(p => p + 1)
        setCharIndex(0)
      }, 400)
    }
    return () => clearTimeout(timerRef.current)
  }, [active, paraIndex, charIndex, paragraphs, finished])

  useEffect(() => {
    if (!active) {
      setDisplayed(paragraphs.map(() => ''))
      setParaIndex(0)
      setCharIndex(0)
      setFinished(false)
    }
  }, [active, paragraphs])

  return { displayed, paraIndex, finished }
}

// ── Letter Modal — unchanged ──────────────────────────────────────────────────
function LetterModal({ letter, onClose, onRead }) {
  const { displayed, paraIndex, finished } = useTypewriter(letter.body, true)
  const bottomRef     = useRef(null)
  const hasMarkedRead = useRef(false)
  const touchStart    = useRef(0)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasMarkedRead.current) {
          hasMarkedRead.current = true
          onRead(letter.id)
        }
      },
      { threshold: 0.8 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [letter.id, onRead])

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        onClick={onClose}
        onTouchStart={e => { touchStart.current = e.touches[0].clientY }}
        onTouchEnd={e => {
          if (e.changedTouches[0].clientY - touchStart.current > 80) onClose()
        }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(6,4,2,0.90)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 'var(--z-modal)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <motion.div
          key="letter"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="letter-modal-inner"
          style={{
            position: 'relative',
            width: 'min(520px, 92vw)',
            height: 'min(680px, 85vh)',
            overflowY: 'auto',
            borderRadius: 3,
            zIndex: 1001,
            WebkitOverflowScrolling: 'touch',
            boxShadow: `
              0 0 0 1px rgba(100,75,40,0.5),
              0 40px 80px rgba(0,0,0,0.80),
              0 0 60px rgba(180,130,50,0.12)
            `,
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            background: 'linear-gradient(to bottom, rgba(195,165,110,0.15) 0%, transparent 100%)',
            pointerEvents: 'none', borderRadius: '3px 3px 0 0', zIndex: 1,
          }} />

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 20,
              background: 'none', border: 'none', fontSize: 22,
              color: 'rgba(80,55,25,0.55)', cursor: 'pointer',
              lineHeight: 1, padding: 0, zIndex: 10, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(40,20,5,0.90)'}
            onMouseLeave={e => e.target.style.color = 'rgba(80,55,25,0.55)'}
          >×</button>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              color: 'rgba(80,55,25,0.65)', letterSpacing: '0.15em',
              textTransform: 'uppercase', textAlign: 'right', marginBottom: 24,
            }}>{letter.date}</p>

            <p style={{
              fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic',
              fontSize: 24, color: 'rgba(45,28,8,0.88)', marginBottom: 20, lineHeight: 1.4,
            }}>{letter.salutation}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {letter.body.map((fullText, pi) => (
                <p key={pi} style={{
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  fontSize: 'clamp(15px, 2vw, 17px)',
                  lineHeight: 2.05, color: 'rgba(40,25,8,0.82)',
                  letterSpacing: '0.01em',
                  minHeight: `${fullText.length > 80 ? 3 : fullText.length > 40 ? 2 : 1}lh`,
                  position: 'relative',
                }}>
                  {displayed[pi]}
                  {pi === paraIndex && !finished && (
                    <span style={{
                      display: 'inline-block', marginLeft: 1,
                      color: 'rgba(80,55,25,0.45)',
                      animation: 'blink 0.9s ease-in-out infinite',
                    }}>|</span>
                  )}
                </p>
              ))}
            </div>

            <p style={{
              marginTop: 32,
              fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic',
              fontSize: 18, color: 'rgba(60,38,14,0.72)', textAlign: 'right',
            }}>{letter.signoff}</p>

            <div ref={bottomRef} style={{ height: 1, marginTop: 8 }} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Envelope SVG — fully geometric, real envelope shape ──────────────────────
// Built as a single SVG so every fold, shadow, and panel is pixel-perfect.
// No image overlays, no overflow:hidden fighting us.
function EnvelopeSVG({ flapOpen, isLocked, read, index, onClick }) {

  // All colors as constants — easy to tune
  const C = {
    // Body center — the main visible face of the envelope
    bodyLight:   '#C8A87A',
    bodyMid:     '#B8946A',
    bodyDark:    '#A07850',

    // Flap — slightly cooler/darker than body, clearly a separate panel
    flapLight:   '#A07050',
    flapMid:     '#8A5E3C',
    flapDark:    '#6E4828',

    // Side triangles — folded sides, midtone
    sideLight:   '#B89060',
    sideDark:    '#9A7448',

    // Bottom triangle — the back fold
    bottomLight: '#9A7448',
    bottomDark:  '#7A5830',

    // Shadow lines between panels
    fold:        'rgba(40,20,5,0.25)',
    foldLight:   'rgba(255,220,160,0.12)',

    // Grain noise filter id
    noiseId:     'envelope-noise',
  }

  // SVG viewBox — 500 wide × 300 tall (5:3 ratio)
  const W = 500
  const H = 300

  // Key geometry points
  const midX  = W / 2       // 250
  const midY  = H / 2       // 150
  const flapH = H * 0.48    // 144 — how deep the flap goes

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block', cursor: isLocked ? 'not-allowed' : 'pointer' }}
      onClick={onClick}
    >
      <defs>
        {/* Paper grain filter */}
        <filter id={C.noiseId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
          <feComponentTransfer in="blended">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>

        {/* Drop shadow for the whole envelope */}
        <filter id="env-shadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="rgba(0,0,0,0.55)" />
        </filter>

        {/* Clip to envelope rectangle */}
        <clipPath id="env-clip">
          <rect x="0" y="0" width={W} height={H} rx="3" />
        </clipPath>
      </defs>

      {/* ── Outer shadow ── */}
      <rect
        x="0" y="0" width={W} height={H} rx="3"
        fill="transparent"
        filter="url(#env-shadow)"
      />

      <g clipPath="url(#env-clip)" filter={`url(#${C.noiseId})`}>

        {/* ── 1. BODY CENTER — the main envelope face ── */}
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={C.bodyLight} />
            <stop offset="50%"  stopColor={C.bodyMid} />
            <stop offset="100%" stopColor={C.bodyDark} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx="3" fill="url(#bodyGrad)" />

        {/* ── 2. LEFT SIDE TRIANGLE — folded left panel ── */}
        <defs>
          <linearGradient id="leftGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%"   stopColor={C.sideDark} />
            <stop offset="100%" stopColor={C.sideLight} />
          </linearGradient>
        </defs>
        <polygon
          points={`0,0  ${midX},${midY}  0,${H}`}
          fill="url(#leftGrad)"
          opacity="0.85"
        />
        {/* Left fold shadow line */}
        <line
          x1="0" y1="0" x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1.5"
        />
        <line
          x1="0" y1={H} x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1.5"
        />

        {/* ── 3. RIGHT SIDE TRIANGLE — folded right panel ── */}
        <defs>
          <linearGradient id="rightGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%"   stopColor={C.sideLight} />
            <stop offset="100%" stopColor={C.sideDark} />
          </linearGradient>
        </defs>
        <polygon
          points={`${W},0  ${midX},${midY}  ${W},${H}`}
          fill="url(#rightGrad)"
          opacity="0.85"
        />
        {/* Right fold shadow line */}
        <line
          x1={W} y1="0" x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1.5"
        />
        <line
          x1={W} y1={H} x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1.5"
        />

        {/* ── 4. BOTTOM TRIANGLE — back bottom fold ── */}
        <defs>
          <linearGradient id="bottomGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%"   stopColor={C.bottomLight} />
            <stop offset="100%" stopColor={C.bottomDark} />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${H}  ${midX},${midY}  ${W},${H}`}
          fill="url(#bottomGrad)"
          opacity="0.90"
        />
        {/* Bottom fold shadow line */}
        <line
          x1="0" y1={H} x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1"
        />
        <line
          x1={W} y1={H} x2={midX} y2={midY}
          stroke={C.fold} strokeWidth="1"
        />

        {/* ── 5. ADDRESS — bottom left ── */}
        <text
          x="28" y={H - 62}
          fontFamily="'DM Sans', sans-serif"
          fontSize="9"
          fill="rgba(60,35,10,0.55)"
          letterSpacing="1.2"
        >TO:</text>
        <text
          x="28" y={H - 46}
          fontFamily="'DM Sans', sans-serif"
          fontSize="13"
          fill="rgba(50,28,8,0.80)"
        >you</text>
        <text
          x="28" y={H - 28}
          fontFamily="'DM Sans', sans-serif"
          fontSize="9"
          fill="rgba(60,35,10,0.55)"
          letterSpacing="1.2"
        >FROM:</text>
        <text
          x="28" y={H - 12}
          fontFamily="'EB Garamond', Georgia, serif"
          fontSize="13"
          fontStyle="italic"
          fill="rgba(50,28,8,0.78)"
        >someone who waited</text>

        {/* ── 6. STAMP — bottom right ── */}
        <rect
          x={W - 58} y={H - 58}
          width="40" height="48"
          rx="2"
          fill="rgba(80,50,20,0.18)"
          stroke="rgba(100,70,30,0.35)"
          strokeWidth="1.5"
        />
        {/* Perforated dots — top edge of stamp */}
        {[0,1,2,3,4].map(i => (
          <circle key={i}
            cx={W - 57 + i * 8} cy={H - 58}
            r="1.5"
            fill="rgba(80,50,20,0.25)"
          />
        ))}
        {/* Perforated dots — bottom edge */}
        {[0,1,2,3,4].map(i => (
          <circle key={i}
            cx={W - 57 + i * 8} cy={H - 10}
            r="1.5"
            fill="rgba(80,50,20,0.25)"
          />
        ))}
        <text
          x={W - 38} y={H - 30}
          fontFamily="'DM Sans', sans-serif"
          fontSize="8"
          fill="rgba(70,45,15,0.60)"
          textAnchor="middle"
          letterSpacing="0.8"
        >{`NO. ${index + 1}`}</text>

        {/* ── 7. FLAP — top triangle, rotates open on click ── */}
        {/* We render the flap last so it sits on top of side triangles */}
        <g
          style={{
            transformOrigin: `${midX}px 0px`,
            transform: flapOpen
              ? 'perspective(700px) rotateX(-175deg)'
              : 'perspective(700px) rotateX(0deg)',
            transition: 'transform 0.52s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <defs>
            <linearGradient id="flapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor={C.flapLight} />
              <stop offset="60%"  stopColor={C.flapMid} />
              <stop offset="100%" stopColor={C.flapDark} />
            </linearGradient>
          </defs>
          {/* Main flap triangle */}
          <polygon
            points={`0,0  ${W},0  ${midX},${flapH}`}
            fill="url(#flapGrad)"
          />
          {/* Flap inner highlight — top edge catches light */}
          <line
            x1="2" y1="1" x2={W - 2} y2="1"
            stroke={C.foldLight} strokeWidth="1"
          />
          {/* Flap fold line — the crease at the bottom of the flap */}
          <line
            x1="0" y1="0" x2={midX} y2={flapH}
            stroke={C.fold} strokeWidth="1.2"
          />
          <line
            x1={W} y1="0" x2={midX} y2={flapH}
            stroke={C.fold} strokeWidth="1.2"
          />
          {/* Shadow gradient at flap bottom — makes it look 3D/folded */}
          <defs>
            <linearGradient id="flapShadow" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,0  ${W},0  ${midX},${flapH}`}
            fill="url(#flapShadow)"
          />
        </g>

        {/* ── 8. WAX SEAL — centered at flap tip, drawn last so it's always on top ── */}
        <g transform={`translate(${midX}, ${flapH * 0.72})`}>
          {/* Outer wax blob — slightly irregular polygon */}
          <polygon
            points="0,-18  10,-14  17,-5  15,8  5,16  -5,16  -15,8  -17,-5  -10,-14"
            fill={
              isLocked
                ? '#6B5030'
                : read
                ? '#E8920A'
                : '#E8A020'
            }
          />
          {/* Wax highlight — top left catch */}
          <ellipse
            cx="-4" cy="-7"
            rx="5" ry="4"
            fill="rgba(255,230,150,0.28)"
            transform="rotate(-25)"
          />
          {/* Wax shadow — bottom right */}
          <ellipse
            cx="5" cy="8"
            rx="6" ry="4"
            fill="rgba(0,0,0,0.18)"
          />
          {/* Inner stamp mark */}
          <text
            x="0" y="5"
            fontFamily="'DM Sans', sans-serif"
            fontSize="11"
            fill="rgba(255,245,210,0.75)"
            textAnchor="middle"
          >{isLocked ? '🔒' : '✦'}</text>

          {/* Glow behind seal when unlocked */}
          {!isLocked && (
            <ellipse
              cx="0" cy="0" rx="22" ry="22"
              fill={read ? 'rgba(232,146,10,0.20)' : 'rgba(232,160,32,0.14)'}
              style={{ filter: 'blur(4px)' }}
            />
          )}
        </g>

        {/* ── 9. LOCKED DIM overlay ── */}
        {isLocked && (
          <rect
            x="0" y="0" width={W} height={H} rx="3"
            fill="rgba(0,0,0,0.20)"
          />
        )}

        {/* ── 10. Outer border ── */}
        <rect
          x="0.5" y="0.5"
          width={W - 1} height={H - 1}
          rx="3"
          fill="none"
          stroke="rgba(100,68,28,0.40)"
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}

// ── Envelope ──────────────────────────────────────────────────────────────────
export default function Envelope({ letter, index }) {
  const [flapOpen, setFlapOpen]   = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [read, setRead]           = useState(
    () => localStorage.getItem(`letter_${letter.id}_read`) === 'true'
  )
  const [prevRead, setPrevRead] = useState(
    () => letter.id === 1
      ? true
      : localStorage.getItem(`letter_${letter.id - 1}_read`) === 'true'
  )

  useEffect(() => {
    if (letter.id === 1 || prevRead) return
    const interval = setInterval(() => {
      const isNowRead = localStorage.getItem(`letter_${letter.id - 1}_read`) === 'true'
      if (isNowRead) { setPrevRead(true); clearInterval(interval) }
    }, 800)
    return () => clearInterval(interval)
  }, [letter.id, prevRead])

  const isLocked = letter.locked && !prevRead

  const handleClick = () => {
    if (isLocked) return
    playSfx('paper')
    setFlapOpen(true)
    setTimeout(() => setModalOpen(true), 500)
  }

  const handleClose = () => {
    setModalOpen(false)
    setFlapOpen(false)
  }

  const handleRead = (id) => {
    localStorage.setItem(`letter_${id}_read`, 'true')
    setRead(true)
  }

  return (
    <>
      <div
        className={isLocked ? '' : 'envelope-unlocked'}
        style={{
          position: 'relative',
          width: '100%',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        <EnvelopeSVG
          flapOpen={flapOpen}
          isLocked={isLocked}
          read={read}
          index={index}
          onClick={handleClick}
        />

        {/* Locked tooltip */}
        {isLocked && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontStyle: 'italic', fontSize: 13,
            color: 'rgba(210,185,140,0.80)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 6px rgba(0,0,0,0.6)',
          }}>
            Read the earlier ones first.
          </div>
        )}
      </div>

      {modalOpen && (
        <LetterModal
          letter={letter}
          onClose={handleClose}
          onRead={handleRead}
        />
      )}
    </>
  )
}
