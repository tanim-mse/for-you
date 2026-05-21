import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSfx } from '../utils/audio'

// ── Typewriter hook — unchanged ───────────────────────────────────────────────
function useTypewriter(paragraphs, active) {
  const [displayed, setDisplayed] = useState(() => paragraphs.map(() => ''))
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
          next[paraIndex] = currentPara.slice(0, charIndex + 1)
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
      setDisplayed(paragraphs.map(() => ''))
      setParaIndex(0)
      setCharIndex(0)
      setFinished(false)
    }
  }, [active, paragraphs])

  return { displayed, paraIndex, finished }
}

// ── Letter Modal — unchanged ──────────────────────────────────────────────────
function LetterModal({ letter, onClose, onRead }) {
  const { displayed, paraIndex, finished } = useTypewriter(letter.body, true)
  const bottomRef     = useRef(null)
  const hasMarkedRead = useRef(false)
  const touchStart    = useRef(0)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
          position: 'fixed', inset: 0,
          background: 'rgba(6,4,2,0.90)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          zIndex: 'var(--z-modal)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
        }}
      >
        <motion.div
          key="letter"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -10 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="letter-modal-inner"
          style={{
            position: 'relative',
            width: 'min(520px, 92vw)',
            height: 'min(680px, 85vh)',
            overflowY: 'auto',
            borderRadius: 3,
            zIndex: 1001,
            WebkitOverflowScrolling: 'touch',
            boxShadow: `
              0 0 0 1px rgba(100,75,40,0.5),
              0 40px 80px rgba(0,0,0,0.80),
              0 0 60px rgba(180,130,50,0.12)
            `,
            padding: 'clamp(28px, 5vw, 52px)',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            background: 'linear-gradient(to bottom, rgba(195,165,110,0.15) 0%, transparent 100%)',
            pointerEvents: 'none', borderRadius: '3px 3px 0 0', zIndex: 1,
          }} />

          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 20,
              background: 'none', border: 'none', fontSize: 22,
              color: 'rgba(80,55,25,0.55)', cursor: 'pointer',
              lineHeight: 1, padding: 0, zIndex: 10, transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(40,20,5,0.90)'}
            onMouseLeave={e => e.target.style.color = 'rgba(80,55,25,0.55)'}
          >×</button>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10,
              color: 'rgba(80,55,25,0.65)', letterSpacing: '0.15em',
              textTransform: 'uppercase', textAlign: 'right', marginBottom: 24,
            }}>{letter.date}</p>

            <p style={{
              fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic',
              fontSize: 24, color: 'rgba(45,28,8,0.88)', marginBottom: 20, lineHeight: 1.4,
            }}>{letter.salutation}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {letter.body.map((fullText, pi) => (
                <p key={pi} style={{
                  fontFamily: "'Crimson Pro', Georgia, serif",
                  fontSize: 'clamp(15px, 2vw, 17px)',
                  lineHeight: 2.05, color: 'rgba(40,25,8,0.82)',
                  letterSpacing: '0.01em',
                  minHeight: `${fullText.length > 80 ? 3 : fullText.length > 40 ? 2 : 1}lh`,
                  position: 'relative',
                }}>
                  {displayed[pi]}
                  {pi === paraIndex && !finished && (
                    <span style={{
                      display: 'inline-block', marginLeft: 1,
                      color: 'rgba(80,55,25,0.45)',
                      animation: 'blink 0.9s ease-in-out infinite',
                    }}>|</span>
                  )}
                </p>
              ))}
            </div>

            <p style={{
              marginTop: 32,
              fontFamily: "'EB Garamond', Georgia, serif", fontStyle: 'italic',
              fontSize: 18, color: 'rgba(60,38,14,0.72)', textAlign: 'right',
            }}>{letter.signoff}</p>

            <div ref={bottomRef} style={{ height: 1, marginTop: 8 }} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Wax Seal — redesigned ─────────────────────────────────────────────────────
function WaxSeal({ locked, read }) {
  return (
    <div style={{
      position: 'absolute',
      // Sits exactly on the bottom edge of the flap — centered horizontally
      top: '24%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
    }}>
      {/* Outer wax drip ring — slightly larger, rougher edge */}
      <div style={{
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: locked
          ? 'radial-gradient(circle at 38% 32%, #6B5540 0%, #3D2610 55%, #2A1A08 100%)'
          : read
          ? 'radial-gradient(circle at 38% 32%, #FFB830 0%, #E8820A 45%, #B85A08 100%)'
          : 'radial-gradient(circle at 38% 32%, #F5C040 0%, #E8A020 45%, #C4681A 100%)',
        boxShadow: locked
          ? '0 3px 10px rgba(0,0,0,0.55)'
          : read
          ? '0 3px 10px rgba(0,0,0,0.45), 0 0 22px rgba(232,130,10,0.45)'
          : '0 3px 10px rgba(0,0,0,0.45), 0 0 16px rgba(232,160,32,0.30)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.6s ease, box-shadow 0.6s ease',
        // Slightly imperfect shape — real wax isn't a perfect circle
        clipPath: 'polygon(50% 0%, 95% 18%, 100% 60%, 85% 95%, 50% 100%, 15% 95%, 0% 60%, 5% 18%)',
      }}>
        {/* Inner seal face */}
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: locked
            ? 'radial-gradient(circle at 40% 35%, rgba(120,90,60,0.6) 0%, transparent 70%)'
            : 'radial-gradient(circle at 40% 35%, rgba(255,230,150,0.25) 0%, transparent 65%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: locked ? 10 : 11,
            color: locked ? 'rgba(200,170,130,0.55)' : 'rgba(255,245,210,0.80)',
            lineHeight: 1,
            userSelect: 'none',
          }}>
            {locked ? '🔒' : '✦'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Envelope — redesigned ─────────────────────────────────────────────────────
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
        className={isLocked ? '' : 'envelope-unlocked'}
        style={{
          position: 'relative',
          width: '100%',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        }}
      >
        {/* ── Envelope body ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '60%',         // 5:3 aspect ratio
          borderRadius: 2,
          border: '1px solid rgba(140,100,50,0.35)',
          boxShadow: `
            0 6px 28px rgba(0,0,0,0.60),
            0 2px 8px rgba(0,0,0,0.40),
            inset 0 1px 0 rgba(255,225,160,0.07)
          `,
          overflow: 'hidden',
          // Parchment image — same paper as the letter
          backgroundImage: 'url("/images/letter-paper.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}>

          {/* ── Dark warm overlay — this is the exterior of the paper,
                 in shadow compared to the open letter inside ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'rgba(25,15,5,0.50)',
          }} />

          {/* ── Bottom fold lines — left and right triangles meeting at center ── */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          }}>
            {/* Left triangle fold */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 0 55px 75px',
              borderColor: 'transparent transparent rgba(0,0,0,0.10) transparent',
            }} />
            {/* Right triangle fold */}
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 0, height: 0, borderStyle: 'solid',
              borderWidth: '0 75px 55px 0',
              borderColor: 'transparent rgba(0,0,0,0.10) transparent transparent',
            }} />
            {/* Subtle center vertical crease */}
            <div style={{
              position: 'absolute', bottom: 0,
              left: '50%', transform: 'translateX(-50%)',
              width: 1, height: '30%',
              background: 'rgba(0,0,0,0.06)',
            }} />
          </div>

          {/* ── Address area — bottom left ── */}
          <div style={{
            position: 'absolute', bottom: 22, left: 22, zIndex: 4,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              color: 'rgba(230,205,160,0.55)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              margin: '0 0 3px',
            }}>To:</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: 'rgba(230,205,160,0.85)',
              margin: '0 0 8px',
            }}>you</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 9,
              color: 'rgba(230,205,160,0.55)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              margin: '0 0 3px',
            }}>From:</p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: 'rgba(230,205,160,0.85)',
              fontStyle: 'italic',
              margin: 0,
            }}>someone who waited</p>
          </div>

          {/* ── Stamp — bottom right ── */}
          <div style={{
            position: 'absolute', bottom: 18, right: 18, zIndex: 4,
            width: 36, height: 44,
            border: '1.5px solid rgba(210,180,120,0.30)',
            borderRadius: 2,
            background: 'rgba(15,8,2,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            // Perforated edge effect
            boxShadow: `
              inset 0 0 0 2px rgba(210,180,120,0.06),
              0 0 0 1px rgba(140,100,50,0.15)
            `,
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 8,
              color: 'rgba(210,180,120,0.55)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>no. {index + 1}</span>
          </div>

          {/* ── Flap — triangle pointing down ── */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '48%',
            zIndex: 5,
            transformOrigin: 'top center',
            transform: flapOpen
              ? 'perspective(700px) rotateX(-175deg)'
              : 'perspective(700px) rotateX(0deg)',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            // Clip to triangle shape
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 68%)',
            // Same parchment — but shifted so the flap shows a different
            // part of the texture, like a real folded piece of paper
            backgroundImage: 'url("/images/letter-paper.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            // Slightly darker than the body — the flap casts a shadow
            filter: 'brightness(0.82)',
          }}>
            {/* Flap shadow gradient — makes it look folded/3D */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(170deg, rgba(15,8,2,0.40) 0%, rgba(30,18,6,0.20) 60%, rgba(10,5,1,0.50) 100%)',
              clipPath: 'inherit',
            }} />
          </div>

          {/* ── Wax seal — sits on the flap, centered ── */}
          <WaxSeal locked={isLocked} read={read} />

          {/* ── Locked dim overlay ── */}
          {isLocked && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 6,
              background: 'rgba(0,0,0,0.18)',
            }} />
          )}
        </div>

        {/* ── Locked tooltip ── */}
        {isLocked && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontStyle: 'italic', fontSize: 13,
            color: 'rgba(210,185,140,0.70)',
            pointerEvents: 'none', zIndex: 7, whiteSpace: 'nowrap',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
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
