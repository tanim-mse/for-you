// src/components/BookJournal.jsx
// The real page-flip book. Mounts as a fixed overlay over the journal cover.
// Uses StPageFlip (npm: page-flip) for realistic page turns.
//
// INSTALL REQUIRED: npm install page-flip
//
// Page order: blank → title → opening → opening-body →
//             timeline-header → timeline years (multi-page per year) →
//             memories-header → memory cards (1 per page, paired as spreads) →
//             blank-end → back-cover

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageFlip } from 'page-flip'
import { buildPageList } from '../utils/paginate'
import BookPage from './BookPage'
import Ornament from './Ornament'

// ── Constants ──────────────────────────────────────────────────────────────────
const HER_NAME   = 'Her Name'       // ← same as Journal.jsx
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

// ── Shared text styles ─────────────────────────────────────────────────────────
const fonts = {
  playfair: "'Playfair Display', Georgia, serif",
  garamond: "'EB Garamond', Georgia, serif",
  crimson:  "'Crimson Pro', Georgia, serif",
  dm:       "'DM Sans', sans-serif",
}

// ── Page content components ────────────────────────────────────────────────────

function BlankPageContent() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Intentionally empty — endpaper */}
    </div>
  )
}

function TitlePageContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 0,
    }}>
      <Ornament width={120} opacity={0.45} />

      <p style={{
        marginTop: 18,
        fontFamily: fonts.playfair,
        fontStyle: 'italic',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
      }}>
        A Journal
      </p>

      <h1 style={{
        marginTop: 14,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(32px, 5vw, 48px)',
        fontWeight: 700,
        color: 'var(--text-primary)',
        letterSpacing: '-0.01em',
        textShadow: '0 0 60px rgba(255,180,60,0.15)',
        lineHeight: 1.1,
      }}>
        {HER_NAME}
      </h1>

      <p style={{
        marginTop: 16,
        fontFamily: fonts.garamond,
        fontStyle: 'italic',
        fontSize: 16,
        color: 'var(--text-secondary)',
        letterSpacing: '0.04em',
      }}>
        Written across six years.
      </p>

      <div style={{ marginTop: 32, opacity: 0.35 }}>
        <Ornament width={80} opacity={1} />
      </div>

      <p style={{
        marginTop: 28,
        fontFamily: fonts.dm,
        fontSize: 9,
        fontWeight: 300,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
      }}>
        Born the 3rd of June, {BIRTH_YEAR}
      </p>
    </div>
  )
}

function OpeningPageContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {/* Left margin line */}
      <div style={{
        position: 'absolute',
        left: 20,
        top: 48,
        bottom: 56,
        width: 1,
        background: 'var(--ink-faded)',
        opacity: 0.2,
      }} />

      <p style={{
        fontFamily: fonts.dm,
        fontSize: 9,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>
        {BIRTH_YEAR} · June 3rd
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {OPENING_LINES.map((line, i) => (
          <p key={i} style={{
            fontFamily: fonts.garamond,
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            lineHeight: 1.65,
            color: 'var(--text-primary)',
            letterSpacing: '0.01em',
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

function OpeningBodyContent() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 16 }}>
      {/* Left margin line */}
      <div style={{
        position: 'absolute',
        left: 20,
        top: 48,
        bottom: 56,
        width: 1,
        background: 'var(--ink-faded)',
        opacity: 0.2,
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {BODY_PARAGRAPHS.map((para, i) => (
          <p key={i} style={{
            fontFamily: fonts.crimson,
            fontSize: 14,
            lineHeight: 1.95,
            color: 'var(--text-secondary)',
            letterSpacing: '0.008em',
          }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

function TimelineHeaderContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: fonts.playfair,
        fontStyle: 'italic',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        chapters
      </p>
      <h2 style={{
        marginTop: 8,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(22px, 3vw, 30px)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        lineHeight: 1.3,
      }}>
        The years, as I remember them.
      </h2>
      <div style={{ marginTop: 24 }}>
        <Ornament width={100} opacity={0.35} />
      </div>
    </div>
  )
}

function TimelineYearContent({ page }) {
  const { year, chapter, title, bodyChunk, isFirst, isLast, hasImage, image } = page

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Ghost year — decorative background number */}
      <div style={{
        position: 'absolute',
        top: -8,
        right: -8,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(48px, 7vw, 72px)',
        fontWeight: 700,
        color: 'var(--text-ghost)',
        opacity: 0.12,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {year}
      </div>

      {/* Top divider line */}
      <div style={{
        width: '100%',
        height: 1,
        background: 'linear-gradient(to right, var(--ink-faded), transparent)',
        opacity: 0.25,
        marginBottom: 20,
        flexShrink: 0,
      }} />

      {/* Chapter label — only on first chunk of this year */}
      {isFirst && (
        <p style={{
          fontFamily: fonts.dm,
          fontSize: 9,
          letterSpacing: '0.18em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 6,
          flexShrink: 0,
        }}>
          Chapter {chapter}
        </p>
      )}

      {/* Year title — only on first chunk */}
      {isFirst && (
        <h3 style={{
          fontFamily: fonts.playfair,
          fontStyle: 'italic',
          fontSize: 'clamp(16px, 2.2vw, 22px)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginBottom: 16,
          flexShrink: 0,
        }}>
          {title}
        </h3>
      )}

      {/* Continuation marker — on non-first chunks */}
      {!isFirst && (
        <p style={{
          fontFamily: fonts.dm,
          fontSize: 9,
          color: 'var(--text-ghost)',
          letterSpacing: '0.12em',
          marginBottom: 12,
          opacity: 0.5,
          flexShrink: 0,
        }}>
          {year} (cont.)
        </p>
      )}

      {/* Body text */}
      <p style={{
        fontFamily: fonts.crimson,
        fontSize: 13,
        lineHeight: 1.95,
        color: 'var(--text-secondary)',
        letterSpacing: '0.008em',
        flex: 1,
        overflow: 'hidden',
      }}>
        {bodyChunk}
      </p>

      {/* Image placeholder — only on last chunk */}
      {isLast && (
        <div style={{
          marginTop: 16,
          width: '100%',
          maxWidth: 160,
          aspectRatio: '3/2',
          background: 'var(--bg-elevated)',
          border: '1px dashed rgba(139,109,74,0.18)',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {image ? (
            <img src={image} alt={`${year}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />
          ) : (
            <span style={{
              fontFamily: fonts.crimson,
              fontStyle: 'italic',
              fontSize: 10,
              color: 'var(--text-ghost)',
              opacity: 0.5,
              textAlign: 'center',
              padding: '0 8px',
            }}>
              [ a moment from {year} ]
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function MemoriesHeaderContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: fonts.playfair,
        fontStyle: 'italic',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        fragments
      </p>
      <h2 style={{
        marginTop: 8,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(22px, 3vw, 30px)',
        fontWeight: 500,
        color: 'var(--text-primary)',
        lineHeight: 1.3,
      }}>
        Things I still carry.
      </h2>
      <div style={{ marginTop: 24 }}>
        <Ornament width={100} opacity={0.35} />
      </div>
    </div>
  )
}

function MemoryCardContent({ card, rotation, tabColor }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* The sticky note card — rotated, with tab */}
      <div style={{
        width: '82%',
        maxWidth: 200,
        transform: `rotate(${rotation}deg)`,
        position: 'relative',
        // Drop shadow for lifted-off-page feel
        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45))',
      }}>
        {/* Sticky tab at top */}
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 14,
          backgroundColor: tabColor,
          borderRadius: '2px 2px 0 0',
          opacity: 0.85,
          // Subtle fold on the tab
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15)',
        }} />

        {/* Card body */}
        <div style={{
          backgroundColor: 'var(--paper-dark)',
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"),
            linear-gradient(135deg, var(--bg-surface) 0%, var(--paper-dark) 100%)
          `,
          backgroundSize: '150px 150px, 100% 100%',
          border: '1px solid rgba(139,109,74,0.2)',
          borderRadius: 2,
          padding: '18px 18px 22px',
          position: 'relative',
        }}>
          {/* Date label */}
          <p style={{
            fontFamily: fonts.dm,
            fontSize: 8,
            letterSpacing: '0.22em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {card.date}
          </p>

          {/* Quote */}
          <p style={{
            fontFamily: fonts.garamond,
            fontStyle: 'italic',
            fontSize: 13,
            lineHeight: 1.72,
            color: 'var(--text-primary)',
          }}>
            {card.quote}
          </p>

          {/* Optional note */}
          {card.note && (
            <>
              <div style={{
                height: 1,
                background: 'var(--ink-faded)',
                opacity: 0.15,
                margin: '12px 0',
              }} />
              <p style={{
                fontFamily: fonts.crimson,
                fontStyle: 'italic',
                fontSize: 11,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
              }}>
                {card.note}
              </p>
            </>
          )}

          {/* Corner mark */}
          <span style={{
            position: 'absolute',
            bottom: 8,
            right: 10,
            fontSize: 8,
            color: 'var(--gold-muted)',
            opacity: 0.4,
          }}>
            ✦
          </span>
        </div>
      </div>
    </div>
  )
}

function BackCoverContent() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1A0F06',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{
        fontSize: 20,
        color: 'var(--gold-muted)',
        opacity: 0.6,
      }}>
        ✦
      </span>
    </div>
  )
}

// ── Render a single page's content ────────────────────────────────────────────
function PageContent({ page }) {
  switch (page.type) {
    case 'blank':
    case 'blank-end':
      return <BlankPageContent />
    case 'title':
      return <TitlePageContent />
    case 'opening':
      return <OpeningPageContent />
    case 'opening-body':
      return <OpeningBodyContent />
    case 'timeline-header':
      return <TimelineHeaderContent />
    case 'timeline-year':
      return <TimelineYearContent page={page} />
    case 'memories-header':
      return <MemoriesHeaderContent />
    case 'memory':
      return <MemoryCardContent card={page.card} rotation={page.rotation} tabColor={page.tabColor} />
    case 'back-cover':
      return <BackCoverContent />
    default:
      return null
  }
}

// ── BookJournal — main exported component ─────────────────────────────────────
export default function BookJournal({ onClose }) {
  const bookContainerRef = useRef(null)
  const pageFlipRef      = useRef(null)
  const [currentPage, setCurrentPage]   = useState(0)
  const [isReady, setIsReady]           = useState(false)
  const [showClose, setShowClose]       = useState(false)
  const [isMobile, setIsMobile]         = useState(false)

  const pages = buildPageList()
  const totalPages = pages.length

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Show close button after 1.2s
  useEffect(() => {
    const t = setTimeout(() => setShowClose(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Initialize StPageFlip after mount
  useEffect(() => {
    if (!bookContainerRef.current) return

    // Compute book dimensions
    const vw = window.innerWidth
    const vh = window.innerHeight
    const bookWidth  = isMobile ? Math.min(vw * 0.96, 420) : Math.min(vw * 0.88, 880)
    const bookHeight = isMobile ? Math.min(vh * 0.82, 620) : Math.min(vh * 0.84, 640)

    const pf = new PageFlip(bookContainerRef.current, {
      width:       isMobile ? bookWidth       : bookWidth / 2,  // single page width
      height:      bookHeight,
      size:        'fixed',
      minWidth:    isMobile ? 280 : 200,
      maxWidth:    isMobile ? 500 : 600,
      minHeight:   400,
      maxHeight:   860,
      drawShadow:  true,
      flippingTime: 800,
      usePortrait: isMobile,
      startZIndex: 10,
      autoSize:    false,
      showPageCorners: true,
      disableFlipByClick: false,
      mobileScrollSupport: false,
      clickEventForward: false,
      useMouseEvents: true,
      swipeDistance: 30,
      showCover: true,
      startPage: 0,
    })

    pf.loadFromHTML(bookContainerRef.current.querySelectorAll('.stf__page'))

    pf.on('flip', (e) => {
      setCurrentPage(e.data)
    })

    pf.on('init', () => {
      setIsReady(true)
    })

    pageFlipRef.current = pf

    return () => {
      try { pf.destroy() } catch (_) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  const goNext = useCallback(() => {
    pageFlipRef.current?.flipNext()
  }, [])

  const goPrev = useCallback(() => {
    pageFlipRef.current?.flipPrev()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, onClose])

  const displayPage = isMobile ? currentPage + 1 : currentPage + 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 800,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Dark backdrop with warm center glow
        background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(60,30,10,0.6) 0%, rgba(8,5,2,0.97) 70%)',
      }}
    >
      {/* Close button */}
      <AnimatePresence>
        {showClose && (
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: fonts.dm,
              fontSize: 22,
              color: 'var(--text-tertiary)',
              lineHeight: 1,
              padding: '4px 8px',
              zIndex: 10,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            aria-label="Close book"
          >
            ×
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tap zones for page turning (sit above book, below close button) */}
      <div
        onClick={goPrev}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '18%',
          cursor: 'w-resize',
          zIndex: 5,
        }}
        aria-label="Previous page"
      />
      <div
        onClick={goNext}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '18%',
          cursor: 'e-resize',
          zIndex: 5,
        }}
        aria-label="Next page"
      />

      {/* The StPageFlip container — pages are direct children */}
      <div
        ref={bookContainerRef}
        style={{
          opacity: isReady ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {pages.map((page, i) => {
          const side = i % 2 === 0 ? 'left' : 'right'
          const isBackCover = page.type === 'back-cover'

          return (
            <div
              key={i}
              className="stf__page"
              data-density={
                page.type === 'blank' || page.type === 'blank-end' || isBackCover
                  ? 'hard'
                  : 'soft'
              }
              style={{ width: '100%', height: '100%' }}
            >
              {isBackCover ? (
                // Back cover: no BookPage wrapper, raw dark surface
                <BackCoverContent />
              ) : (
                <BookPage side={side} pageNumber={i > 0 && i < totalPages - 1 ? i : null}>
                  <PageContent page={page} />
                </BookPage>
              )}
            </div>
          )
        })}
      </div>

      {/* Page counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: fonts.dm,
          fontSize: 9,
          color: 'var(--text-ghost)',
          letterSpacing: '0.14em',
          opacity: 0.55,
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {displayPage} / {totalPages}
      </motion.div>

      {/* Hint text — first few seconds only */}
      <AnimatePresence>
        {isReady && currentPage === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              position: 'absolute',
              bottom: 36,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: fonts.crimson,
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--text-ghost)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            tap the edges or use arrow keys to turn pages
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
