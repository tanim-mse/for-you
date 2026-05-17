import { useEffect, useRef, useState } from 'react'
import { timeline } from '../data/timeline'

// ── Pulse dot keyframe is in index.css ───────────────────────────────────────

// ── Single timeline entry ─────────────────────────────────────────────────────
function TimelineEntry({ entry, index }) {
  const entryRef   = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = entryRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const isLast = index === timeline.length - 1

  return (
    <div
      ref={entryRef}
      style={{
        display: 'flex',
        position: 'relative',
        gap: 0,
        marginBottom: isLast ? 0 : 72,
      }}
    >
      {/* LEFT — year number + dot */}
      <div
        style={{
          width: 96,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        {/* Ghost year number */}
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(48px, 6vw, 68px)',
            fontWeight: 700,
            color: 'var(--text-ghost)',
            lineHeight: 1,
            opacity: active ? 0.7 : 0.18,
            transition: 'opacity 0.6s ease',
            position: 'sticky',
            top: 40,
            userSelect: 'none',
          }}
        >
          {entry.year}
        </div>

        {/* Timeline dot — sits on the ink line */}
        <div
          className={active ? 'timeline-dot timeline-dot--active' : 'timeline-dot'}
          style={{
            position: 'absolute',
            left: 44,
            top: 12,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--flame-warm)',
            boxShadow: active
              ? '0 0 0 3px rgba(255,180,60,0.15), 0 0 12px rgba(255,180,60,0.4)'
              : '0 0 0 3px rgba(255,180,60,0.08)',
            transition: 'box-shadow 0.4s ease',
          }}
        />
      </div>

      {/* RIGHT — chapter content */}
      <div
        style={{
          flex: 1,
          paddingLeft: 36,
          opacity: active ? 1 : 0,
          transform: active ? 'translateX(0)' : 'translateX(16px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {/* Chapter label */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 9,
            letterSpacing: '0.18em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          Chapter {entry.chapter}
        </p>

        {/* Year title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontStyle: 'italic',
            fontSize: 26,
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: 14,
          }}
        >
          {entry.title}
        </h3>

        {/* Body text */}
        <p
          style={{
            fontFamily: "'Crimson Pro', Georgia, serif",
            fontSize: 15,
            lineHeight: 1.95,
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
          }}
        >
          {entry.body}
        </p>

        {/* Image placeholder */}
        <div
          style={{
            marginTop: 20,
            width: 180,
            aspectRatio: '3/2',
            background: 'var(--bg-elevated)',
            border: '1px dashed rgba(139,109,74,0.12)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontStyle: 'italic',
              fontSize: 11,
              color: 'var(--text-ghost)',
              opacity: 0.5,
              textAlign: 'center',
              padding: '0 12px',
            }}
          >
            [ a moment from this year ]
          </span>
        </div>

        {/* Divider — between entries, not after last */}
        {!isLast && (
          <div
            style={{
              marginTop: 52,
              width: 40,
              height: 1,
              background: 'var(--ink-faded)',
              opacity: 0.2,
            }}
          />
        )}
      </div>
    </div>
  )
}

// ── Section header (reusable eyebrow + title pattern) ─────────────────────────
function SectionHeader({ eyebrow, title }) {
  const ref      = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ paddingTop: 80, paddingBottom: 56, textAlign: 'center' }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--text-tertiary)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          marginTop: 6,
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 34,
          fontWeight: 500,
          color: 'var(--text-primary)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s',
        }}
      >
        {title}
      </h2>
    </div>
  )
}

// ── Timeline section root ─────────────────────────────────────────────────────
export default function TimelineSection() {
  return (
    <div style={{ position: 'relative' }}>
      <SectionHeader
        eyebrow="chapters"
        title="The years, as I remember them."
      />

      {/* Outer container — relative so the ink line can be absolutely positioned */}
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '0 24px 120px',
          position: 'relative',
        }}
      >
        {/* Vertical ink line */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(24px + 48px)', // padding + left offset
            top: 0,
            bottom: 0,
            width: 1,
            background: 'var(--ink-faded)',
            opacity: 0.35,
            pointerEvents: 'none',
          }}
        />

        {/* Entries */}
        {timeline.map((entry, i) => (
          <TimelineEntry key={entry.year} entry={entry} index={i} />
        ))}
      </div>
    </div>
  )
}
