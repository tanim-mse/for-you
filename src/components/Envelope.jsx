import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '../utils/audio'

// ── SVG Floral Decorations ────────────────────────────────────────────────────

// Top-left corner flower (outline style, like the reference)
function FloralTopLeft() {
  return (
    <svg
      width="110" height="110"
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.55 }}
    >
      {/* Large outer petals */}
      <ellipse cx="38" cy="22" rx="10" ry="18" fill="none" stroke="rgba(180,150,100,0.7)" strokeWidth="1" transform="rotate(-20 38 22)" />
      <ellipse cx="55" cy="18" rx="10" ry="18" fill="none" stroke="rgba(180,150,100,0.7)" strokeWidth="1" transform="rotate(10 55 18)" />
      <ellipse cx="22" cy="38" rx="10" ry="18" fill="none" stroke="rgba(180,150,100,0.7)" strokeWidth="1" transform="rotate(-50 22 38)" />
      <ellipse cx="30" cy="30" rx="10" ry="18" fill="none" stroke="rgba(180,150,100,0.7)" strokeWidth="1" transform="rotate(-35 30 30)" />
      {/* Inner flower center */}
      <circle cx="38" cy="32" r="9" fill="none" stroke="rgba(180,150,100,0.8)" strokeWidth="1" />
      <circle cx="38" cy="32" r="4" fill="none" stroke="rgba(180,150,100,0.6)" strokeWidth="0.8" />
      {/* Petal detail lines */}
      <path d="M38 23 Q40 28 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M44 27 Q41 30 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M44 37 Q41 34 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M38 41 Q37 36 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M32 37 Q35 34 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      <path d="M32 27 Q35 30 38 32" stroke="rgba(180,150,100,0.5)" strokeWidth="0.6" fill="none" />
      {/* Leaves */}
      <path d="M12 55 Q22 40 35 48" stroke="rgba(120,140,80,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M8 68 Q20 52 38 58" stroke="rgba(120,140,80,0.45)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M55 12 Q48 22 52 35" stroke="rgba(120,140,80,0.5)" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Bottom-right lily (fuller, like the reference image)
function FloralBottomRight() {
  return (
    <svg
      width="130" height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none', opacity: 0.50 }}
    >
      {/* Lily petals — large curved shapes */}
      <path d="M65 80 Q45 60 30 45 Q50 55 65 80Z" fill="rgba(200,185,155,0.35)" stroke="rgba(180,150,100,0.65)" strokeWidth="0.8" />
      <path d="M65 80 Q80 55 95 42 Q80 60 65 80Z" fill="rgba(200,185,155,0.35)" stroke="rgba(180,150,100,0.65)" strokeWidth="0.8" />
      <path d="M65 80 Q40 75 20 70 Q45 68 65 80Z" fill="rgba(200,185,155,0.30)" stroke="rgba(180,150,100,0.60)" strokeWidth="0.8" />
      <path d="M65 80 Q88 75 110 72 Q85 70 65 80Z" fill="rgba(200,185,155,0.30)" stroke="rgba(180,150,100,0.60)" strokeWidth="0.8" />
      <path d="M65 80 Q55 58 50 38 Q62 62 65 80Z" fill="rgba(200,185,155,0.28)" stroke="rgba(180,150,100,0.55)" strokeWidth="0.8" />
      <path d="M65 80 Q75 58 80 38 Q68 62 65 80Z" fill="rgba(200,185,155,0.28)" stroke="rgba(180,150,100,0.55)" strokeWidth="0.8" />
      {/* Stamen dots */}
      <circle cx="62" cy="73" r="2" fill="rgba(160,120,50,0.7)" />
      <circle cx="68" cy="71" r="2" fill="rgba(160,120,50,0.7)" />
      <circle cx="65" cy="69" r="1.5" fill="rgba(160,120,50,0.6)" />
      <circle cx="60" cy="68" r="1.5" fill="rgba(140,100,40,0.6)" />
      <circle cx="70" cy="68" r="1.5" fill="rgba(140,100,40,0.6)" />
      {/* Stem */}
      <path d="M65 85 Q63 100 60 120" stroke="rgba(100,130,60,0.55)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M62 100 Q45 95 30 105 Q48 98 62 100Z" fill="rgba(100,130,60,0.3)" stroke="rgba(100,130,60,0.5)" strokeWidth="0.8" />
    </svg>
  )
}

// Bottom-left lily (the taller one from the reference)
function FloralBottomLeft() {
  return (
    <svg
      width="100" height="140"
      viewBox="0 0 100 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none', opacity: 0.48 }}
    >
      {/* Tall stem */}
      <path d="M40 140 Q38 110 35 80 Q33 55 30 30" stroke="rgba(100,130,60,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Bud at top */}
      <path d="M30 30 Q25 20 28 10 Q32 20 30 30Z" fill="rgba(180,190,140,0.5)" stroke="rgba(120,140,80,0.6)" strokeWidth="0.8" />
      <path d="M30 30 Q35 20 33 10 Q30 22 30 30Z" fill="rgba(180,190,140,0.45)" stroke="rgba(120,140,80,0.6)" strokeWidth="0.8" />
      {/* Open lily bloom — mid stem */}
      <path d="M35 65 Q20 50 10 38 Q28 52 35 65Z" fill="rgba(210,200,170,0.4)" stroke="rgba(180,150,100,0.65)" strokeWidth="0.8" />
      <path d="M35 65 Q48 48 52 33 Q40 52 35 65Z" fill="rgba(210,200,170,0.4)" stroke="rgba(180,150,100,0.65)" strokeWidth="0.8" />
      <path d="M35 65 Q18 65 5 68 Q22 63 35 65Z" fill="rgba(200,190,155,0.35)" stroke="rgba(180,150,100,0.60)" strokeWidth="0.8" />
      <path d="M35 65 Q52 65 65 68 Q50 63 35 65Z" fill="rgba(200,190,155,0.35)" stroke="rgba(180,150,100,0.60)" strokeWidth="0.8" />
      {/* Stamen */}
      <circle cx="33" cy="60" r="1.8" fill="rgba(160,120,50,0.65)" />
      <circle cx="37" cy="59" r="1.5" fill="rgba(160,120,50,0.60)" />
      <circle cx="35" cy="57" r="1.5" fill="rgba(140,100,40,0.55)" />
      {/* Leaves */}
      <path d="M38 90 Q55 82 70 88 Q52 85 38 90Z" fill="rgba(100,130,60,0.35)" stroke="rgba(100,130,60,0.5)" strokeWidth="0.8" />
      <path d="M36 110 Q20 105 8 112 Q22 106 36 110Z" fill="rgba(100,130,60,0.30)" stroke="rgba(100,130,60,0.45)" strokeWidth="0.8" />
    </svg>
  )
}

// ── Wax Seal ──────────────────────────────────────────────────────────────────
function WaxSeal({ locked, read }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: locked
          ? 'radial-gradient(circle at 35% 35%, rgba(110,90,70,1) 0%, rgba(70,55,40,1) 60%)'
          : read
          ? 'radial-gradient(circle at 35% 35%, #E8A020 0%, #C4681A 60%)'
          : 'radial-gradient(circle at 35% 35%, var(--flame-amber) 0%, var(--flame-deep) 60%)',
        boxShadow: locked
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : read
          ? '0 2px 8px rgba(0,0,0,0.4), 0 0 18px rgba(220,140,40,0.35)'
          : '0 2px 8px rgba(0,0,0,0.4), 0 0 14px rgba(200,120,30,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        transition: 'background 0.6s ease, box-shadow 0.6s ease',
      }}
    >
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1 }}>
        {locked ? '🔒' : '✦'}
      </span>
    </div>
  )
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(paragraphs, active) {
  const [displayed, setDisplayed] = useState([])
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
          next[paraIndex] = (next[paraIndex] || '') + currentPara[charIndex]
          return next
        })
        setCharIndex(c => c + 1)
      }, 22)
    } else {
      timerRef.current = setTimeout(() => {
        setParaIndex(p => p + 1)
        setCharIndex(0)
      }, 500)
    }
    return () => clearTimeout(timerRef.current)
  }, [active, paraIndex, charIndex, paragraphs, finished])

  useEffect(() => {
    if (!active) {
      setDisplayed([]); setParaIndex(0); setCharIndex(0); setFinished(false)
    }
  }, [active])

  return displayed
}

// ── Letter Modal — Parchment Design ──────────────────────────────────────────
function LetterModal({ letter, onClose, onRead }) {
  const displayed = useTypewriter(letter.body, true)
  const bottomRef = useRef(null)
  const hasMarkedRead = useRef(false)
  const touchStart = useRef(0)

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
      {/* Dark overlay */}
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
          position: 'fixed',
          inset: 0,
          background: 'rgba(6,4,2,0.90)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 'var(--z-modal)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* Letter paper — parchment design */}
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
            width: 'min(540px, 92vw)',
            maxHeight: '88vh',
            overflowY: 'auto',
            borderRadius: 3,
            zIndex: 1001,
            WebkitOverflowScrolling: 'touch',
            // Parchment background — warm aged paper
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(240,220,175,0.15) 0%, transparent 55%),
              radial-gradient(ellipse at 75% 80%, rgba(200,170,110,0.12) 0%, transparent 50%),
              linear-gradient(160deg, #C8AB7A 0%, #B8976A 25%, #C2A070 50%, #AA8A58 75%, #B89560 100%)
            `,
            boxShadow: `
              0 0 0 1px rgba(100,75,40,0.5),
              0 2px 0 rgba(255,240,200,0.08) inset,
              0 -2px 0 rgba(0,0,0,0.15) inset,
              0 40px 80px rgba(0,0,0,0.75),
              0 0 60px rgba(180,130,50,0.10)
            `,
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          {/* Aged paper noise overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 3,
              opacity: 0.55,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Faint stain spots — aged look */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', bottom: '18%', left: '10%',
              width: 60, height: 40, borderRadius: '50%',
              background: 'rgba(130,90,30,0.07)',
              filter: 'blur(8px)',
            }} />
            <div style={{
              position: 'absolute', bottom: '22%', left: '25%',
              width: 30, height: 20, borderRadius: '50%',
              background: 'rgba(110,75,25,0.06)',
              filter: 'blur(6px)',
            }} />
            <div style={{
              position: 'absolute', bottom: '12%', right: '15%',
              width: 45, height: 35, borderRadius: '50%',
              background: 'rgba(130,90,30,0.05)',
              filter: 'blur(10px)',
            }} />
          </div>

          {/* Horizontal ruled lines — like lined paper */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              pointerEvents: 'none',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  top: 72 + i * 32,
                  height: 1,
                  background: 'rgba(100,70,30,0.13)',
                }}
              />
            ))}
          </div>

          {/* Floral corners — decorative SVGs */}
          <FloralTopLeft />
          <FloralBottomRight />
          <FloralBottomLeft />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 18,
              background: 'none',
              border: 'none',
              fontSize: 22,
              color: 'rgba(80,55,25,0.55)',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0,
              zIndex: 10,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(60,35,10,0.9)'}
            onMouseLeave={e => e.target.style.color = 'rgba(80,55,25,0.55)'}
          >
            ×
          </button>

          {/* Content — sits above the decorations */}
          <div style={{ position: 'relative', zIndex: 2 }}>

            {/* Date — top right */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                color: 'rgba(80,55,25,0.65)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textAlign: 'right',
                marginBottom: 28,
              }}
            >
              {letter.date}
            </p>

            {/* Salutation */}
            <p
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 24,
                color: 'rgba(50,30,10,0.88)',
                marginBottom: 22,
                lineHeight: 1.4,
              }}
            >
              {letter.salutation}
            </p>

            {/* Body paragraphs — typewriter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {letter.body.map((_, pi) => (
                <p
                  key={pi}
                  style={{
                    fontFamily: "'Crimson Pro', Georgia, serif",
                    fontSize: 'clamp(15px, 2vw, 17px)',
                    lineHeight: 2.0,
                    color: 'rgba(45,28,8,0.85)',
                    minHeight: '1.5em',
                    letterSpacing: '0.01em',
                  }}
                >
                  {displayed[pi] || ''}
                  {pi === Math.min(
                    letter.body.length - 1,
                    displayed.length > 0 ? displayed.length - 1 : 0
                  ) && displayed[pi] !== letter.body[pi] && (
                    <span style={{
                      display: 'inline-block',
                      marginLeft: 1,
                      color: 'rgba(80,55,25,0.5)',
                      animation: 'blink 0.9s ease-in-out infinite',
                    }}>|</span>
                  )}
                </p>
              ))}
            </div>

            {/* Sign-off */}
            <p
              style={{
                marginTop: 36,
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(60,38,14,0.75)',
                textAlign: 'right',
              }}
            >
              {letter.signoff}
            </p>

            {/* Invisible bottom marker */}
            <div ref={bottomRef} style={{ height: 1, marginTop: 8 }} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    setTimeout(() => setModalOpen(true), 520)
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
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        }}
        className={isLocked ? '' : 'envelope-unlocked'}
      >
        {/* Envelope body */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '60%',
            background: 'linear-gradient(145deg, #C8AB7A 0%, #B8976A 40%, #AA8A58 100%)',
            border: '1px solid rgba(120,88,44,0.45)',
            borderRadius: 2,
            boxShadow: `
              0 4px 24px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,230,170,0.12),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
            overflow: 'visible',
          }}
        >
          {/* Paper noise on envelope body */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 2,
            opacity: 0.45,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '150px 150px',
            mixBlendMode: 'multiply',
          }} />

          {/* Inner fold lines */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 2 }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 0 70px 90px',
              borderColor: 'transparent transparent rgba(0,0,0,0.09) transparent',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 90px 70px 0',
              borderColor: 'transparent rgba(0,0,0,0.09) transparent transparent',
            }} />
            {/* Center fold line */}
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 1, height: '55%',
              background: 'rgba(0,0,0,0.06)',
            }} />
          </div>

          {/* Flap */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '50%',
              background: 'linear-gradient(170deg, #BF9E6A 0%, #AA8A52 60%, #B89560 100%)',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 72%)',
              zIndex: 2,
              transformOrigin: 'top center',
              transform: flapOpen
                ? 'perspective(600px) rotateX(-175deg)'
                : 'perspective(600px) rotateX(0deg)',
              transition: 'transform 0.52s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderBottom: '1px solid rgba(90,60,20,0.2)',
            }}
          />

          {/* Wax seal */}
          <WaxSeal locked={isLocked} read={read} />

          {/* Address label */}
          <div style={{ position: 'absolute', bottom: 22, left: 22, zIndex: 1 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'rgba(60,38,14,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>To:</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(60,38,14,0.65)', marginBottom: 6 }}>you</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'rgba(60,38,14,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>From:</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(60,38,14,0.65)', fontStyle: 'italic' }}>someone who waited</p>
          </div>

          {/* Stamp */}
          <div style={{
            position: 'absolute', bottom: 18, right: 18,
            width: 36, height: 44,
            border: '1.5px solid rgba(100,72,32,0.30)',
            borderRadius: 2,
            background: 'rgba(180,150,90,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: 'rgba(60,38,14,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              no. {index + 1}
            </span>
          </div>

          {/* Locked dim */}
          {isLocked && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', borderRadius: 2, zIndex: 4 }} />
          )}
        </div>

        {/* Locked tooltip */}
        {isLocked && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontStyle: 'italic', fontSize: 13,
            color: 'rgba(200,175,130,0.7)',
            pointerEvents: 'none', zIndex: 5, whiteSpace: 'nowrap',
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
