import { useEffect, useRef, useState } from 'react'

export default function MemoryCard({ memory, index }) {
  const ref      = useRef(null)
  const [visible, setVisible] = useState(false)

  // Seeded rotation — each card tilts slightly, feels placed not arranged
  const rotations = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.5, -1.0, 0.7, -0.4, 1.2, -0.7, 0.6]
  const rotation  = rotations[index % rotations.length]

  // IntersectionObserver — triggers once when card enters viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger based on index so cards cascade in
          setTimeout(() => setVisible(true), index * 100)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="paper-card memory-card"
      onMouseEnter={e => {
        e.currentTarget.style.transform = `translateY(-3px) rotate(${rotation}deg)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = `translateY(0px) rotate(${rotation}deg)`
      }}
      style={{
        borderRadius: 3,
        padding: '26px 26px 22px',
        breakInside: 'avoid',
        marginBottom: 24,
        position: 'relative',
        cursor: 'default',
        // Entrance animation via CSS transition
        opacity:   visible ? 1 : 0,
        transform: visible
          ? `translateY(0) rotate(${rotation}deg)`
          : 'translateY(18px) rotate(0deg)',
        transition: 'opacity 0.75s ease, transform 0.75s ease',
        // Prevent GPU compositing blur on rotated text
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        isolation: 'isolate',
      }}
    >
      {/* Date label */}
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.22em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {memory.date}
      </p>

      {/* Main quote */}
      <p
        className="memory-quote"
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 19,
          lineHeight: 1.72,
          color: 'var(--text-primary)',
          transition: 'color 0.4s ease',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {memory.quote}
      </p>

      {/* Optional separator + sub-note */}
      {memory.note && (
        <>
          <div
            style={{
              height: 1,
              background: 'var(--ink-faded)',
              opacity: 0.15,
              margin: '14px 0',
            }}
          />
          <p
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            {memory.note}
          </p>
        </>
      )}

      {/* Corner mark */}
      <span
        style={{
          position: 'absolute',
          bottom: 12,
          right: 14,
          fontSize: 10,
          color: 'var(--gold-muted)',
          opacity: 0.35,
          lineHeight: 1,
        }}
      >
        ✦
      </span>
    </div>
  )
}
