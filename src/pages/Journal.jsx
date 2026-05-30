// src/pages/Journal.jsx
// The cover page. Clicking "Open the Journal" or scrolling mounts the BookJournal overlay.
// Everything inside the book (text, memories, timeline) is in BookJournal.jsx.
// All other site sections (Letters, Reels, Birthday, etc.) are completely unchanged.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CandleParticles from '../components/CandleParticles'
import Ornament from '../components/Ornament'
import BookJournal from '../components/BookJournal'

// ── Constants (keep in sync with BookJournal.jsx) ─────────────────────────────
const HER_NAME   = 'Nurin'
const BIRTH_YEAR = 2004

// ── Scroll chevron ─────────────────────────────────────────────────────────────
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

// ── Cover section ─────────────────────────────────────────────────────────────
function CoverSection({ onOpen }) {
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

      {/* Her name */}
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

      {/* Open the Journal — scroll indicator / clickable trigger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
        onClick={onOpen}
        style={{
          marginTop: 32, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          // Subtle hover lift
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
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

// ── Journal page root ──────────────────────────────────────────────────────────
export default function Journal() {
  const [bookOpen, setBookOpen] = useState(false)

  // Also open on scroll past 80vh
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.75 && !bookOpen) {
        setBookOpen(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [bookOpen])

  const openBook  = () => setBookOpen(true)
  const closeBook = () => {
    setBookOpen(false)
    // Scroll back to top of cover when closing
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-base)',
        position: 'relative',
        // Prevent body scroll while book is open
        overflow: bookOpen ? 'hidden' : 'visible',
      }}
    >
      {/* Candle ambient */}
      <div className="candle-ambient" style={{ position: 'fixed', inset: 0, zIndex: 1 }} />

      {/* Particles */}
      <CandleParticles count={30} />

      {/* Cover — always rendered beneath the book */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <CoverSection onOpen={openBook} />
      </div>

      {/* Book overlay — mounts/unmounts with AnimatePresence */}
      <AnimatePresence>
        {bookOpen && (
          <BookJournal key="book" onClose={closeBook} />
        )}
      </AnimatePresence>
    </div>
  )
}
