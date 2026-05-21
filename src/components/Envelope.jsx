import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '../utils/audio'

// ── Wax Seal ──────────────────────────────────────────────────────────────────
function WaxSeal({ locked, read }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: locked
          ? 'radial-gradient(circle at 35% 35%, rgba(120,100,80,1) 0%, rgba(80,60,40,1) 60%)'
          : read
          ? 'radial-gradient(circle at 35% 35%, #E8A020 0%, #C4681A 60%)'
          : 'radial-gradient(circle at 35% 35%, var(--flame-amber) 0%, var(--flame-deep) 60%)',
        boxShadow: locked
          ? '0 2px 8px rgba(0,0,0,0.4)'
          : read
          ? '0 2px 8px rgba(0,0,0,0.4), 0 0 18px rgba(220,140,40,0.3)'
          : '0 2px 8px rgba(0,0,0,0.4), 0 0 12px rgba(200,120,30,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        transition: 'background 0.6s ease, box-shadow 0.6s ease',
      }}
    >
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
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
      setDisplayed([])
      setParaIndex(0)
      setCharIndex(0)
      setFinished(false)
    }
  }, [active])

  return displayed
}

// ── Letter Modal ──────────────────────────────────────────────────────────────
function LetterModal({ letter, onClose, onRead }) {
  const displayed = useTypewriter(letter.body, true)
  const bottomRef = useRef(null)
  const hasMarkedRead = useRef(false)
  const touchStart = useRef(0)

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Mark read when bottom sentinel enters view
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
      {/* Dark backdrop */}
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
        {/* ── Letter paper — parchment image background ── */}
        <motion.div
          key="letter"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}

          // ── NO paper-card class — that was overriding the background ──
          className="letter-modal-inner"

          style={{
            position: 'relative',
            width: 'min(520px, 92vw)',
            maxHeight: '85vh',
            overflowY: 'auto',
            borderRadius: 3,
            zIndex: 1001,
            WebkitOverflowScrolling: 'touch',

            // ── Parchment image as background ──
            backgroundImage: 'url("/images/letter-paper.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',

            boxShadow: `
              0 0 0 1px rgba(100,75,40,0.5),
              0 40px 80px rgba(0,0,0,0.80),
              0 0 60px rgba(180,130,50,0.12)
            `,
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          {/* Subtle top gradient so text always readable on the lighter
              top portion of the parchment image */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '35%',
              background: 'linear-gradient(to bottom, rgba(195,165,110,0.15) 0%, transparent 100%)',
              pointerEvents: 'none',
              borderRadius: '3px 3px 0 0',
              zIndex: 1,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 18,
              right: 20,
              background: 'none',
              border: 'none',
              fontSize: 22,
              // Dark brown — readable on warm parchment
              color: 'rgba(80,55,25,0.55)',
              cursor: 'pointer',
              lineHeight: 1,
              padding: 0,
              zIndex: 10,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(40,20,5,0.90)'}
            onMouseLeave={e => e.target.style.color = 'rgba(80,55,25,0.55)'}
          >
            ×
          </button>

          {/* All content sits above the gradient overlay */}
          <div style={{ position: 'relative', zIndex: 2 }}>

            {/* Date — top right */}
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                // Dark brown — NOT the CSS variable (that's near-white)
                color: 'rgba(80,55,25,0.65)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textAlign: 'right',
                marginBottom: 24,
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
                color: 'rgba(45,28,8,0.88)',
                marginBottom: 20,
                lineHeight: 1.4,
              }}
            >
              {letter.salutation}
            </p>

            {/* Body paragraphs — typewriter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {letter.body.map((_, pi) => (
                <p
                  key={pi}
                  style={{
                    fontFamily: "'Crimson Pro', Georgia, serif",
                    fontSize: 'clamp(15px, 2vw, 17px)',
                    lineHeight: 2.05,
                    color: 'rgba(40,25,8,0.82)',
                    minHeight: '1.5em',
                    letterSpacing: '0.01em',
                  }}
                >
                  {displayed[pi] || ''}
                  {/* Blinking cursor on the paragraph currently typing */}
                  {pi === Math.min(
                    letter.body.length - 1,
                    displayed.length > 0 ? displayed.length - 1 : 0
                  ) && displayed[pi] !== letter.body[pi] && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginLeft: 1,
                        color: 'rgba(80,55,25,0.45)',
                        animation: 'blink 0.9s ease-in-out infinite',
                      }}
                    >|</span>
                  )}
                </p>
              ))}
            </div>

            {/* Sign-off */}
            <p
              style={{
                marginTop: 32,
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 18,
                color: 'rgba(60,38,14,0.72)',
                textAlign: 'right',
              }}
            >
              {letter.signoff}
            </p>

            {/* Invisible bottom sentinel for "read" detection */}
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
        onClick={handleClick}
        style={{
          position: 'relative',
          width: '100%',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transform: isLocked ? 'none' : undefined,
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
            background: 'var(--paper-dark)',
            border: '1px solid rgba(139,109,74,0.18)',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.04)',
            overflow: 'visible',
          }}
        >
          {/* Inner fold lines */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 2 }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 0 60px 80px',
              borderColor: 'transparent transparent rgba(0,0,0,0.08) transparent',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 80px 60px 0',
              borderColor: 'transparent rgba(0,0,0,0.08) transparent transparent',
            }} />
          </div>

          {/* Flap */}
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '48%',
              background: 'var(--paper-mid)',
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 70%)',
              zIndex: 2,
              transformOrigin: 'top center',
              transform: flapOpen
                ? 'perspective(600px) rotateX(-175deg)'
                : 'perspective(600px) rotateX(0deg)',
              transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderBottom: '1px solid rgba(0,0,0,0.2)',
            }}
          />

          <WaxSeal locked={isLocked} read={read} />

          {/* Address label */}
          <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 1 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>To:</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6 }}>you</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>From:</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>someone who waited</p>
          </div>

          {/* Stamp */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            width: 36, height: 44,
            border: '1.5px solid rgba(139,109,74,0.25)',
            borderRadius: 2,
            background: 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 0 0 2px var(--bg-elevated), 0 0 0 1px rgba(139,109,74,0.15)',
            zIndex: 1,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, color: 'var(--text-ghost)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              no. {index + 1}
            </span>
          </div>

          {isLocked && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)', borderRadius: 2, zIndex: 4 }} />
          )}
        </div>

        {isLocked && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontStyle: 'italic', fontSize: 13,
            color: 'var(--text-tertiary)',
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
