// Reusable SVG ornament — horizontal line with diamond center
// Used on Journal cover, Letters header, AuthGate card, etc.

export default function Ornament({ width = 120, opacity = 0.55, flipped = false }) {
  return (
    <svg
      width={width}
      height="12"
      viewBox="0 0 120 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        margin: '0 auto',
        opacity,
        transform: flipped ? 'scaleY(-1)' : undefined,
      }}
    >
      {/* Left segment */}
      <line x1="0" y1="6" x2="54" y2="6" stroke="#6B4E35" strokeWidth="1" />
      {/* Diamond */}
      <rect
        x="57" y="3"
        width="6" height="6"
        fill="#6B4E35"
        transform="rotate(45 60 6)"
      />
      {/* Right segment */}
      <line x1="66" y1="6" x2="120" y2="6" stroke="#6B4E35" strokeWidth="1" />
    </svg>
  )
}
