import { useLocation, NavLink } from 'react-router-dom'

function IconJournal({ active }) {
  const c = active ? 'var(--flame-warm)' : 'var(--text-tertiary)'
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="2" width="10" height="14" rx="1" stroke={c} strokeWidth="1.2" />
      <line x1="6" y1="6" x2="10" y2="6" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="9" x2="10" y2="9" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="6" y1="12" x2="8"  y2="12" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconReels({ active }) {
  const c = active ? 'var(--flame-warm)' : 'var(--text-tertiary)'
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="12" rx="1" stroke={c} strokeWidth="1.2" />
      <path d="M7 7l5 2.5-5 2.5V7z" fill={c} />
    </svg>
  )
}

function IconBirthday({ active }) {
  const c = active ? 'var(--flame-warm)' : 'var(--text-tertiary)'
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="8" width="12" height="8" rx="1" stroke={c} strokeWidth="1.2" />
      <path d="M9 2c0 0-1.5 2-1.5 3.5S9 8 9 8s1.5-1 1.5-2.5S9 2 9 2z" fill={c} opacity="0.7" />
      <line x1="9" y1="8" x2="9" y2="16" stroke={c} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  )
}

function ActiveDot() {
  return (
    <div style={{
      width: 3, height: 3, borderRadius: '50%',
      background: 'var(--flame-warm)',
      boxShadow: '0 0 6px rgba(255,180,60,0.5)',
      marginTop: 3,
    }} />
  )
}

export default function MobileNav({ visible = true }) {
  const location = useLocation()
  const hash     = location.hash

  if (!visible) return null

  const isActive = (path) => hash === `#${path}`

  const items = [
    { to: '/journal',  Icon: IconJournal,  label: 'Journal'  },
    { to: '/reels',    Icon: IconReels,    label: 'Reels'    },
    { to: '/birthday', Icon: IconBirthday, label: 'Birthday' },
  ]

  return (
    <>
      <style>{`
        @media (min-width: 769px) { .mobile-pill-nav { display: none !important; } }
      `}</style>
      <nav className="mobile-pill-nav" style={{
        position: 'fixed', bottom: 28, left: '50%',
        transform: 'translateX(-50%)', zIndex: 'var(--z-nav)',
        background: 'rgba(17,16,8,0.88)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(139,109,74,0.15)',
        borderRadius: 40, padding: '10px 22px',
        display: 'flex', gap: 28, alignItems: 'center',
      }}>
        {items.map(({ to, Icon, label }) => {
          const active = isActive(to)
          return (
            <NavLink key={to} to={to} title={label} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', textDecoration: 'none',
            }}>
              <Icon active={active} />
              {active && <ActiveDot />}
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
