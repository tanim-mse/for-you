import { useState, useEffect } from 'react'

export default function Candle({ blown, onBlow }) {
  const [showSmoke, setShowSmoke] = useState(false)

  useEffect(() => {
    if (blown) {
      setShowSmoke(true)
      const id = setTimeout(() => setShowSmoke(false), 2500)
      return () => clearTimeout(id)
    }
  }, [blown])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Page glow from candle — only when lit */}
      {!blown && (
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,180,60,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Flame */}
      {!blown && (
        <div style={{ position: 'relative', width: 20, marginBottom: -2, zIndex: 1 }}>
          {/* Outer flame */}
          <div
            className="flame-outer"
            style={{
              width: 20,
              height: 34,
              background: `radial-gradient(ellipse at 50% 80%,
                rgba(255,244,204,0.95) 0%,
                rgba(255,200,80,0.85) 25%,
                rgba(232,140,20,0.70) 55%,
                rgba(180,80,10,0.20) 80%,
                transparent 100%)`,
              borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
              boxShadow: `
                0 0 14px rgba(255,200,60,0.7),
                0 0 30px rgba(220,140,20,0.40),
                0 0 60px rgba(180,100,10,0.20),
                0 0 100px rgba(150,80,10,0.10)
              `,
              animation: 'flameWaver 1.4s ease-in-out infinite alternate',
              position: 'relative',
            }}
          >
            {/* Inner flame core */}
            <div
              style={{
                position: 'absolute',
                bottom: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 8,
                height: 16,
                background: `radial-gradient(ellipse,
                  rgba(255,255,240,1) 0%,
                  rgba(255,244,204,0.9) 40%,
                  transparent 75%)`,
                borderRadius: '50% 50% 30% 30% / 50% 50% 40% 40%',
              }}
            />
          </div>
        </div>
      )}

      {/* Smoke — only after blow */}
      {showSmoke && (
        <div
          style={{
            width: 3,
            height: 20,
            background: 'linear-gradient(to top, rgba(200,200,200,0.15), transparent)',
            borderRadius: 2,
            marginBottom: -2,
            animation: 'smokeRise 2.5s ease-out forwards',
            zIndex: 1,
          }}
        />
      )}

      {/* Wick */}
      <div
        style={{
          width: 2,
          height: 14,
          background: '#2A1A0A',
          borderRadius: 1,
          transform: 'rotate(4deg)',
          transformOrigin: 'bottom center',
          zIndex: 1,
        }}
      />

      {/* Candle body */}
      <div
        style={{
          position: 'relative',
          width: 22,
          height: 110,
          background: 'linear-gradient(to right, #E0CCAA 0%, #F5ECD7 40%, #D4B896 100%)',
          borderRadius: '3px 3px 2px 2px',
          boxShadow: `
            inset -3px 0 8px rgba(0,0,0,0.12),
            inset 3px 0 6px rgba(255,230,180,0.08)
          `,
          zIndex: 1,
        }}
      >
        {/* Wax drip */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            right: 3,
            width: 8,
            height: 18,
            background: '#D4B896',
            borderRadius: '0 0 6px 6px',
            opacity: 0.8,
          }}
        />
      </div>

      <style>{`
        @keyframes flameWaver {
          0%   { transform: scale(1.00, 1.00) translateX(0px)   rotate(-1.5deg); }
          20%  { transform: scale(0.97, 1.03) translateX(-1px)  rotate(1deg);    }
          40%  { transform: scale(1.02, 0.98) translateX(1.5px) rotate(-0.5deg); }
          60%  { transform: scale(0.98, 1.02) translateX(-0.5px)rotate(2deg);    }
          80%  { transform: scale(1.01, 0.99) translateX(0.5px) rotate(-1deg);   }
          100% { transform: scale(1.00, 1.01) translateX(-1px)  rotate(1.5deg);  }
        }
        @keyframes smokeRise {
          0%   { opacity: 0.5; transform: translateY(0)    scaleX(1); }
          50%  { opacity: 0.2; transform: translateY(-20px) scaleX(2); }
          100% { opacity: 0;   transform: translateY(-40px) scaleX(3); }
        }
      `}</style>
    </div>
  )
}
