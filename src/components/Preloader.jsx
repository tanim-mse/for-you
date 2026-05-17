import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const LINE_ONE = "Some things take years to arrive..."
const LINE_TWO = "This one took six."
const CHAR_DELAY = 0.04 // 40ms per character

export default function Preloader({ onComplete }) {
  const [dotVisible, setDotVisible]       = useState(false)
  const [dotPulse, setDotPulse]           = useState(false)
  const [dotExpand, setDotExpand]         = useState(false)
  const [dotContract, setDotContract]     = useState(false)
  const [flash, setFlash]                 = useState(false)
  const [lineOneChars, setLineOneChars]   = useState(0)
  const [lineTwoChars, setLineTwoChars]   = useState(0)
  const [textFade, setTextFade]           = useState(false)
  const [dotGlow, setDotGlow]             = useState(false)

  const howlerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const timers = []

    const t = (ms, fn) => {
      const id = setTimeout(() => { if (isMounted) fn() }, ms)
      timers.push(id)
    }

    // 0.80s — dot appears, audio starts
    t(800, () => {
      setDotVisible(true)
      setDotPulse(true)

      // Howler audio
      try {
        const { Howl } = window.Howler || {}
        if (!Howl) {
          import('howler').then(({ Howl: H }) => {
            const sound = new H({
              src: ['/audio/01-preloader.mp3'],
              volume: 0,
              onplay() { sound.fade(0, 0.18, 3000) },
            })
            sound.play()
            howlerRef.current = sound
          }).catch(() => {})
        }
      } catch (_) {}
    })

    // 1.60s — start typing line one (36 chars × 40ms = 1440ms → ends ~3.04s)
    t(1600, () => {
      let i = 0
      const type = () => {
        i++
        if (isMounted) setLineOneChars(i)
        if (i < LINE_ONE.length) {
          const id = setTimeout(type, CHAR_DELAY * 1000)
          timers.push(id)
        }
      }
      type()
    })

    // 3.00s — start typing line two (19 chars → ends ~3.76s)
    t(3000, () => {
      let i = 0
      const type = () => {
        i++
        if (isMounted) setLineTwoChars(i)
        if (i < LINE_TWO.length) {
          const id = setTimeout(type, CHAR_DELAY * 1000)
          timers.push(id)
        }
      }
      type()
    })

    // 4.00s — dot expands, text fades, glow radiates
    t(4000, () => {
      setDotExpand(true)
      setTextFade(true)
      setDotGlow(true)

      // Fade audio out
      if (howlerRef.current) {
        howlerRef.current.fade(0.18, 0, 500)
      }
    })

    // 4.50s — flash
    t(4500, () => {
      setDotContract(true)
      setFlash(true)
    })

    // 5.50s — done
    t(5500, () => {
      onComplete()
    })

    return () => {
      isMounted = false
      timers.forEach(clearTimeout)
      if (howlerRef.current) {
        howlerRef.current.stop()
      }
    }
  }, [onComplete])

  // Dot animation variants
  const dotVariants = {
    hidden:   { opacity: 0, scale: 1 },
    pulse:    {
      opacity: [0, 1, 0.8],
      scale:   [1, 2, 1],
      transition: { duration: 1.2, ease: 'easeInOut' },
    },
    expand:   {
      opacity: [1, 0],
      scale:   [1, 90],
      transition: { duration: 0.5, ease: 'easeIn' },
    },
  }

  const dotState = dotExpand ? 'expand' : dotPulse ? 'pulse' : dotVisible ? 'hidden' : 'hidden'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: flash ? '#FFFEF5' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: flash ? 'none' : undefined,
      }}
    >
      {/* Dot */}
      {dotVisible && (
        <motion.div
          variants={dotVariants}
          initial="hidden"
          animate={dotState}
          style={{
            width: 2,
            height: 2,
            borderRadius: '50%',
            backgroundColor: '#FFF4CC',
            boxShadow: dotGlow ? '0 0 100px rgba(255,180,60,0.3)' : 'none',
            transition: 'box-shadow 0.5s ease',
            flexShrink: 0,
          }}
        />
      )}

      {/* Text block */}
      <div
        style={{
          marginTop: 44,
          textAlign: 'center',
          opacity: textFade ? 0 : 1,
          transition: 'opacity 0.3s ease',
          position: 'absolute',
          // vertically offset from center by dot height + gap
          top: '50%',
          transform: 'translateY(calc(-50% + 24px))',
          pointerEvents: 'none',
        }}
      >
        {/* Line one */}
        <p
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 17,
            color: '#C4AA85',
            letterSpacing: '0.10em',
            margin: 0,
            minHeight: '1.4em',
          }}
        >
          {LINE_ONE.slice(0, lineOneChars)}
        </p>

        {/* Line two */}
        {lineTwoChars > 0 && (
          <p
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 17,
              color: '#C4AA85',
              letterSpacing: '0.10em',
              margin: '26px 0 0',
              minHeight: '1.4em',
            }}
          >
            {LINE_TWO.slice(0, lineTwoChars)}
          </p>
        )}
      </div>
    </div>
  )
}
