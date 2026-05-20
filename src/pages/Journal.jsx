import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import CandleParticles from '../components/CandleParticles'
import Ornament from '../components/Ornament'
import MemoryCard from '../components/MemoryCard'
import TimelineSection from '../components/TimelineSection'
import { memories } from '../data/memories'

// ── Constants ─────────────────────────────────────────────────────────────────
const HER_NAME    = 'Her Name'       // ← replace with her name
const BIRTH_YEAR  = 2004
const BIRTH_DATE  = 'June 3rd, 2004' // ← displayed on cover

const OPENING_LINES = [
  'I never planned to write any of this down.',
  "But some feelings don't ask permission.",
]

const BODY_PARAGRAPHS = [
  'Maybe you\'re reading this on the same day I shared it with you. Or maybe years have already passed, I\’m not alive, and the world looks completely different now. Either way, I hope you still have that smile. The one that somehow made everything feel a little lighter just by existing.',
'By the way... Happy Birthday, Ma\'am.',
'I know you don\'t want to see me or talk to me. This isn\'t meant to change anything. I know that. I just realized somewhere along the way that some things deserve to be said, even when the right moment has already passed. And somehow, saying them out loud isn\'t something I can do anymore.',
'I never needed anything from you. I never really did. I just always wanted to see you happy. I still do. That part never changed, no matter how much everything else did.',
'I always wished you could truly see how much you meant to me. Because even in what I thought could\'ve been my last moment, during that accident... you were there too.',

'Maybe that says more than I ever could.',
'I hope you\'ll have a great time here.',

]

const MARGIN_WORDS = ['years', 'still', 'always', 'why', 'you']

// ── Word-by-word reveal hook ──────────────────────────────────────────────────
function useWordReveal(ref, threshold = 0.2) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])

  return revealed
}

// ── Word-by-word text component ───────────────────────────────────────────────
function RevealText({ text, revealed, baseDelay = 0, style = {}, tag = 'span', className = '' }) {
  const words = text.split(' ')
  const Tag   = tag

  return (
    <Tag className={className} style={{ ...style, display: 'block' }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity:   revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(4px)',
            transition: `opacity 0.4s ease ${baseDelay + i * 80}ms, transform 0.4s ease ${baseDelay + i * 80}ms`,
            marginRight: '0.28em',
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  )
}

// ── Scroll indicator chevron ──────────────────────────────────────────────────
function ScrollChevron() {
  return (
    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        marginTop: 8,
        color: 'var(--text-tertiary)',
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      ↓
    </motion.div>
  )
}

// ── Section 1 — Cover ─────────────────────────────────────────────────────────
function CoverSection({ scrollToPage }) {
  const fade = (delay) => ({
    initial:    { opacity: 0, y: 8 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        position: 'relative',
      }}
    >
      {/* Top ornament */}
      <motion.div {...fade(0.5)}>
        <Ornament width={180} opacity={0.55} />
      </motion.div>

      {/* "A JOURNAL" */}
      <motion.p
        {...fade(0.7)}
        style={{
          marginTop: 14,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 15,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
        }}
      >
        A Journal
      </motion.p>

      {/* Her name — largest text on the site */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginTop: 16,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(40px, 8vw, 62px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          textShadow: '0 0 80px rgba(255,180,60,0.18)',
          textAlign: 'center',
        }}
      >
        {HER_NAME}
      </motion.h1>

      {/* "Written across six years." */}
      <motion.p
        {...fade(1.1)}
        style={{
          marginTop: 18,
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 20,
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em',
        }}
      >
        Written across six years.
      </motion.p>

      {/* Birth date */}
      <motion.p
        {...fade(1.3)}
        style={{
          marginTop: 36,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 300,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        Born the 3rd of June, {BIRTH_YEAR}
      </motion.p>

      {/* Bottom ornament */}
      <motion.div {...fade(1.5)} style={{ marginTop: 20 }}>
        <Ornament width={180} opacity={0.3} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        onClick={scrollToPage}
        style={{
          position: 'absolute',
          bottom: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.25em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          Open the Journal
        </span>
        <ScrollChevron />
      </motion.div>
    </section>
  )
}

// ── Section 2 — First page ────────────────────────────────────────────────────
function FirstPageSection() {
  const sectionRef = useRef(null)
  const revealed   = useWordReveal(sectionRef, 0.2)

  return (
    <section
      ref={sectionRef}
      style={{
        maxWidth: 640,
        margin: '0 auto',
        padding: '100px 48px 120px',
        position: 'relative',
      }}
    >
      {/* Faint top edge — suggests top of a page bleeding into darkness */}
      <div style={{
        position: 'absolute',
        top: 72,
        left: 24,
        right: 24,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(139,109,74,0.12), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Left margin line — the only "paper" signal needed */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 72,
          bottom: 80,
          width: 1,
          background: 'var(--ink-faded)',
          opacity: 0.2,
        }}
      >
        {MARGIN_WORDS.map((word, i) => (
          <div
            key={word}
            style={{
              position: 'absolute',
              top: `${12 + i * 17}%`,
              left: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ width: 10, height: 1, background: 'var(--text-ghost)', opacity: 0.4 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--text-ghost)',
              letterSpacing: '0.08em',
              opacity: 0.5,
            }}>
              {word}
            </span>
          </div>
        ))}
      </div>

      {/* Opening date */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 28,
      }}>
        {BIRTH_YEAR} · June 3rd
      </p>

      {/* Opening lines — word by word, large italic */}
      <div style={{ marginBottom: 40 }}>
        {OPENING_LINES.map((line, li) => {
          const wordsBeforeLine = OPENING_LINES
            .slice(0, li).join(' ').split(' ').filter(Boolean).length
          return (
            <RevealText
              key={li}
              text={line}
              revealed={revealed}
              baseDelay={wordsBeforeLine * 80}
              style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 32,
                lineHeight: 1.7,
                color: 'var(--text-primary)',
                letterSpacing: '0.01em',
                marginBottom: li < OPENING_LINES.length - 1 ? 4 : 0,
              }}
            />
          )
        })}
      </div>

      {/* Body paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {BODY_PARAGRAPHS.map((para, pi) => {
          const wordsBeforePara = [
            ...OPENING_LINES,
            ...BODY_PARAGRAPHS.slice(0, pi),
          ].join(' ').split(' ').filter(Boolean).length
          return (
            <RevealText
              key={pi}
              text={para}
              revealed={revealed}
              baseDelay={wordsBeforePara * 80 + 400}
              className={pi === 0 ? 'journal-first-para' : ''}
              style={{
                fontFamily: "'Crimson Pro', Georgia, serif",
                fontSize: 18,
                lineHeight: 2.15,
                color: 'var(--text-secondary)',
                letterSpacing: '0.008em',
              }}
            />
          )
        })}
      </div>

      {/* Faint bottom edge */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        left: 24,
        right: 24,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(139,109,74,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Page fade into next section */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        background: 'linear-gradient(to bottom, transparent 50%, var(--bg-base) 100%)',
        pointerEvents: 'none',
      }} />
    </section>
  )
}

// ── Section 3 — Memories header ───────────────────────────────────────────────
function MemoriesHeader() {
  const ref      = useRef(null)
  const revealed = useWordReveal(ref, 0.3)

  return (
    <div
      ref={ref}
      style={{
        paddingTop: 80,
        paddingBottom: 48,
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        fragments
      </p>
      <h2
        style={{
          marginTop: 6,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 34,
          fontWeight: 500,
          color: 'var(--text-primary)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
        }}
      >
        Things I still carry.
      </h2>
    </div>
  )
}

// ── Journal page root ─────────────────────────────────────────────────────────
export default function Journal() {
  const pageRef = useRef(null)

  const scrollToPage = () => {
    if (!pageRef.current) return
    pageRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        position: 'relative',
      }}
    >
      {/* Candle ambient */}
      <div className="candle-ambient" style={{ position: 'fixed', inset: 0, zIndex: 1 }} />

      {/* Particles */}
      <CandleParticles count={30} />

      {/* Content above particles */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Section 1 — Cover */}
        <CoverSection scrollToPage={scrollToPage} />

        {/* Section 2 — First page */}
        <div ref={pageRef}>
          <FirstPageSection />
        </div>

        {/* Section 3 — Memories header */}
        {/* Memory cards (Segment 5) and Timeline (Segment 6) will be added below */}
        <MemoriesHeader />

        {/* Section 4 — Memory cards masonry grid */}
        <div
          style={{
            maxWidth: 780,
            margin: '0 auto',
            padding: '0 24px 100px',
          }}
        >
          <div className="memory-masonry">
            {memories.map((memory, i) => (
              <MemoryCard key={i} memory={memory} index={i} />
            ))}
          </div>
        </div>

        {/* Segment 6 — Timeline */}
        <TimelineSection />
      </div>
    </div>
  )
}
