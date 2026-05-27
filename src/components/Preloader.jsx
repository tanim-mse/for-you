import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'

const LINE_ONE   = "Some things take years to arrive..."
const LINE_TWO   = "This one took six."
const CHAR_DELAY = 0.07

export default function Preloader({ onComplete }) {
  const [dotVisible, setDotVisible]     = useState(false)
  const [dotPulse, setDotPulse]         = useState(false)
  const [dotExpand, setDotExpand]       = useState(false)
  const [flash, setFlash]               = useState(false)
  const [lineOneChars, setLineOneChars] = useState(0)
  const [lineTwoChars, setLineTwoChars] = useState(0)
  const [textFade, setTextFade]         = useState(false)
  const [dotGlow, setDotGlow]           = useState(false)

  const howlerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const timers  = []
    const t = (ms, fn) => {
      const id = setTimeout(() => { if (isMounted) fn() }, ms)
      timers.push(id)
    }

    // 0.80s — dot appears + preloader music starts
    // Using Howl directly here (no user-interaction lock needed on desktop for
    // the very first audio attempt; on mobile it will silently fail — acceptable
    // because the preloader is a visual experience either way).
    t(800, () => {
      setDotVisible(true)
      setDotPulse(true)

      try {
        const sound = new Howl({
          src:   ['./audio/01-preloader.mp3'],  // ./ works with Vite base path
          volume: 0,
          loop:   false,
          html5:  true,
          onplay() { sound.fade(0, 0.18, 2500) },
          onloaderror(_, err) { console.warn('[Preloader] audio load failed:', err) },
        })
        sound.play()
        howlerRef.current = sound
      } catch (err) {
        console.warn('[Preloader] Howl init failed:', err)
      }
    })

    // 1.60s — start typing line one (36 chars × 70ms ≈ 2.52s → done ~4.12s)
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

    // 4.20s — pause, then line two (19 chars × 70ms ≈ 1.33s → done ~5.53s)
    t(4200, () => {
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

    // 6.20s — dot expands, text fades, audio fades out
    t(6200, () => {
      setDotExpand(true)
      setTextFade(true)
      setDotGlow(true)
      if (howlerRef.current) {
        howlerRef.current.fade(0.18, 0, 500)
      }
    })

    // 6.70s — flash
    t(6700, () => setFlash(true))

    // 8.50s — hand off
    t(8500, () => onComplete())

    return () => {
      isMounted = false
      timers.forEach(clearTimeout)
      if (howlerRef.current) howlerRef.current.stop()
    }
  }, [onComplete])

  const dotState = dotExpand ? 'expand' : dotPulse ? 'pulse' : 'hidden'

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: flash ? '#FFFEF5' : '#000000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      {dotVisible && (
        <motion.div
          variants={{
            hidden:  { opacity: 0, scale: 1 },
            pulse:   { opacity: [0, 1, 0.8], scale: [1, 2, 1],
                       transition: { duration: 1.2, ease: 'easeInOut' } },
            expand:  { opacity: [1, 0], scale: [1, 90],
                       transition: { duration: 0.5, ease: 'easeIn' } },
          }}
          initial="hidden"
          animate={dotState}
          style={{
            width: 2, height: 2, borderRadius: '50%',
            backgroundColor: '#FFF4CC', flexShrink: 0,
            boxShadow: dotGlow ? '0 0 100px rgba(255,180,60,0.3)' : 'none',
            transition: 'box-shadow 0.5s ease',
          }}
        />
      )}

      <div style={{
        textAlign: 'center',
        opacity: textFade ? 0 : 1,
        transition: 'opacity 0.3s ease',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(calc(-50% + 28px))',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic', fontSize: 22, lineHeight: '1.8',
          color: '#C4AA85', letterSpacing: '0.13em',
          margin: 0, minHeight: '1.6em',
        }}>
          {LINE_ONE.slice(0, lineOneChars)}
        </p>

        {lineTwoChars > 0 && (
          <p style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontStyle: 'italic', fontSize: 22, lineHeight: '1.8',
            color: '#C4AA85', letterSpacing: '0.13em',
            margin: '32px 0 0', minHeight: '1.6em',
          }}>
            {LINE_TWO.slice(0, lineTwoChars)}
          </p>
        )}
      </div>
    </div>
  )
}
