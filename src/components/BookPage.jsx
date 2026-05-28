// src/components/BookPage.jsx
// Warm parchment page. Tighter padding so text doesn't clip.
// Overflow hidden ensures nothing bleeds outside the page boundary.

export default function BookPage({ side = 'left', pageNumber, children }) {
  const isLeft = side === 'left'

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      backgroundColor: '#F5ECD7',
      backgroundImage: `
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E"),
        radial-gradient(ellipse at 30% 20%, #FFF8ED 0%, #F0E0C0 45%, #E8D0A8 100%)
      `,
      backgroundSize: '300px 300px, 100% 100%',
      boxShadow: isLeft
        ? 'inset -8px 0 18px rgba(100,60,20,0.10)'
        : 'inset 8px 0 18px rgba(100,60,20,0.10)',
      // Padding: top, outer edge, bottom (leaves room for page number), inner gutter
      padding: isLeft ? '28px 28px 36px 36px' : '28px 36px 36px 28px',
    }}>

      {/* Faint ruled lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(160,120,60,0.07) 27px, rgba(160,120,60,0.07) 28px)',
        backgroundPosition: '0 58px',
      }} />

      {/* Red margin line — left pages only */}
      {isLeft && (
        <div style={{
          position: 'absolute', left: 28, top: 0, bottom: 0,
          width: 1, background: 'rgba(200,80,60,0.28)',
          pointerEvents: 'none', zIndex: 1,
        }} />
      )}

      {/* Top rule */}
      <div style={{
        position: 'absolute', top: 22,
        left: isLeft ? 36 : 28, right: isLeft ? 28 : 36,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(140,90,30,0.18), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Content — height accounts for top padding (36px) + bottom padding (48px) = 84px */}
      <div style={{ position: 'relative', zIndex: 2, height: 'calc(100% - 64px)', overflow: 'hidden' }}>
        {children}
      </div>

      {/* Bottom rule */}
      <div style={{
        position: 'absolute', bottom: 32,
        left: isLeft ? 36 : 28, right: isLeft ? 28 : 36,
        height: 1,
        background: 'linear-gradient(to right, transparent, rgba(140,90,30,0.13), transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Page number */}
      {pageNumber && (
        <div style={{
          position: 'absolute', bottom: 14, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic', fontSize: 11,
          color: 'rgba(100,65,25,0.45)',
          letterSpacing: '0.08em', zIndex: 3, userSelect: 'none',
        }}>
          {pageNumber}
        </div>
      )}
    </div>
  )
}
