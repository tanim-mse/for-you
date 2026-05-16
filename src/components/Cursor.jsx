import { useEffect, useRef, useState } from 'react'

const isTouchDevice = () =>
  typeof window !== 'undefined' && 'ontouchstart' in window

export default function Cursor() {
  // Skip rendering entirely on touch devices
  if (isTouchDevice()) return null

  return <CursorInner />
}

function CursorInner() {
  const posRef      = useRef({ x: -100, y: -100 })
  const trailRef    = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 },
  ])
  const hoveredRef  = useRef(false)
  const [, forceRender] = useState(0)
  const ripples     = useRef([])
  const animIdRef   = useRef(null)
  const frameRef    = useRef(0)

  // Dot refs for direct DOM manipulation (no React re-render per frame)
  const mainRef   = useRef(null)
  const t1Ref     = useRef(null)
  const t2Ref     = useRef(null)
  const t3Ref     = useRef(null)
  const innerRef  = useRef(null)

  useEffect(() => {
    // Hide default cursor on document
    document.documentElement.style.cursor = 'none'

    const TRAIL_DELAYS = [80, 160, 240] // ms

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }

      // Update trail with delays
      TRAIL_DELAYS.forEach((delay, idx) => {
        setTimeout(() => {
          trailRef.current[idx] = { x: e.clientX, y: e.clientY }
        }, delay)
      })

      // Hover detection
      const el = document.elementFromPoint(e.clientX, e.clientY)
      hoveredRef.current = !!(
        el && el.closest('a, button, [role="button"], [data-cursor-hover]')
      )
    }

    const onDown = (e) => {
      const id = Date.now()
      ripples.current.push({ x: e.clientX, y: e.clientY, id, born: Date.now() })
      forceRender(n => n + 1)
      setTimeout(() => {
        ripples.current = ripples.current.filter(r => r.id !== id)
        forceRender(n => n + 1)
      }, 420)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)

    // RAF loop for smooth position updates
    const tick = () => {
      frameRef.current++
      const { x, y } = posRef.current
      const hovered   = hoveredRef.current

      if (mainRef.current) {
        const size = hovered ? 24 : 10
        mainRef.current.style.left   = `${x - size / 2}px`
        mainRef.current.style.top    = `${y - size / 2}px`
        mainRef.current.style.width  = `${size}px`
        mainRef.current.style.height = `${size}px`
        mainRef.current.style.background = hovered
          ? 'rgba(255,200,100,0.15)'
          : 'radial-gradient(circle, rgba(212,149,106,0.9) 0%, transparent 70%)'
        mainRef.current.style.border = hovered
          ? '1px solid rgba(255,200,100,0.35)'
          : 'none'
      }

      if (innerRef.current) {
        innerRef.current.style.display = hovered ? 'block' : 'none'
        if (hovered) {
          innerRef.current.style.left = `${x - 2}px`
          innerRef.current.style.top  = `${y - 2}px`
        }
      }

      const trailSizes = [6, 4, 3]
      const trailOpacities = [0.3, 0.15, 0.07]
      const trailRefs = [t1Ref, t2Ref, t3Ref]

      trailRefs.forEach((ref, i) => {
        if (!ref.current) return
        const { x: tx, y: ty } = trailRef.current[i]
        const s = trailSizes[i]
        ref.current.style.left    = `${tx - s / 2}px`
        ref.current.style.top     = `${ty - s / 2}px`
        ref.current.style.opacity = trailOpacities[i]
      })

      animIdRef.current = requestAnimationFrame(tick)
    }

    animIdRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      cancelAnimationFrame(animIdRef.current)
      document.documentElement.style.cursor = ''
    }
  }, [])

  const dotBase = {
    position: 'fixed',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 'var(--z-cursor)',
    transition: 'width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease',
    transform: 'none',
  }

  return (
    <>
      {/* Main dot */}
      <div
        ref={mainRef}
        style={{
          ...dotBase,
          width: 10,
          height: 10,
          background: 'radial-gradient(circle, rgba(212,149,106,0.9) 0%, transparent 70%)',
        }}
      />

      {/* Inner hover dot */}
      <div
        ref={innerRef}
        style={{
          ...dotBase,
          width: 4,
          height: 4,
          background: 'rgba(255,200,100,0.8)',
          display: 'none',
          transition: 'none',
        }}
      />

      {/* Trail dots */}
      {[t1Ref, t2Ref, t3Ref].map((ref, i) => (
        <div
          key={i}
          ref={ref}
          style={{
            ...dotBase,
            width:  [6, 4, 3][i],
            height: [6, 4, 3][i],
            background: 'radial-gradient(circle, rgba(212,149,106,0.6) 0%, transparent 70%)',
            transition: 'none',
          }}
        />
      ))}

      {/* Click ripples */}
      {ripples.current.map(r => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x,
            top:  r.y,
            width: 0,
            height: 0,
            borderRadius: '50%',
            background: 'rgba(212,149,106,0.3)',
            pointerEvents: 'none',
            zIndex: 'var(--z-cursor)',
            transform: 'translate(-50%, -50%) scale(0)',
            animation: 'cursorRipple 0.4s ease-out forwards',
          }}
        />
      ))}

      <style>{`
        @keyframes cursorRipple {
          0%   { width: 0px; height: 0px; opacity: 0.4; transform: translate(-50%, -50%) scale(0); }
          100% { width: 60px; height: 60px; opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
    </>
  )
}
