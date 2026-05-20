import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import CandleParticles from '../components/CandleParticles'
import Candle from '../components/Candle'
import Ornament from '../components/Ornament'
import { playSfx } from '../utils/audio'

// ── Constants ──────────────────────────────────────────────────────────────────
const HER_NAME = 'Her Name'   // ← replace with her name
const HER_AGE  = 22           // ← replace: 2026 - 2004

// ── Birthday letter data — fill in Segment 13 ─────────────────────────────────
const BIRTHDAY_LETTER = {
  date:       'তোমার জন্মদিনে লেখা',
  salutation: 'তোমাকে,',
  body: [
    'এই চিঠিটা সবার শেষে লেখা। বাকি সব লেখা হয়ে যাওয়ার পর, যখন বুঝলাম পুরো জিনিসটা কী বলছে — তখন এটা লিখলাম।',
    'তোমার জন্মদিনে একটাই কথা বলার আছে। তুমি যে আছো, এই পৃথিবীতে, এই সময়ে — এটাই যথেষ্ট। শুধু তোমার থাকাটাই অনেক কিছু বদলে দিয়েছে, সেটা তুমি জানো না।',
    'ভালো থেকো। সত্যিকার অর্থে ভালো থেকো। এটুকুই চাই।',
  ],
  signoff: '— যে তোমার কথা মনে রাখে',
}

// ── Wish floating animation ───────────────────────────────────────────────────
function FloatingWish({ text, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -70 }}
      transition={{ duration: 2.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        textAlign: 'center',
        zIndex: 10,
      }}
    >
      <span style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 18,
        color: 'var(--text-secondary)',
      }}>
        {text}
      </span>
      {' '}
      <motion.span
        initial={{ opacity: 1, x: 0, y: 0 }}
        animate={{ opacity: 0, x: 12, y: -20 }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        style={{ fontSize: 10, color: 'var(--flame-warm)' }}
      >
        ✦
      </motion.span>
    </motion.div>
  )
}

// ── Birthday letter section ───────────────────────────────────────────────────
function BirthdayLetter({ onReadEnd }) {
  const bottomRef = useRef(null)
  const hasMarked = useRef(false)

  useEffect(() => {
    const el = bottomRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasMarked.current) {
          hasMarked.current = true
          localStorage.setItem('birthday_letter_read', 'true')
          onReadEnd()
        }
      },
      { threshold: 0.9 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onReadEnd])

  return (
    <div
      className="paper-card"
      style={{
        marginTop: 72,
        borderRadius: 3,
        padding: 'clamp(28px, 5vw, 48px) clamp(24px, 6vw, 44px)',
        textAlign: 'left',
      }}
    >
      {/* Date */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'right',
        marginBottom: 24,
      }}>
        {BIRTHDAY_LETTER.date}
      </p>

      {/* Salutation */}
      <p style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 22,
        color: 'var(--text-primary)',
        marginBottom: 20,
        lineHeight: 1.4,
      }}>
        {BIRTHDAY_LETTER.salutation}
      </p>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {BIRTHDAY_LETTER.body.map((para, i) => (
          <p key={i} style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: 'clamp(15px, 2vw, 17px)',
            lineHeight: 2.05,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em',
          }}>
            {para}
          </p>
        ))}
      </div>

      {/* Signoff */}
      <p style={{
        marginTop: 28,
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 17,
        color: 'var(--text-secondary)',
        textAlign: 'right',
      }}>
        {BIRTHDAY_LETTER.signoff}
      </p>

      {/* Invisible bottom sentinel */}
      <div ref={bottomRef} style={{ height: 1, marginTop: 8 }} />
    </div>
  )
}

// ── Birthday page ─────────────────────────────────────────────────────────────
export default function Birthday() {
  const [blown, setBlown]               = useState(false)
  const [showWishInput, setShowWishInput] = useState(false)
  const [showInstruct, setShowInstruct]   = useState(true)
  const [wish, setWish]                   = useState('')
  const [floatingWish, setFloatingWish]   = useState(null)
  const [wishSent, setWishSent]           = useState(false)
  const [letterRead, setLetterRead]       = useState(false)
  const [pulse, setPulse]                 = useState(false)
  const candleRef = useRef(null)

  // Fire candle blow sequence
  const handleBlow = () => {
    if (blown) return

    // Step 1 — flame out + candle SFX
    setBlown(true)
    playSfx('candle')
    localStorage.setItem('candle_blown', 'true')

    // Step 2 — confetti (200ms)
    setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#FFD97D', '#F5ECD7', '#E8A020', '#C4681A', '#FFF4CC'],
        gravity: 0.8,
        scalar: 0.85,
      })
    }, 200)

    // Step 3 — golden pulse (300ms)
    setTimeout(() => setPulse(true), 300)
    setTimeout(() => setPulse(false), 1300)

    // Step 5 — hide instruction + button (1000ms)
    setTimeout(() => setShowInstruct(false), 1000)

    // Step 6 — show wish input (1500ms)
    setTimeout(() => setShowWishInput(true), 1500)
  }

  // Submit wish — it disappears, never stored
  const handleWishSubmit = () => {
    if (!wish.trim()) return
    const wishText = wish.trim()
    setWish('')
    setShowWishInput(false)
    setFloatingWish(wishText)
  }

  const handleWishDone = () => {
    setFloatingWish(null)
    setTimeout(() => setWishSent(true), 300)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Warmer candle ambient for birthday */}
      <div
        className="candle-ambient"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: `radial-gradient(
            ellipse 80% 50% at 50% 100%,
            rgba(255, 180, 60, 0.20) 0%,
            rgba(200, 120, 30, 0.08) 45%,
            transparent 68%
          )`,
        }}
      />

      {/* Extra warm center glow */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `radial-gradient(
          ellipse 60% 40% at 50% 55%,
          rgba(220,140,30,0.08) 0%,
          transparent 60%
        )`,
      }} />

      {/* 50 particles — most celebratory */}
      <CandleParticles count={50} />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 560,
          margin: '0 auto',
          padding: '80px 24px 120px',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.20em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}>
            for {HER_NAME}, on her birthday
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          style={{
            marginTop: 12,
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(38px, 6vw, 50px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            textShadow: `
              0 0 60px rgba(255,180,60,0.20),
              0 0 120px rgba(255,160,40,0.10)
            `,
          }}
        >
          Happy Birthday.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.8 }}
        >
          <p style={{
            marginTop: 14,
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--text-secondary)',
          }}>
            You are {HER_AGE} today.
          </p>
          <p style={{
            marginTop: 4,
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--text-secondary)',
          }}>
            The world is better for it.
          </p>
        </motion.div>

        {/* Candle */}
        <motion.div
          ref={candleRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.1 }}
          style={{
            marginTop: 52,
            position: 'relative',
            display: 'inline-block',
          }}
        >
          {/* Golden pulse ring on blow */}
          <AnimatePresence>
            {pulse && (
              <motion.div
                initial={{ width: 40, height: 40, opacity: 0.5 }}
                animate={{ width: 400, height: 400, opacity: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  background: 'rgba(255,180,60,0.06)',
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          <Candle blown={blown} />
        </motion.div>

        {/* Instruction + blow button */}
        <AnimatePresence>
          {showInstruct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: 28 }}
            >
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 20,
                color: 'var(--text-secondary)',
                marginBottom: 18,
              }}>
                Make a wish.
              </p>

              <motion.button
                onClick={handleBlow}
                whileHover={{
                  backgroundColor: 'rgba(255,220,150,0.04)',
                  borderColor: 'rgba(212,149,106,0.5)',
                  boxShadow: '0 0 20px rgba(200,130,30,0.06)',
                }}
                transition={{ duration: 0.35 }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(139,109,74,0.30)',
                  borderRadius: 2,
                  padding: '11px 28px',
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Blow it out  ✦
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wish input */}
        <AnimatePresence>
          {showWishInput && !wishSent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                marginTop: 28,
                position: 'relative',
              }}
            >
              {/* Floating wish text */}
              <AnimatePresence>
                {floatingWish && (
                  <FloatingWish text={floatingWish} onDone={handleWishDone} />
                )}
              </AnimatePresence>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                marginBottom: 8,
                textAlign: 'left',
              }}>
                YOUR WISH
              </p>

              <input
                type="text"
                value={wish}
                onChange={e => setWish(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleWishSubmit()}
                placeholder="it stays between you and the stars..."
                className="auth-input"
                style={{
                  width: '100%',
                  padding: '9px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(139,109,74,0.25)',
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  fontSize: 16,
                  color: 'var(--text-primary)',
                  outline: 'none',
                  borderRadius: 0,
                  textAlign: 'left',
                }}
              />

              <motion.button
                onClick={handleWishSubmit}
                whileHover={{
                  backgroundColor: 'rgba(255,220,150,0.04)',
                  borderColor: 'rgba(212,149,106,0.5)',
                }}
                transition={{ duration: 0.35 }}
                style={{
                  marginTop: 16,
                  background: 'transparent',
                  border: '1px solid rgba(139,109,74,0.30)',
                  borderRadius: 2,
                  padding: '10px 24px',
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Send it up
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wish sent message */}
        <AnimatePresence>
          {wishSent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
              style={{
                marginTop: 28,
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 16,
                color: 'var(--text-secondary)',
              }}
            >
              It went somewhere good.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Birthday letter */}
        <BirthdayLetter onReadEnd={() => setLetterRead(true)} />

        {/* Secret nudge — only after both conditions met */}
        <AnimatePresence>
          {letterRead && blown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={{ marginTop: 32 }}
            >
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: 'var(--text-tertiary)',
                letterSpacing: '0.15em',
              }}>
              There's one more thing →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
