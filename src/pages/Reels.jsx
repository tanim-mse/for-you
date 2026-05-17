import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CandleParticles from '../components/CandleParticles'
import Ornament from '../components/Ornament'
import { reels } from '../data/reels'

// ── Play button ───────────────────────────────────────────────────────────────
function PlayButton() {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(255,220,150,0.10)',
        border: '1px solid rgba(255,220,150,0.28)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Triangle */}
      <div style={{
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '7px 0 7px 13px',
        borderColor: 'transparent transparent transparent rgba(255,220,150,0.8)',
        marginLeft: 2,
      }} />
    </div>
  )
}

// ── External link icon ────────────────────────────────────────────────────────
function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block' }}>
      <path
        d="M5.5 2.5H2.5A1 1 0 001.5 3.5v8a1 1 0 001 1h8a1 1 0 001-1V8.5M8.5 1.5h4m0 0v4m0-4L6 8"
        stroke="var(--text-tertiary)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ── YouTube lightbox ──────────────────────────────────────────────────────────
function YoutubeLightbox({ reel, onClose }) {
  // Swipe down to close on mobile
  const touchStart = useRef(0)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      onTouchStart={e => { touchStart.current = e.touches[0].clientY }}
      onTouchEnd={e => {
        if (e.changedTouches[0].clientY - touchStart.current > 80) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,5,2,0.93)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'none',
          border: 'none',
          color: 'var(--text-tertiary)',
          fontSize: 24,
          cursor: 'pointer',
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        ×
      </button>

      {/* iframe container */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(840px, 92vw)',
          aspectRatio: '16/9',
          background: '#000',
          borderRadius: 3,
          boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${reel.id}?autoplay=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="video"
        />
      </motion.div>

      {/* Caption below iframe */}
      <div
        style={{
          maxWidth: 560,
          marginTop: 20,
          textAlign: 'left',
          width: '100%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.8,
          color: 'var(--text-secondary)',
        }}>
          {reel.caption}
        </p>
      </div>
    </motion.div>
  )
}

// ── External interstitial (Instagram / Facebook) ──────────────────────────────
function ExternalInterstitial({ reel, onClose }) {
  const platform = reel.type === 'instagram' ? 'Instagram' : 'Facebook'

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,5,2,0.90)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          background: 'none',
          border: 'none',
          color: 'var(--text-tertiary)',
          fontSize: 24,
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 20,
          color: 'var(--text-primary)',
          marginBottom: 24,
        }}>
          এটা {platform}-এ আছে।
        </p>

        <motion.button
          onClick={() => window.open(reel.url, '_blank')}
          whileHover={{
            backgroundColor: 'rgba(255,220,150,0.04)',
            borderColor: 'rgba(212,149,106,0.5)',
          }}
          style={{
            background: 'transparent',
            border: '1px solid rgba(139,109,74,0.35)',
            borderRadius: 2,
            padding: '11px 28px',
            color: 'var(--text-secondary)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.35s ease',
          }}
        >
          খুলে দেখো ↗
        </motion.button>

        <p style={{
          marginTop: 12,
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--text-tertiary)',
        }}>
          কিছু জিনিস এখানে ধরা যায় না।
        </p>
      </motion.div>
    </motion.div>
  )
}

// ── Single reel card ──────────────────────────────────────────────────────────
function ReelCard({ reel, onOpen, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isYoutube   = reel.type === 'youtube'
  const platformLabel = reel.type === 'youtube'
    ? 'VIA YOUTUBE'
    : reel.type === 'instagram'
    ? 'VIA INSTAGRAM'
    : 'VIA FACEBOOK'

  return (
    <div
      ref={ref}
      onClick={() => onOpen(reel)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hovered ? 'rgba(212,149,106,0.22)' : 'rgba(139,109,74,0.10)'}`,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,109,74,0.12)'
          : 'none',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, opacity 0.6s ease',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Thumbnail area */}
      <div style={{ aspectRatio: '16/9', position: 'relative', background: 'var(--bg-elevated)' }}>

        {isYoutube ? (
          <>
            {/* YouTube thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${reel.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            {/* Warm tint overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(12,8,4,0.28)',
              mixBlendMode: 'multiply',
            }} />
            {/* Play button */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}>
              <PlayButton />
            </div>
          </>
        ) : (
          // Instagram / Facebook placeholder
          <div style={{
            width: '100%',
            height: '100%',
            background: 'var(--paper-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 18,
              color: 'var(--text-tertiary)',
            }}>
              {reel.type === 'instagram' ? 'Instagram' : 'Facebook'}
            </span>
            <ExternalIcon />
          </div>
        )}
      </div>

      {/* Caption area */}
      <div style={{ padding: '14px 16px 18px' }}>
        {/* Source badge */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.16em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          {platformLabel}
        </p>

        {/* Caption — what you thought when you found it */}
        <p style={{
          fontFamily: "'Crimson Pro', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.72,
          color: 'var(--text-secondary)',
        }}>
          {reel.caption}
        </p>

        {/* Saved note */}
        <div style={{
          marginTop: 10,
          borderTop: '1px solid rgba(139,109,74,0.12)',
          paddingTop: 8,
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            color: 'var(--text-tertiary)',
          }}>
            {reel.saved}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Page header ───────────────────────────────────────────────────────────────
function ReelsHeader() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(id)
  }, [])

  const fade = (delay) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
  })

  return (
    <div style={{ paddingTop: 100, textAlign: 'center', position: 'relative', zIndex: 3 }}>
      <div style={fade(0)}><Ornament width={120} opacity={0.5} /></div>

      <p style={{
        ...fade(150),
        marginTop: 16,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 13,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        display: 'block',
      }}>
        তোমার জন্য সেভ করা
      </p>

      <h1 style={{
        ...fade(250),
        marginTop: 6,
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        display: 'block',
      }}>
        যেগুলো তোমার কথা মনে করিয়ে দিয়েছিল।
      </h1>

      <p style={{
        ...fade(350),
        marginTop: 8,
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontStyle: 'italic',
        fontSize: 15,
        color: 'var(--text-secondary)',
        display: 'block',
      }}>
        তোমার কথা ভাবতে ভাবতে।
      </p>
    </div>
  )
}

// ── Reels page ────────────────────────────────────────────────────────────────
export default function Reels() {
  const [lightbox, setLightbox]       = useState(null)
  const [interstitial, setInterstitial] = useState(null)

  const handleOpen = (reel) => {
    if (reel.type === 'youtube') {
      setLightbox(reel)
    } else {
      setInterstitial(reel)
    }
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
      {/* Candle ambient */}
      <div className="candle-ambient" style={{ position: 'fixed', inset: 0, zIndex: 1 }} />
      <CandleParticles count={20} />

      <div style={{ position: 'relative', zIndex: 3 }}>
        <ReelsHeader />

        {/* Grid */}
        <div
          className="reels-grid"
          style={{
            maxWidth: 1080,
            margin: '48px auto 0',
            padding: '0 24px 100px',
          }}
        >
          {reels.map((reel, i) => (
            <ReelCard key={i} reel={reel} index={i} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <YoutubeLightbox reel={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      {/* External interstitial */}
      <AnimatePresence>
        {interstitial && (
          <ExternalInterstitial reel={interstitial} onClose={() => setInterstitial(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
