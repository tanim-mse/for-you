// src/components/BookJournal.jsx
// Fixed version — resolves "can't access property setDensity, this.pages[0] is undefined"
// Root cause: loadFromHTML() was called before React painted the DOM.
// Fix: use requestAnimationFrame to guarantee DOM is fully painted, then init.

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageFlip } from 'page-flip'
import { buildPageList } from '../utils/paginate'
import BookPage from './BookPage'
import Ornament from './Ornament'

// ── Constants ──────────────────────────────────────────────────────────────────
const HER_NAME   = 'Her Name'       // ← keep in sync with Journal.jsx
const BIRTH_YEAR = 2004

const OPENING_LINES = [
  'I never planned to write any of this down.',
  "But some feelings don't ask permission.",
]

const BODY_PARAGRAPHS = [
  "Maybe you're reading this on the same day I shared it with you. Or maybe years have already passed, I'm not alive, and the world looks completely different now. Either way, I hope you still have that smile. The one that somehow made everything feel a little lighter just by existing.",
  "By the way... Happy Birthday, Ma'am.",
  "I know you don't want to see me or talk to me. This isn't meant to change anything. I know that. I just realized somewhere along the way that some things deserve to be said, even when the right moment has already passed. And somehow, saying them out loud isn't something I can do anymore.",
  "I never needed anything from you. I never really did. I just always wanted to see you happy. I still do. That part never changed, no matter how much everything else did.",
  "I always wished you could truly see how much you meant to me. Because even in what I thought could've been my last moment, during that accident... you were there too.",
  "Maybe that says more than I ever could.",
  "I hope you'll have a great time here.",
]

const fonts = {
  playfair: "'Playfair Display', Georgia, serif",
  garamond: "'EB Garamond', Georgia, serif",
  crimson:  "'Crimson Pro', Georgia, serif",
  dm:       "'DM Sans', sans-serif",
}

// ── Page content components ────────────────────────────────────────────────────

function BlankPageContent() {
  return <div style={{ width: '100%', height: '100%' }} />
}

function TitlePageContent() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <Ornament width={120} opacity={0.45} />
      <p style={{ marginTop: 18, fontFamily: fonts.playfair, fontStyle: 'italic',
        fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.30em',
        textTransform: 'uppercase' }}>
        A Journal
      </p>
      <h1 style={{ marginTop: 14, fontFamily: fonts.playfair,
        fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
        textShadow: '0 0 60px rgba(255,180,60,0.15)', lineHeight: 1.1 }}>
        {HER_NAME}
      </h1>
      <p style={{ marginTop: 16, fontFamily: fonts.garamond, fontStyle: 'italic',
        fontSize: 15, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
        Written across six years.
      </p>
      <div style={{ marginTop: 28, opacity: 0.35 }}>
        <Ornament width={80} opacity={1} />
      </div>
      <p style={{ marginTop: 24, fontFamily: fonts.dm, fontSize: 9, fontWeight: 300,
        color: 'var(--text-tertiary)', letterSpacing: '0.20em', textTransform: 'uppercase' }}>
        Born the 3rd of June, {BIRTH_YEAR}
      </p>
    </div>
  )
}

function OpeningPageContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 40, bottom: 48,
        width: 1, background: 'var(--ink-faded)', opacity: 0.18 }} />
      <p style={{ fontFamily: fonts.dm, fontSize: 9, color: 'var(--text-tertiary)',
        letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 22 }}>
        {BIRTH_YEAR} · June 3rd
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {OPENING_LINES.map((line, i) => (
          <p key={i} style={{ fontFamily: fonts.garamond, fontStyle: 'italic',
            fontSize: 'clamp(16px, 2.2vw, 22px)', lineHeight: 1.65,
            color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

function OpeningBodyContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-start', paddingTop: 12, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 40, bottom: 48,
        width: 1, background: 'var(--ink-faded)', opacity: 0.18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {BODY_PARAGRAPHS.map((para, i) => (
          <p key={i} style={{ fontFamily: fonts.crimson, fontSize: 13,
            lineHeight: 1.9, color: 'var(--text-secondary)', letterSpacing: '0.008em' }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

function TimelineHeaderContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <p style={{ fontFamily: fonts.playfair, fontStyle: 'italic', fontSize: 11,
        color: 'var(--text-tertiary)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        chapters
      </p>
      <h2 style={{ marginTop: 8, fontFamily: fonts.playfair,
        fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 500,
        color: 'var(--text-primary)', lineHeight: 1.3 }}>
        The years, as I remember them.
      </h2>
      <div style={{ marginTop: 22 }}>
        <Ornament width={100} opacity={0.35} />
      </div>
    </div>
  )
}

function TimelineYearContent({ page }) {
  const { year, chapter, title, bodyChunk, isFirst, isLast, image } = page
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden' }}>
      {/* Ghost year */}
      <div style={{ position: 'absolute', top: -10, right: -6,
        fontFamily: fonts.playfair, fontSize: 'clamp(44px, 6vw, 68px)',
        fontWeight: 700, color: 'var(--text-ghost)', opacity: 0.10,
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
        {year}
      </div>
      {/* Top rule */}
      <div style={{ width: '100%', height: 1,
        background: 'linear-gradient(to right, var(--ink-faded), transparent)',
        opacity: 0.22, marginBottom: 18, flexShrink: 0 }} />
      {isFirst && (
        <p style={{ fontFamily: fonts.dm, fontSize: 8, letterSpacing: '0.18em',
          color: 'var(--text-tertiary)', textTransform: 'uppercase',
          marginBottom: 5, flexShrink: 0 }}>
          Chapter {chapter}
        </p>
      )}
      {isFirst && (
        <h3 style={{ fontFamily: fonts.playfair, fontStyle: 'italic',
          fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 400,
          color: 'var(--text-primary)', lineHeight: 1.3,
          marginBottom: 14, flexShrink: 0 }}>
          {title}
        </h3>
      )}
      {!isFirst && (
        <p style={{ fontFamily: fonts.dm, fontSize: 8, color: 'var(--text-ghost)',
          letterSpacing: '0.10em', marginBottom: 10, opacity: 0.45, flexShrink: 0 }}>
          {year} (cont.)
        </p>
      )}
      <p style={{ fontFamily: fonts.crimson, fontSize: 12.5, lineHeight: 1.92,
        color: 'var(--text-secondary)', letterSpacing: '0.008em', flex: 1 }}>
        {bodyChunk}
      </p>
      {isLast && (
        <div style={{ marginTop: 14, width: 150, aspectRatio: '3/2',
          background: 'var(--bg-elevated)',
          border: '1px dashed rgba(139,109,74,0.18)', borderRadius: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0 }}>
          {image
            ? <img src={image} alt={`${year}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />
            : <span style={{ fontFamily: fonts.crimson, fontStyle: 'italic', fontSize: 9,
                color: 'var(--text-ghost)', opacity: 0.5, textAlign: 'center', padding: '0 6px' }}>
                [ a moment from {year} ]
              </span>
          }
        </div>
      )}
    </div>
  )
}

function MemoriesHeaderContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <p style={{ fontFamily: fonts.playfair, fontStyle: 'italic', fontSize: 11,
        color: 'var(--text-tertiary)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        fragments
      </p>
      <h2 style={{ marginTop: 8, fontFamily: fonts.playfair,
        fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 500,
        color: 'var(--text-primary)', lineHeight: 1.3 }}>
        Things I still carry.
      </h2>
      <div style={{ marginTop: 22 }}>
        <Ornament width={100} opacity={0.35} />
      </div>
    </div>
  )
}

function MemoryCardContent({ card, rotation, tabColor }) {
  return (
    <div style={{ height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '80%', maxWidth: 190,
        transform: `rotate(${rotation}deg)`, position: 'relative',
        filter: 'drop-shadow(0 5px 14px rgba(0,0,0,0.42))' }}>
        {/* Sticky tab */}
        <div style={{ position: 'absolute', top: -11, left: '50%',
          transform: 'translateX(-50%)', width: 44, height: 13,
          backgroundColor: tabColor, borderRadius: '2px 2px 0 0',
          opacity: 0.82, boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.12)' }} />
        {/* Card body */}
        <div style={{
          backgroundColor: 'var(--paper-dark)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"), linear-gradient(135deg, var(--bg-surface) 0%, var(--paper-dark) 100%)`,
          backgroundSize: '150px 150px, 100% 100%',
          border: '1px solid rgba(139,109,74,0.18)',
          borderRadius: 2, padding: '17px 17px 20px', position: 'relative' }}>
          <p style={{ fontFamily: fonts.dm, fontSize: 7.5, letterSpacing: '0.22em',
            color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 9 }}>
            {card.date}
          </p>
          <p style={{ fontFamily: fonts.garamond, fontStyle: 'italic',
            fontSize: 12.5, lineHeight: 1.70, color: 'var(--text-primary)' }}>
            {card.quote}
          </p>
          {card.note && <>
            <div style={{ height: 1, background: 'var(--ink-faded)',
              opacity: 0.13, margin: '10px 0' }} />
            <p style={{ fontFamily: fonts.crimson, fontStyle: 'italic',
              fontSize: 10.5, lineHeight: 1.58, color: 'var(--text-secondary)' }}>
              {card.note}
            </p>
          </>}
          <span style={{ position: 'absolute', bottom: 7, right: 9,
            fontSize: 7.5, color: 'var(--gold-muted)', opacity: 0.38 }}>✦</span>
        </div>
      </div>
    </div>
  )
}

function BackCoverContent() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1A0F06',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 18, color: 'var(--gold-muted)', opacity: 0.55 }}>✦</span>
    </div>
  )
}

function PageContent({ page }) {
  switch (page.type) {
    case 'blank': case 'blank-end': return <BlankPageContent />
    case 'title':           return <TitlePageContent />
    case 'opening':         return <OpeningPageContent />
    case 'opening-body':    return <OpeningBodyContent />
    case 'timeline-header': return <TimelineHeaderContent />
    case 'timeline-year':   return <TimelineYearContent page={page} />
    case 'memories-header': return <MemoriesHeaderContent />
    case 'memory':          return <MemoryCardContent card={page.card} rotation={page.rotation} tabColor={page.tabColor} />
    case 'back-cover':      return <BackCoverContent />
    default:                return null
  }
}

// ── BookJournal ────────────────────────────────────────────────────────────────
export default function BookJournal({ onClose }) {
  const bookContainerRef = useRef(null)
  const pageFlipRef      = useRef(null)
  const rafRef           = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isReady, setIsReady]         = useState(false)
  const [showClose, setShowClose]     = useState(false)
  const [isMobile, setIsMobile]       = useState(window.innerWidth < 640)

  const pages      = useRef(buildPageList()).current
  const totalPages = pages.length

  // Show close button after 1.2s
  useEffect(() => {
    const t = setTimeout(() => setShowClose(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // ── THE FIX: wait for two animation frames before init ─────────────────────
  // React paints to DOM after the render, but before the browser has committed
  // the pixels. requestAnimationFrame fires after paint. We wait for TWO frames
  // to be absolutely sure all child divs are in the DOM before PageFlip scans.
  useEffect(() => {
    const container = bookContainerRef.current
    if (!container) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    // For desktop: StPageFlip uses "width" as the width of ONE page.
    // The full book (two pages side by side) will be 2× this value.
    const pageW = isMobile
      ? Math.min(vw * 0.94, 400)
      : Math.min(Math.floor(vw * 0.42), 420)
    const pageH = isMobile
      ? Math.min(vh * 0.80, 580)
      : Math.min(Math.floor(vh * 0.82), 620)

    let frame1 = null
    let frame2 = null

    frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        // Confirm pages are actually in the DOM before handing to PageFlip
        const pageEls = container.querySelectorAll('.pf-page')
        if (pageEls.length === 0) {
          console.warn('[BookJournal] No .pf-page elements found — check render')
          return
        }

        try {
          const pf = new PageFlip(container, {
            width:               pageW,
            height:              pageH,
            size:                'fixed',
            minWidth:            180,
            maxWidth:            500,
            minHeight:           300,
            maxHeight:           700,
            drawShadow:          true,
            flippingTime:        750,
            usePortrait:         isMobile,
            startZIndex:         10,
            autoSize:            true,
            showPageCorners:     !isMobile,
            disableFlipByClick:  false,
            mobileScrollSupport: false,
            clickEventForward:   false,
            useMouseEvents:      true,
            swipeDistance:       30,
            showCover:           true,
            startPage:           0,
          })

          // loadFromHTML must receive a NodeList or Array of elements
          pf.loadFromHTML(pageEls)

          pf.on('flip', (e) => setCurrentPage(e.data))
          pf.on('init', () => setIsReady(true))

          pageFlipRef.current = pf
        } catch (err) {
          console.error('[BookJournal] PageFlip init failed:', err)
        }
      })
    })

    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
      try { pageFlipRef.current?.destroy() } catch (_) {}
    }
  // isMobile intentionally excluded — we only init once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goNext = useCallback(() => pageFlipRef.current?.flipNext(), [])
  const goPrev = useCallback(() => pageFlipRef.current?.flipPrev(), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(55,28,8,0.55) 0%, rgba(8,5,2,0.97) 70%)',
      }}
    >
      {/* Close button */}
      <AnimatePresence>
        {showClose && (
          <motion.button
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 20, right: 24,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: fonts.dm, fontSize: 22,
              color: 'var(--text-tertiary)', lineHeight: 1,
              padding: '4px 8px', zIndex: 10, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            aria-label="Close book"
          >×</motion.button>
        )}
      </AnimatePresence>

      {/* Tap zones */}
      <div onClick={goPrev} style={{ position: 'absolute', left: 0, top: 0,
        bottom: 0, width: '15%', cursor: 'w-resize', zIndex: 5 }} />
      <div onClick={goNext} style={{ position: 'absolute', right: 0, top: 0,
        bottom: 0, width: '15%', cursor: 'e-resize', zIndex: 5 }} />

      {/* Book container — PageFlip scans direct children with class .pf-page */}
      <div
        ref={bookContainerRef}
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {pages.map((page, i) => {
          const side        = i % 2 === 0 ? 'left' : 'right'
          const isHardPage  = ['blank', 'blank-end', 'back-cover'].includes(page.type)
          const isBackCover = page.type === 'back-cover'

          return (
            <div
              key={i}
              className="pf-page"
              data-density={isHardPage ? 'hard' : 'soft'}
            >
              {isBackCover
                ? <BackCoverContent />
                : (
                  <BookPage
                    side={side}
                    pageNumber={i > 0 && i < totalPages - 1 ? i : null}
                  >
                    <PageContent page={page} />
                  </BookPage>
                )
              }
            </div>
          )
        })}
      </div>

      {/* Page counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 0.55 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ position: 'absolute', bottom: 18, left: '50%',
          transform: 'translateX(-50%)', fontFamily: fonts.dm,
          fontSize: 9, color: 'var(--text-ghost)', letterSpacing: '0.14em',
          whiteSpace: 'nowrap', userSelect: 'none' }}
      >
        {currentPage + 1} / {totalPages}
      </motion.div>

      {/* First-open hint */}
      <AnimatePresence>
        {isReady && currentPage === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            style={{ position: 'absolute', bottom: 38, left: '50%',
              transform: 'translateX(-50%)', fontFamily: fonts.crimson,
              fontStyle: 'italic', fontSize: 11, color: 'var(--text-ghost)',
              letterSpacing: '0.08em', whiteSpace: 'nowrap', pointerEvents: 'none' }}
          >
            tap the edges or use arrow keys to turn pages
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
