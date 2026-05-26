// src/components/BookPage.jsx
// Redesigned: warm parchment page, black readable text, real book feel.
// Left pages get the autumn-leaf border treatment (SVG, stays on-theme).

export default function BookPage({ side = 'left', pageNumber, children, style = {} }) {
  const isLeft = side === 'left'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // Warm parchment background — much lighter than before, readable
        backgroundColor: '#F5ECD7',
        backgroundImage: `
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E"),
          radial-gradient(ellipse at 30% 20%, #FFF8ED 0%, #F0E0C0 40%, #E8D0A8 100%)
        `,
        backgroundSize: '300px 300px, 100% 100%',
        // Spine shadow
        boxShadow: isLeft
          ? 'inset -10px 0 20px rgba(100,60,20,0.12), inset -1px 0 0 rgba(100,60,20,0.08)'
          : 'inset 10px 0 20px rgba(100,60,20,0.12), inset 1px 0 0 rgba(100,60,20,0.08)',
        // Content padding — generous margins, inner gutter toward spine
        padding: isLeft
          ? '52px 44px 60px 60px'
          : '52px 60px 60px 44px',
        ...style,
      }}
    >
      {/* Subtle ruled lines — like real journal paper, very faint */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(160,120,60,0.08) 31px, rgba(160,120,60,0.08) 32px)',
        backgroundPosition: '0 72px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Left decorative border — only on left pages, very subtle vine */}
      {isLeft && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 32,
          background: 'linear-gradient(to right, rgba(180,100,30,0.06), transparent)',
          borderRight: '1px solid rgba(180,100,30,0.12)',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {/* Small decorative dots along left margin */}
          {[15, 28, 42, 58, 72].map((pct, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${pct}%`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: i % 2 === 0 ? 4 : 3,
              height: i % 2 === 0 ? 4 : 3,
              borderRadius: '50%',
              background: 'rgba(180,100,30,0.25)',
            }} />
          ))}
        </div>
      )}

      {/* Top edge decorative line */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: isLeft ? 40 : 32,
        right: isLeft ? 32 : 40,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(140,90,30,0.20), transparent)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Content — above the ruled lines */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>

      {/* Bottom edge line */}
      <div style={{
        position: 'absolute',
        bottom: 38,
        left: isLeft ? 40 : 32,
        right: isLeft ? 32 : 40,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(140,90,30,0.15), transparent)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Page number */}
      {pageNumber && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          ...(isLeft ? { left: '50%', transform: 'translateX(-50%)' } : { left: '50%', transform: 'translateX(-50%)' }),
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: 11,
          color: 'rgba(100,65,25,0.5)',
          letterSpacing: '0.08em',
          zIndex: 3,
          userSelect: 'none',
        }}>
          {pageNumber}
        </div>
      )}
    </div>
  )
}
