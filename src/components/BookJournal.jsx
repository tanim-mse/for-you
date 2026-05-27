// src/components/BookJournal.jsx
// Fixes in this version:
//   1. Cover image path corrected → /book_cover.jpg (place in /public/book_cover.jpg)
//   2. Font sizes reduced so text fits within page without clipping
//   3. Paragraph spacing added (gap between paragraphs)
//   4. Image placeholders removed from timeline entirely
//   5. All page content uses overflow:hidden to prevent bleed

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageFlip } from 'page-flip'
import { buildPageList } from '../utils/paginate'
import BookPage from './BookPage'
import Ornament from './Ornament'
import { setTrack } from '../utils/audio'

const HER_NAME   = 'Tortoise'
const BIRTH_YEAR = 2004

const OPENING_LINES = [
  'I never planned to write any of this down.',
  "But some feelings don't ask permission.",
]




// Dark ink on parchment
const ink = {
  primary:   '#1A0F06',
  secondary: '#3D2208',
  muted:     '#7A5230',
  faint:     '#B8905A',
}
const fonts = {
  playfair: "'Playfair Display', Georgia, serif",
  garamond: "'EB Garamond', Georgia, serif",
  crimson:  "'Crimson Pro', Georgia, serif",
  dm:       "'DM Sans', sans-serif",
}

// ── Book Cover ─────────────────────────────────────────────────────────────────
function BookCoverContent() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      overflow: 'hidden', backgroundColor: '#0A0814',
    }}>
      <img
        src="./book_cover.jpg"
        alt="Cover"
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center top',
          display: 'block',
        }}
      />
      {/* Dark gradient at bottom so text is readable */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(to top, rgba(8,5,18,0.90) 0%, rgba(8,5,18,0.45) 55%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle top vignette */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '25%',
        background: 'linear-gradient(to bottom, rgba(8,5,18,0.50) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Title block — bottom left */}
      <div style={{ position: 'absolute', bottom: 32, left: 26, right: 26 }}>
        <div style={{ width: 36, height: 1, background: 'rgba(255,235,190,0.50)', marginBottom: 10 }} />
        <p style={{
          fontFamily: fonts.dm, fontSize: 8.5, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(255,235,190,0.55)', marginBottom: 6,
        }}>
          A Journal
        </p>
        <h1 style={{
          fontFamily: fonts.playfair, fontStyle: 'italic',
          fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 400,
          color: 'rgba(255,248,225,0.92)', lineHeight: 1.15,
          letterSpacing: '0.02em', marginBottom: 5,
          textShadow: '0 2px 14px rgba(0,0,0,0.7)',
        }}>
          {HER_NAME}
        </h1>
        <p style={{
          fontFamily: fonts.garamond, fontStyle: 'italic',
          fontSize: 11, color: 'rgba(255,235,190,0.50)', letterSpacing: '0.05em',
        }}>
          Written across six years.
        </p>
      </div>
    </div>
  )
}

// ── Blank endpaper ─────────────────────────────────────────────────────────────
function BlankPageContent() {
  return <div style={{ width: '100%', height: '100%' }} />
}

// ── Title page ─────────────────────────────────────────────────────────────────
function TitlePageContent() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <Ornament width={100} opacity={0.45} />
      <p style={{
        marginTop: 18, fontFamily: fonts.playfair, fontStyle: 'italic',
        fontSize: 10, color: ink.muted, letterSpacing: '0.30em', textTransform: 'uppercase',
      }}>
        A Journal
      </p>
      <h1 style={{
        marginTop: 12, fontFamily: fonts.playfair,
        fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700,
        color: ink.primary, letterSpacing: '-0.01em', lineHeight: 1.1,
      }}>
        {HER_NAME}
      </h1>
      <p style={{
        marginTop: 12, fontFamily: fonts.garamond, fontStyle: 'italic',
        fontSize: 15, color: ink.secondary, letterSpacing: '0.04em',
      }}>
        Written across six years.
      </p>
      <div style={{ marginTop: 22 }}>
        <Ornament width={70} opacity={0.35} />
      </div>
      <p style={{
        marginTop: 20, fontFamily: fonts.dm, fontSize: 8.5, fontWeight: 300,
        color: ink.muted, letterSpacing: '0.20em', textTransform: 'uppercase',
      }}>
        Born the 3rd of June, {BIRTH_YEAR}
      </p>
    </div>
  )
}

// ── Opening lines ──────────────────────────────────────────────────────────────
function OpeningPageContent() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <p style={{
        fontFamily: fonts.dm, fontSize: 8.5, color: ink.faint,
        letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24,
      }}>
        {BIRTH_YEAR} · June 3rd
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {OPENING_LINES.map((line, i) => (
          <p key={i} style={{
            fontFamily: fonts.garamond, fontStyle: 'italic',
            fontSize: 'clamp(18px, 2.4vw, 24px)', lineHeight: 1.55,
            color: ink.primary, letterSpacing: '0.01em',
          }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

// ── Body paragraphs — receives paragraphs array from paginate.js ──────────────
// Max 3 paragraphs per page; overflow goes to the next opening-body page.
function OpeningBodyContent({ paragraphs = [] }) {
  return (
    <div style={{
      height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
    }}>
      {paragraphs.map((para, i) => (
        <p key={i} style={{
          fontFamily: fonts.crimson,
          fontSize: 'clamp(12px, 1.5vw, 14px)',
          lineHeight: 1.88,
          color: ink.secondary,
          letterSpacing: '0.010em',
          marginBottom: i < paragraphs.length - 1 ? 16 : 0,
          flexShrink: 0,
        }}>
          {para}
        </p>
      ))}
    </div>
  )
}

// ── Section headers ────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center',
    }}>
      <Ornament width={80} opacity={0.32} />
      <p style={{
        marginTop: 18, fontFamily: fonts.playfair, fontStyle: 'italic',
        fontSize: 10, color: ink.muted, letterSpacing: '0.22em', textTransform: 'uppercase',
      }}>
        {eyebrow}
      </p>
      <h2 style={{
        marginTop: 10, fontFamily: fonts.playfair,
        fontSize: 'clamp(20px, 2.8vw, 28px)', fontWeight: 500,
        color: ink.primary, lineHeight: 1.25,
      }}>
        {title}
      </h2>
      <div style={{ marginTop: 18 }}>
        <Ornament width={80} opacity={0.32} />
      </div>
    </div>
  )
}

// ── Timeline year — no image placeholder ──────────────────────────────────────
function TimelineYearContent({ page }) {
  const { year, chapter, title, bodyChunk, isFirst } = page

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ghost year */}
      <div style={{
        position: 'absolute', top: -12, right: -8,
        fontFamily: fonts.playfair,
        fontSize: 'clamp(48px, 7vw, 72px)',
        fontWeight: 700, color: ink.faint, opacity: 0.11,
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        {year}
      </div>

      {/* Top rule */}
      <div style={{
        width: '100%', height: 1, flexShrink: 0, marginBottom: 16,
        background: `linear-gradient(to right, ${ink.faint}, transparent)`,
        opacity: 0.35,
      }} />

      {isFirst && (
        <p style={{
          fontFamily: fonts.dm, fontSize: 8, letterSpacing: '0.18em',
          color: ink.muted, textTransform: 'uppercase',
          marginBottom: 4, flexShrink: 0,
        }}>
          Chapter {chapter}
        </p>
      )}

      {isFirst && (
        <h3 style={{
          fontFamily: fonts.playfair, fontStyle: 'italic',
          fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 400,
          color: ink.primary, lineHeight: 1.28,
          marginBottom: 14, flexShrink: 0,
        }}>
          {title}
        </h3>
      )}

      {!isFirst && (
        <p style={{
          fontFamily: fonts.garamond, fontStyle: 'italic',
          fontSize: 9.5, color: ink.faint,
          letterSpacing: '0.08em', marginBottom: 10,
          opacity: 0.65, flexShrink: 0,
        }}>
          {year}, continued...
        </p>
      )}

      {/* Body text — splits on \n and \n\n both */}
      <div style={{ flex: 1 }}>
        {bodyChunk
          .split(/\n+/)
          .map(p => p.trim())
          .filter(Boolean)
          .map((para, i, arr) => (
            <p key={i} style={{
              fontFamily: fonts.crimson,
              fontSize: 13,
              lineHeight: 1.85,
              color: ink.secondary,
              letterSpacing: '0.010em',
              marginBottom: i < arr.length - 1 ? 12 : 0,
            }}>
              {para}
            </p>
          ))
        }
      </div>
    </div>
  )
}

// ── Single sticky note card (used inside pair) ─────────────────────────────────
function MemoryCard({ card, rotation, tabColor }) {
  return (
    <div style={{
      width: '82%',
      transform: `rotate(${rotation}deg)`,
      position: 'relative',
      filter: 'drop-shadow(0 4px 12px rgba(80,40,10,0.18))',
    }}>
      <div style={{
        position: 'absolute', top: -10, left: '50%',
        transform: 'translateX(-50%)',
        width: 38, height: 11, backgroundColor: tabColor,
        borderRadius: '2px 2px 0 0', opacity: 0.88,
      }} />
      <div style={{
        backgroundColor: '#FFF8ED',
        border: '1px solid rgba(160,110,50,0.18)',
        borderRadius: 2, padding: '13px 13px 17px', position: 'relative',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 22px, rgba(140,90,30,0.06) 22px, rgba(140,90,30,0.06) 23px)',
        backgroundPosition: '0 30px',
      }}>
        <p style={{
          fontFamily: fonts.dm, fontSize: 6.5, letterSpacing: '0.20em',
          color: ink.muted, textTransform: 'uppercase', marginBottom: 7,
        }}>
          {card.date}
        </p>
        <p style={{
          fontFamily: fonts.garamond, fontStyle: 'italic',
          fontSize: 11.5, lineHeight: 1.58, color: ink.primary,
        }}>
          {card.quote}
        </p>
        {card.note && (
          <>
            <div style={{ height: 1, background: 'rgba(140,90,30,0.13)', margin: '8px 0' }} />
            <p style={{
              fontFamily: fonts.crimson, fontStyle: 'italic',
              fontSize: 10, lineHeight: 1.48, color: ink.secondary,
            }}>
              {card.note}
            </p>
          </>
        )}
        <span style={{
          position: 'absolute', bottom: 6, right: 7,
          fontSize: 7, color: ink.muted, opacity: 0.38,
        }}>✦</span>
      </div>
    </div>
  )
}

// ── Two memory cards per page, stacked vertically with different rotations ──────
function MemoryPairContent({ page }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: page.cardB ? 'space-evenly' : 'center',
      alignItems: 'center',
    }}>
      <MemoryCard
        card={page.cardA}
        rotation={page.rotationA}
        tabColor={page.tabColorA}
      />
      {page.cardB && (
        <>
          <div style={{
            width: '55%', height: 1, flexShrink: 0,
            background: 'linear-gradient(to right, transparent, rgba(140,90,30,0.13), transparent)',
          }} />
          <MemoryCard
            card={page.cardB}
            rotation={page.rotationB}
            tabColor={page.tabColorB}
          />
        </>
      )}
    </div>
  )
}

// ── Back cover ─────────────────────────────────────────────────────────────────
function BackCoverContent() {
  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#0A0814',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize: '200px 200px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontSize: 18, color: 'rgba(255,235,190,0.30)' }}>✦</span>
    </div>
  )
}

// ── Page content router ────────────────────────────────────────────────────────
function PageContent({ page }) {
  switch (page.type) {
    case 'blank': case 'blank-end': return <BlankPageContent />
    case 'title':           return <TitlePageContent />
    case 'opening':         return <OpeningPageContent />
    case 'opening-body':    return <OpeningBodyContent paragraphs={page.paragraphs} />
    case 'timeline-header': return <SectionHeader eyebrow="chapters" title="The years, as I remember them." />
    case 'timeline-year':   return <TimelineYearContent page={page} />
    case 'memories-header': return <SectionHeader eyebrow="fragments" title="Things I still carry." />
    case 'memory-pair':     return <MemoryPairContent page={page} />
    case 'back-cover':      return <BackCoverContent />
    default:                return null
  }
}


// ── Main ───────────────────────────────────────────────────────────────────────
export default function BookJournal({ onClose }) {
  const bookContainerRef = useRef(null)
  const pageFlipRef      = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isReady, setIsReady]         = useState(false)
  const [showClose, setShowClose]     = useState(false)
  const isMobile = window.innerWidth < 640

  const pages      = useRef(buildPageList()).current
  const totalPages = pages.length

  // ── Per-chapter track map — built once from the page list ─────────────────
  // Each timeline year alternates between journal and piano.
  // Memories get reels (distinct enough to signal a new section).
  // Available tracks (04-letters is missing from this project):
  //   journal, piano, reels, birthday, ending
  const trackMap = useRef(() => {
    const map = []   // index → track name

    // Collect unique years in order
    const years = []
    pages.forEach(p => {
      if (p.type === 'timeline-year' && !years.includes(p.year)) {
        years.push(p.year)
      }
    })

    // Tracks to cycle through per year — alternates so each chapter feels fresh
    const yearTracks = ['piano', 'journal', 'piano', 'journal', 'piano', 'journal', 'piano']

    pages.forEach((p, i) => {
      if (p.type === 'blank' || p.type === 'title' ||
          p.type === 'opening' || p.type === 'opening-body') {
        map[i] = 'journal'

      } else if (p.type === 'timeline-header') {
        map[i] = 'piano'   // piano intro as she enters the years section

      } else if (p.type === 'timeline-year') {
        const yearIndex = years.indexOf(p.year)
        map[i] = yearTracks[yearIndex % yearTracks.length]

      } else if (p.type === 'memories-header' || p.type === 'memory-pair') {
        map[i] = 'reels'   // different feel for the memory fragments

      } else if (p.type === 'blank-end' || p.type === 'back-cover') {
        map[i] = null       // fade to silence at the end

      } else {
        map[i] = 'journal'
      }
    })

    return map
  }).current()

  useEffect(() => {
    const track = trackMap[currentPage]
    // track === null means silence (back cover / end)
    // track === undefined means not mapped — do nothing
    if (track !== undefined) {
      setTrack(track)
    }
  }, [currentPage, trackMap])

  useEffect(() => {
    const t = setTimeout(() => setShowClose(true), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const container = bookContainerRef.current
    if (!container) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const pageW = isMobile
      ? Math.min(vw * 0.94, 390)
      : Math.min(Math.floor(vw * 0.36), 360)
    const pageH = isMobile
      ? Math.min(vh * 0.78, 540)
      : Math.min(Math.floor(vh * 0.78), 560)

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
            width: pageW, height: pageH,
            size: 'fixed',
            minWidth: 160, maxWidth: 460,
            minHeight: 260, maxHeight: 660,
            drawShadow: true, flippingTime: 800,
            usePortrait: isMobile, startZIndex: 10,
            autoSize: true, showPageCorners: !isMobile,
            disableFlipByClick: false,
            mobileScrollSupport: false,
            clickEventForward: false,
            useMouseEvents: true, swipeDistance: 30,
            showCover: true, startPage: 0,
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 65% 55% at 50% 52%, rgba(40,22,6,0.60) 0%, rgba(6,4,2,0.97) 72%)',
      }}
    >
      {/* Close */}
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
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,248,220,0.90)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,235,180,0.45)'}
            aria-label="Close book"
          >×</motion.button>
        )}
      </AnimatePresence>

      {/* Tap zones */}
      <div onClick={goPrev} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '14%', cursor: 'w-resize', zIndex: 5 }} />
      <div onClick={goNext} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '14%', cursor: 'e-resize', zIndex: 5 }} />

      {/* Book */}
      <div ref={bookContainerRef} style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        {pages.map((page, i) => {
          const side      = i % 2 === 0 ? 'left' : 'right'
          const isCover   = page.type === 'blank' && i === 0
          const isBack    = page.type === 'back-cover'
          const isHard    = isCover || isBack || page.type === 'blank-end'

          return (
            <div key={i} className="pf-page" data-density={isHard ? 'hard' : 'soft'}>
              {isCover
                ? <BookCoverContent />
                : isBack
                  ? <BackCoverContent />
                  : (
                    <BookPage side={side} pageNumber={i > 0 && i < totalPages - 1 ? i : null}>
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
        animate={{ opacity: isReady ? 0.50 : 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'absolute', bottom: 16, left: '50%',
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
              position: 'absolute', bottom: 34, left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: fonts.garamond, fontStyle: 'italic',
              fontSize: 11, color: 'rgba(255,235,180,0.32)',
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
