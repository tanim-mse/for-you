// src/components/BookJournal.jsx
// Redesigned:
//   - Book cover uses the uploaded silhouette artwork (place it at /public/cover-art.jpg)
//   - Pages use warm parchment (#F5ECD7) with black/dark-brown text — actually readable
//   - Fonts are larger and warmer
//   - Cover is a proper book cover with title bottom-left
//   - Page flip mechanism unchanged (double-RAF fix intact)

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageFlip } from 'page-flip'
import { buildPageList } from '../utils/paginate'
import BookPage from './BookPage'
import Ornament from './Ornament'

// ── Constants ──────────────────────────────────────────────────────────────────
const HER_NAME   = 'Her Name'
const BIRTH_YEAR = 2004

const OPENING_LINES = [
  'I never planned to write any of this down.',
  "But some feelings don't ask permission.",
]

const BODY_PARAGRAPHS = [
  "Maybe you're reading this on the same day I shared it with you. Or maybe years have already passed, I'm not alive, and the world looks completely different now. Either way, I hope you still have that smile. The one that somehow made everything feel a little lighter just by existing.",
  "By the way... Happy Birthday, Madam.",
  "I know you don't want to see me or talk to me. This isn't meant to change anything. I know that. I just realized somewhere along the way that some things deserve to be said, even when the right moment has already passed. And somehow, saying them out loud isn't something I can do anymore.",
  "I never needed anything from you. I never really did. I just always wanted to see you happy. I still do. That part never changed, no matter how much everything else did.",
  "I always wished you could truly see how much you meant to me. Because even in what I thought could've been my last moment, during that accident... you were there too.",
  "Maybe that says more than I ever could.",
  "I hope you'll have a great time here.",
]

// ── Text style tokens — dark on parchment ─────────────────────────────────────
const ink = {
  primary:   '#1A0F06',   // near-black warm
  secondary: '#3D2208',   // dark brown
  muted:     '#7A5230',   // medium brown
  faint:     '#B8905A',   // light amber-brown
}
const fonts = {
  playfair: "'Playfair Display', Georgia, serif",
  garamond: "'EB Garamond', Georgia, serif",
  crimson:  "'Crimson Pro', Georgia, serif",
  dm:       "'DM Sans', sans-serif",
}

// ── Book Cover — uses the silhouette artwork ───────────────────────────────────
// Place your image at: /public/cover-art.jpg
// The image fills the cover. Title text is bottom-left, unobtrusive.
function BookCoverContent() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0D0A14',  // deep blue-black, matches the artwork mood
    }}>
      {/* The artwork — fills the entire cover */}
      <img
        src="/cover-art.jpg"
        alt="Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          display: 'block',
        }}
        onError={(e) => {
          // Fallback if image not placed yet — show a placeholder
          e.currentTarget.style.display = 'none'
        }}
      />

      {/* Subtle dark gradient at bottom — so text is legible over the image */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '45%',
        background: 'linear-gradient(to top, rgba(10,6,20,0.88) 0%, rgba(10,6,20,0.40) 60%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle top vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20%',
        background: 'linear-gradient(to bottom, rgba(10,6,20,0.45) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Title block — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        left: 28,
        right: 28,
      }}>
        {/* Thin decorative line above title */}
        <div style={{
          width: 40,
          height: 1,
          background: 'rgba(255,235,180,0.50)',
          marginBottom: 10,
        }} />

        {/* "A Journal" label */}
        <p style={{
          fontFamily: fonts.dm,
          fontSize: 9,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,235,180,0.60)',
          marginBottom: 5,
        }}>
          A Journal
        </p>

        {/* Her name — the title */}
        <h1 style={{
          fontFamily: fonts.playfair,
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: 400,
          color: 'rgba(255,248,220,0.92)',
          lineHeight: 1.15,
          letterSpacing: '0.02em',
          marginBottom: 6,
          textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        }}>
          {HER_NAME}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: fonts.garamond,
          fontStyle: 'italic',
          fontSize: 12,
          color: 'rgba(255,235,180,0.55)',
          letterSpacing: '0.05em',
        }}>
          Written across six years.
        </p>
      </div>
    </div>
  )
}

// ── Blank endpaper ─────────────────────────────────────────────────────────────
function BlankPageContent() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Endpaper — BookPage provides the parchment background */}
    </div>
  )
}

// ── Title page (first inside page) ────────────────────────────────────────────
function TitlePageContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <Ornament width={110} opacity={0.5} />

      <p style={{
        marginTop: 20,
        fontFamily: fonts.playfair,
        fontStyle: 'italic',
        fontSize: 11,
        color: ink.muted,
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
      }}>
        A Journal
      </p>

      <h1 style={{
        marginTop: 14,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(30px, 4.5vw, 46px)',
        fontWeight: 700,
        color: ink.primary,
        letterSpacing: '-0.01em',
        lineHeight: 1.1,
      }}>
        {HER_NAME}
      </h1>

      <p style={{
        marginTop: 14,
        fontFamily: fonts.garamond,
        fontStyle: 'italic',
        fontSize: 17,
        color: ink.secondary,
        letterSpacing: '0.04em',
      }}>
        Written across six years.
      </p>

      <div style={{ marginTop: 28 }}>
        <Ornament width={80} opacity={0.4} />
      </div>

      <p style={{
        marginTop: 24,
        fontFamily: fonts.dm,
        fontSize: 9,
        fontWeight: 300,
        color: ink.muted,
        letterSpacing: '0.20em',
        textTransform: 'uppercase',
      }}>
        Born the 3rd of June, {BIRTH_YEAR}
      </p>
    </div>
  )
}

// ── Opening lines page ─────────────────────────────────────────────────────────
function OpeningPageContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Red margin line — like a real journal/composition book */}
      <div style={{
        position: 'absolute',
        left: -12,
        top: 0,
        bottom: 0,
        width: 1,
        background: 'rgba(200,80,60,0.35)',
      }} />

      <p style={{
        fontFamily: fonts.dm,
        fontSize: 9,
        color: ink.faint,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 28,
      }}>
        {BIRTH_YEAR} · June 3rd
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {OPENING_LINES.map((line, i) => (
          <p key={i} style={{
            fontFamily: fonts.garamond,
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.8vw, 28px)',
            lineHeight: 1.55,
            color: ink.primary,
            letterSpacing: '0.01em',
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

// ── Body paragraphs page ───────────────────────────────────────────────────────
function OpeningBodyContent() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingTop: 8,
      position: 'relative',
    }}>
      {/* Red margin line */}
      <div style={{
        position: 'absolute',
        left: -12,
        top: 0,
        bottom: 0,
        width: 1,
        background: 'rgba(200,80,60,0.35)',
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {BODY_PARAGRAPHS.map((para, i) => (
          <p key={i} style={{
            fontFamily: fonts.crimson,
            fontSize: 'clamp(14px, 1.8vw, 17px)',
            lineHeight: 1.88,
            color: ink.secondary,
            letterSpacing: '0.010em',
          }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

// ── Section headers ────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}>
      <Ornament width={90} opacity={0.35} />
      <p style={{
        marginTop: 20,
        fontFamily: fonts.playfair,
        fontStyle: 'italic',
        fontSize: 11,
        color: ink.muted,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}>
        {eyebrow}
      </p>
      <h2 style={{
        marginTop: 10,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(22px, 3.2vw, 32px)',
        fontWeight: 500,
        color: ink.primary,
        lineHeight: 1.25,
      }}>
        {title}
      </h2>
      <div style={{ marginTop: 22 }}>
        <Ornament width={90} opacity={0.35} />
      </div>
    </div>
  )
}

// ── Timeline year entry ────────────────────────────────────────────────────────
function TimelineYearContent({ page }) {
  const { year, chapter, title, bodyChunk, isFirst, isLast, image } = page

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ghost year — large faded number in background */}
      <div style={{
        position: 'absolute',
        top: -14,
        right: -10,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(52px, 8vw, 80px)',
        fontWeight: 700,
        color: ink.faint,
        opacity: 0.13,
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {year}
      </div>

      {/* Top rule */}
      <div style={{
        width: '100%',
        height: 1,
        background: `linear-gradient(to right, ${ink.faint}, transparent)`,
        opacity: 0.4,
        marginBottom: 18,
        flexShrink: 0,
      }} />

      {/* Chapter label */}
      {isFirst && (
        <p style={{
          fontFamily: fonts.dm,
          fontSize: 9,
          letterSpacing: '0.18em',
          color: ink.muted,
          textTransform: 'uppercase',
          marginBottom: 5,
          flexShrink: 0,
        }}>
          Chapter {chapter}
        </p>
      )}

      {/* Year title */}
      {isFirst && (
        <h3 style={{
          fontFamily: fonts.playfair,
          fontStyle: 'italic',
          fontSize: 'clamp(16px, 2.4vw, 22px)',
          fontWeight: 400,
          color: ink.primary,
          lineHeight: 1.28,
          marginBottom: 16,
          flexShrink: 0,
        }}>
          {title}
        </h3>
      )}

      {/* Continuation note */}
      {!isFirst && (
        <p style={{
          fontFamily: fonts.garamond,
          fontStyle: 'italic',
          fontSize: 10,
          color: ink.faint,
          letterSpacing: '0.08em',
          marginBottom: 12,
          opacity: 0.7,
          flexShrink: 0,
        }}>
          {year}, continued...
        </p>
      )}

      {/* Body text */}
      <p style={{
        fontFamily: fonts.crimson,
        fontSize: 'clamp(13px, 1.7vw, 16px)',
        lineHeight: 1.92,
        color: ink.secondary,
        letterSpacing: '0.010em',
        flex: 1,
        overflow: 'hidden',
      }}>
        {bodyChunk}
      </p>

      {/* Image placeholder */}
      {isLast && (
        <div style={{
          marginTop: 16,
          width: 160,
          aspectRatio: '3/2',
          background: 'rgba(180,130,60,0.08)',
          border: '1px dashed rgba(140,90,30,0.25)',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {image
            ? <img src={image} alt={`${year}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }} />
            : <span style={{
                fontFamily: fonts.garamond,
                fontStyle: 'italic',
                fontSize: 10,
                color: ink.faint,
                opacity: 0.6,
                textAlign: 'center',
                padding: '0 8px',
              }}>
                [ a moment from {year} ]
              </span>
          }
        </div>
      )}
    </div>
  )
}

// ── Memory card — sticky note style, rotated ───────────────────────────────────
function MemoryCardContent({ card, rotation, tabColor }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '82%',
        maxWidth: 200,
        transform: `rotate(${rotation}deg)`,
        position: 'relative',
        filter: 'drop-shadow(0 6px 18px rgba(80,40,10,0.22))',
      }}>
        {/* Tab */}
        <div style={{
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 46,
          height: 13,
          backgroundColor: tabColor,
          borderRadius: '2px 2px 0 0',
          opacity: 0.9,
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.10)',
        }} />

        {/* Card body — warm cream */}
        <div style={{
          backgroundColor: '#FFF8ED',
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")
          `,
          backgroundSize: '150px 150px',
          border: '1px solid rgba(160,110,50,0.20)',
          borderRadius: 2,
          padding: '18px 18px 22px',
          position: 'relative',
        }}>
          {/* Faint ruled lines on the card */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 23px, rgba(140,90,30,0.07) 23px, rgba(140,90,30,0.07) 24px)',
            backgroundPosition: '0 38px',
            borderRadius: 2,
            pointerEvents: 'none',
          }} />

          <p style={{
            fontFamily: fonts.dm,
            fontSize: 7.5,
            letterSpacing: '0.22em',
            color: ink.muted,
            textTransform: 'uppercase',
            marginBottom: 10,
            position: 'relative',
          }}>
            {card.date}
          </p>

          <p style={{
            fontFamily: fonts.garamond,
            fontStyle: 'italic',
            fontSize: 13.5,
            lineHeight: 1.68,
            color: ink.primary,
            position: 'relative',
          }}>
            {card.quote}
          </p>

          {card.note && (
            <>
              <div style={{
                height: 1,
                background: 'rgba(140,90,30,0.15)',
                margin: '11px 0',
                position: 'relative',
              }} />
              <p style={{
                fontFamily: fonts.crimson,
                fontStyle: 'italic',
                fontSize: 11,
                lineHeight: 1.55,
                color: ink.secondary,
                position: 'relative',
              }}>
                {card.note}
              </p>
            </>
          )}

          <span style={{
            position: 'absolute',
            bottom: 7,
            right: 9,
            fontSize: 8,
            color: ink.muted,
            opacity: 0.45,
          }}>
            ✦
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Back cover ─────────────────────────────────────────────────────────────────
function BackCoverContent() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0D0A14',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{ fontSize: 20, color: 'rgba(255,235,180,0.35)' }}>✦</span>
    </div>
  )
}

// ── Router ─────────────────────────────────────────────────────────────────────
function PageContent({ page }) {
  switch (page.type) {
    case 'blank': case 'blank-end': return <BlankPageContent />
    case 'title':           return <TitlePageContent />
    case 'opening':         return <OpeningPageContent />
    case 'opening-body':    return <OpeningBodyContent />
    case 'timeline-header': return <SectionHeader eyebrow="chapters" title="The years, as I remember them." />
    case 'timeline-year':   return <TimelineYearContent page={page} />
    case 'memories-header': return <SectionHeader eyebrow="fragments" title="Things I still carry." />
    case 'memory':          return <MemoryCardContent card={page.card} rotation={page.rotation} tabColor={page.tabColor} />
    case 'back-cover':      return <BackCoverContent />
    default:                return null
  }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BookJournal({ onClose }) {
  const bookContainerRef = useRef(null)
  const pageFlipRef      = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isReady, setIsReady]         = useState(false)
  const [showClose, setShowClose]     = useState(false)
  const isMobile = window.innerWidth < 640

  const pages      = useRef(buildPageList()).current
  const totalPages = pages.length

  useEffect(() => {
    const t = setTimeout(() => setShowClose(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // Double-RAF init — guarantees DOM is painted before PageFlip scans
  useEffect(() => {
    const container = bookContainerRef.current
    if (!container) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const pageW = isMobile
      ? Math.min(vw * 0.94, 400)
      : Math.min(Math.floor(vw * 0.40), 400)
    const pageH = isMobile
      ? Math.min(vh * 0.80, 580)
      : Math.min(Math.floor(vh * 0.82), 600)

    let f1, f2
    f1 = requestAnimationFrame(() => {
      f2 = requestAnimationFrame(() => {
        const pageEls = container.querySelectorAll('.pf-page')
        if (pageEls.length === 0) {
          console.warn('[BookJournal] No .pf-page elements found')
          return
        }
        try {
          const pf = new PageFlip(container, {
            width:               pageW,
            height:              pageH,
            size:                'fixed',
            minWidth:            160,
            maxWidth:            480,
            minHeight:           280,
            maxHeight:           680,
            drawShadow:          true,
            flippingTime:        800,
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
          pf.loadFromHTML(pageEls)
          pf.on('flip', (e) => setCurrentPage(e.data))
          pf.on('init', () => setIsReady(true))
          pageFlipRef.current = pf
        } catch (err) {
          console.error('[BookJournal] PageFlip init error:', err)
        }
      })
    })

    return () => {
      cancelAnimationFrame(f1)
      cancelAnimationFrame(f2)
      try { pageFlipRef.current?.destroy() } catch (_) {}
    }
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
        background: 'radial-gradient(ellipse 65% 55% at 50% 52%, rgba(40,22,6,0.65) 0%, rgba(6,4,2,0.97) 72%)',
      }}
    >
      {/* Close button */}
      <AnimatePresence>
        {showClose && (
          <motion.button
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            onClick={onClose}
            style={{
              position: 'absolute', top: 20, right: 24,
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: fonts.dm, fontSize: 22,
              color: 'rgba(255,235,180,0.45)', lineHeight: 1,
              padding: '4px 8px', zIndex: 10, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,248,220,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,235,180,0.45)'}
            aria-label="Close book"
          >×</motion.button>
        )}
      </AnimatePresence>

      {/* Tap zones */}
      <div onClick={goPrev} style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '14%', cursor: 'w-resize', zIndex: 5,
      }} />
      <div onClick={goNext} style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: '14%', cursor: 'e-resize', zIndex: 5,
      }} />

      {/* Book container */}
      <div
        ref={bookContainerRef}
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        {pages.map((page, i) => {
          const side       = i % 2 === 0 ? 'left' : 'right'
          const isCover    = page.type === 'blank' && i === 0
          const isBack     = page.type === 'back-cover'
          const isHardPage = isCover || isBack || page.type === 'blank-end'

          return (
            <div
              key={i}
              className="pf-page"
              data-density={isHardPage ? 'hard' : 'soft'}
            >
              {/* Cover and back-cover get raw styling; all other pages get BookPage wrapper */}
              {isCover || isBack
                ? (isCover ? <BookCoverContent /> : <BackCoverContent />)
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
        animate={{ opacity: isReady ? 0.5 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute', bottom: 18, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: fonts.garamond, fontStyle: 'italic',
          fontSize: 11, color: 'rgba(255,235,180,0.6)',
          letterSpacing: '0.10em', whiteSpace: 'nowrap', userSelect: 'none',
        }}
      >
        {currentPage + 1} / {totalPages}
      </motion.div>

      {/* First-open hint */}
      <AnimatePresence>
        {isReady && currentPage === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            style={{
              position: 'absolute', bottom: 38, left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: fonts.garamond, fontStyle: 'italic',
              fontSize: 11, color: 'rgba(255,235,180,0.35)',
              letterSpacing: '0.08em', whiteSpace: 'nowrap', pointerEvents: 'none',
            }}
          >
            tap the edges or use arrow keys to turn pages
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
