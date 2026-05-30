import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import CandleParticles from '../components/CandleParticles'
import Candle from '../components/Candle'
import Ornament from '../components/Ornament'
import { playSfx } from '../utils/audio'

// ── Constants ──────────────────────────────────────────────────────────────────
const HER_NAME = 'Nurin...'   // ← replace with her name
const HER_AGE  = 22           // ← replace: 2026 - 2004

// ── Birthday letter data — fill in Segment 13 ─────────────────────────────────
const BIRTHDAY_LETTER = {
  date:       'জুন ০৩',
  salutation: 'প্রেয়সী,',
  body: [
    'শুভ জন্মদিন, ম্যাডাম। আল্লাহ্‌ তোমার স্বপ্ন পূরণ করুক, সব সময় নিরাপদ রাখুক। তোমার জীবন একদম হাসি খুশী তে ভরে উঠুক, আর সুবুদ্ধি দান করুক যেন সঠিক জিনিস ঠিকমতো দেখতে পারো। ',
    'আর হ্যাঁ! ছেলেদের থেকেও দূরে রাখুক। কোনো ছেলে, বা পুরুষ যেন তোমার পাশে দাড়াতে না পারে, আমি ব্যতীত। তোমার খারাপ লাগলেও সত্য যে, আমি তোমাকেই শুধু ভালোবাসি। আর কোনো ছেলে তোমার পাশে নিঃশ্বাস নিলেও সেটা আমার সহ্য হয়না। আমি জানি তুমি বুঝবে না হয়তো, এটাকেও খারাপ ভাবে নিয়ে ফেলতে পারো, তবুও বললাম। ',
    ' এছাড়াও একটা কথা না বললেই নয়, জীবনে অনেক পরীক্ষা আল্লাহ্‌ দেয় আমাদের কে যাচাই করার জন্য। জীবন শুধু হাসিখুশিতেই ভরে থাকেনা। আল্লাহ্‌ পরীক্ষা নেন বিপদ, ভুল বোঝাবুঝি দিয়ে। কিন্তু এসব দেয়ার মানে এই না যে দুই জন একে অপরের জন্য সঠিক না। দুইজন কিভাবে পরীক্ষার মুখামুখি হয়, এবং সমাধান করে, এটাই মুল পরীক্ষা। ভুল বোঝাবুঝি অস্বাভাবিক কিছুনা। ',
    ' যেকোনো সম্পর্কেই হতে পারে, তবে সেটার পর আমরা কিভাবে সামলে নেই, এটা আসল বিষয়। তুমি ভুল বুঝে এসব বললেও আমি আমার ভালোবাসার মানুষের ওপর গিভ আপ করবো না। ', 
    ' ভালো থেকো, নিজের বেশি বেশি যত্ন নিও। আর ছেলেদের থেকে দূরে থাকো। তুমি শুধু আমার ই…',
  ],
  signoff: '- তোমার অপেক্ষায় এক পাগল...',
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

// ── Typewriter cursor ─────────────────────────────────────────────────────────
const cursorStyle = {
  display: 'inline-block',
  width: '1.5px',
  height: '1em',
  background: 'rgba(60,38,14,0.6)',
  marginLeft: 2,
  verticalAlign: 'text-bottom',
  animation: 'tw-blink 0.65s step-end infinite',
}

// Inject blink keyframe once
if (typeof document !== 'undefined' && !document.getElementById('tw-blink-style')) {
  const s = document.createElement('style')
  s.id = 'tw-blink-style'
  s.textContent = `@keyframes tw-blink { 0%,100%{opacity:1} 50%{opacity:0} }`
  document.head.appendChild(s)
}

// ── Birthday letter section ───────────────────────────────────────────────────
function BirthdayLetter({ onReadEnd }) {
  // All paragraphs in order: salutation, body paragraphs, signoff
  const allParts = [
    BIRTHDAY_LETTER.salutation,
    ...BIRTHDAY_LETTER.body,
    BIRTHDAY_LETTER.signoff,
  ]

  const SPEED        = 22   // ms per character — increase to slow down
  const PARA_DELAY   = 320  // ms pause between paragraphs finishing and next starting

  const [typed, setTyped]         = useState([])   // fully typed paragraphs
  const [current, setCurrent]     = useState('')    // text being typed right now
  const [partIdx, setPartIdx]     = useState(0)     // which paragraph we're on
  const [done, setDone]           = useState(false) // all done
  const hasMarked                 = useRef(false)
  const timerRef                  = useRef(null)

  useEffect(() => {
    if (partIdx >= allParts.length) {
      setDone(true)
      if (!hasMarked.current) {
        hasMarked.current = true
        localStorage.setItem('birthday_letter_read', 'true')
        onReadEnd()
      }
      return
    }

    const fullText = allParts[partIdx]
    let i = 0
    setCurrent('')

    timerRef.current = setInterval(() => {
      i++
      setCurrent(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timerRef.current)
        // Pause, then commit this paragraph and move to next
        setTimeout(() => {
          setTyped(prev => [...prev, fullText])
          setCurrent('')
          setPartIdx(prev => prev + 1)
        }, PARA_DELAY)
      }
    }, SPEED)

    return () => clearInterval(timerRef.current)
  }, [partIdx])   // eslint-disable-line react-hooks/exhaustive-deps

  // Helpers to decide which typed parts are which
  const typedSalutation = typed[0]
  const typedBody       = typed.slice(1, 1 + BIRTHDAY_LETTER.body.length)
  const typedSignoff    = typed[1 + BIRTHDAY_LETTER.body.length]

  const isOnSalutation  = partIdx === 0
  const isOnBody        = partIdx >= 1 && partIdx <= BIRTHDAY_LETTER.body.length
  const isOnSignoff     = partIdx === allParts.length - 1
  const currentBodyIdx  = partIdx - 1   // which body paragraph is being typed

  const paraStyle = {
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontSize: 'clamp(15px, 2vw, 17px)',
    lineHeight: 1.75,
    color: 'rgba(40,25,8,0.82)',
    letterSpacing: '0.01em',
    minHeight: '1.75em',
  }

  return (
    <div
      className="birthday-letter"
      style={{
        marginTop: 72,
        borderRadius: 3,
        padding: 'clamp(28px, 5vw, 48px) clamp(24px, 6vw, 44px)',
        textAlign: 'left',
        position: 'relative',
        boxShadow: `
          0 0 0 1px rgba(100,75,40,0.45),
          0 20px 60px rgba(0,0,0,0.65),
          0 0 40px rgba(180,130,50,0.08)
        `,
      }}
    >
      {/* Subtle top gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '35%',
        background: 'linear-gradient(to bottom, rgba(195,165,110,0.15) 0%, transparent 100%)',
        pointerEvents: 'none',
        borderRadius: '3px 3px 0 0',
      }} />

      {/* Date — always visible immediately */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        color: 'rgba(80,55,25,0.65)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'right',
        marginBottom: 24,
        position: 'relative', zIndex: 1,
      }}>
        {BIRTHDAY_LETTER.date}
      </p>

      {/* Salutation */}
      <p style={{
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 22,
        color: 'rgba(45,28,8,0.88)',
        marginBottom: 20,
        lineHeight: 1.4,
        position: 'relative', zIndex: 1,
        minHeight: '1.4em',
      }}>
        {typedSalutation ?? (isOnSalutation ? current : '')}
        {isOnSalutation && <span style={cursorStyle} />}
      </p>

      {/* Body paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', zIndex: 1 }}>
        {BIRTHDAY_LETTER.body.map((_, i) => {
          const isCurrentPara = isOnBody && currentBodyIdx === i
          const text = typedBody[i] ?? (isCurrentPara ? current : '')
          const showCursor = isCurrentPara
          if (!text && !showCursor) return null
          return (
            <p key={i} style={paraStyle}>
              {text}
              {showCursor && <span style={cursorStyle} />}
            </p>
          )
        })}
      </div>

      {/* Signoff */}
      {(typedSignoff !== undefined || isOnSignoff) && (
        <p style={{
          marginTop: 28,
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 17,
          color: 'rgba(60,38,14,0.72)',
          textAlign: 'right',
          position: 'relative', zIndex: 1,
          minHeight: '1.4em',
        }}>
          {typedSignoff ?? (isOnSignoff ? current : '')}
          {isOnSignoff && <span style={cursorStyle} />}
        </p>
      )}

      {/* Small sentinel div — stays at bottom */}
      <div style={{ height: 1, marginTop: 8 }} />
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
            I hope you have a great day, my moody, sweet angry bird... 
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

        {/* Birthday letter — only reveals after candle is blown */}
        <AnimatePresence>
          {blown && (
            <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4, delay: 1.8 }}
>
  <BirthdayLetter onReadEnd={() => setLetterRead(true)} />
</motion.div>
          )}
        </AnimatePresence>

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
