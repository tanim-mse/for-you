import { useEffect, useRef, useState } from 'react'

// Inject crisp-text styles once into the document head
// This is the ONLY reliable way to apply -webkit-font-smoothing in React
const STYLE_ID = 'memory-card-crisp'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .memory-card,
    .memory-card * {
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
    }
    .memory-card .memory-date {
      font-family: 'DM Sans', sans-serif;
      font-size: 9px;
      letter-spacing: 0.22em;
      color: var(--text-tertiary);
      text-transform: uppercase;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .memory-card .memory-quote {
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 18px;
      line-height: 1.72;
      color: var(--text-primary);
      transition: color 0.4s ease;
      font-weight: 400;
    }
    .memory-card.memory-card--large .memory-quote {
      font-size: 16px;
      line-height: 1.65;
    }
    .memory-card .memory-note {
      font-family: 'DM Sans', sans-serif;
      font-size: 12.5px;
      line-height: 1.65;
      color: var(--text-secondary);
      font-weight: 400;
    }
    .memory-card.memory-card--large .memory-note {
      font-size: 12px;
    }
    .memory-card .memory-divider {
      height: 1px;
      background: var(--ink-faded);
      opacity: 0.15;
      margin: 14px 0;
    }
  `
  document.head.appendChild(style)
}

export default function MemoryCard({ memory, index }) {
  const ref     = useRef(null)
  const [visible, setVisible] = useState(false)

  const rotations = [-1.2, 0.8, -0.6, 1.1, -0.9, 0.5, -1.0, 0.7, -0.4, 1.2, -0.7, 0.6]
  const rotation  = rotations[index % rotations.length]

  // Cards flagged as large get reduced font + more padding
  const isLarge = !!memory.large

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
      className={`paper-card memory-card${isLarge ? ' memory-card--large' : ''}`}
      onMouseEnter={e => {
        e.currentTarget.style.transform = `translateY(-3px) rotate(${rotation}deg)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = `translateY(0px) rotate(${rotation}deg)`
      }}
      style={{
        borderRadius: 3,
        padding: isLarge ? '20px 22px 18px' : '26px 26px 22px',
        breakInside: 'avoid',
        marginBottom: 24,
        position: 'relative',
        cursor: 'default',
        opacity:   visible ? 1 : 0,
        transform: visible
          ? `translateY(0) rotate(${rotation}deg)`
          : 'translateY(18px) rotate(0deg)',
        transition: 'opacity 0.75s ease, transform 0.75s ease',
        // Force own compositing layer so text renders before rotation
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* Date label */}
      <p className="memory-date">{memory.date}</p>

      {/* Main quote */}
      <p className="memory-quote">{memory.quote}</p>

      {/* Optional separator + sub-note */}
      {memory.note && (
        <>
          <div className="memory-divider" />
          <p className="memory-note">{memory.note}</p>
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
