// src/components/BookPage.jsx
// A single page in the book. Handles paper texture, margins, page number.
// 'side' prop: 'left' | 'right' — affects inner gutter direction.

export default function BookPage({ side = 'left', pageNumber, children, style = {} }) {
  const isLeft = side === 'left'

  return (
    <div
      className="book-page"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--paper-dark)',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E"),
          linear-gradient(135deg, var(--bg-surface) 0%, var(--paper-dark) 50%, var(--bg-surface) 100%)
        `,
        backgroundSize: '150px 150px, 100% 100%',
        // Gutter shadow on the inner edge (shadow side faces the spine)
        boxShadow: isLeft
          ? 'inset -12px 0 24px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(139,109,74,0.08)'
          : 'inset 12px 0 24px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(139,109,74,0.08)',
        // Inner gutter: left page has larger right padding (toward spine), right page larger left
        padding: isLeft
          ? '48px 40px 56px 56px'
          : '48px 56px 56px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Subtle top edge line */}
      <div style={{
        position: 'absolute',
        top: 28,
        left: isLeft ? 56 : 40,
        right: isLeft ? 40 : 56,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(139,109,74,0.12), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ height: '100%', position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Page number */}
      {pageNumber && (
        <div style={{
          position: 'absolute',
          bottom: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          color: 'var(--text-ghost)',
          letterSpacing: '0.12em',
          opacity: 0.6,
        }}>
          {pageNumber}
        </div>
      )}

      {/* Subtle bottom edge line */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        left: isLeft ? 56 : 40,
        right: isLeft ? 40 : 56,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(139,109,74,0.08), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
