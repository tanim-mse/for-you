/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── BACKGROUNDS ── */
        'bg-void':       'var(--bg-void)',
        'bg-base':       'var(--bg-base)',
        'bg-surface':    'var(--bg-surface)',
        'bg-elevated':   'var(--bg-elevated)',

        /* ── PAPER ── */
        'paper-dark':    'var(--paper-dark)',
        'paper-mid':     'var(--paper-mid)',
        'paper-warm':    'var(--paper-warm)',

        /* ── CANDLELIGHT ── */
        'flame-core':    'var(--flame-core)',
        'flame-warm':    'var(--flame-warm)',
        'flame-amber':   'var(--flame-amber)',
        'flame-deep':    'var(--flame-deep)',
        'flame-ember':   'var(--flame-ember)',

        /* ── TEXT ── */
        'text-primary':   'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary':  'var(--text-tertiary)',
        'text-ghost':     'var(--text-ghost)',

        /* ── ACCENTS ── */
        'ink-primary':   'var(--ink-primary)',
        'ink-faded':     'var(--ink-faded)',
        'gold-bright':   'var(--gold-bright)',
        'gold-muted':    'var(--gold-muted)',
        'blush':         'var(--blush)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        script:  ['EB Garamond', 'Georgia', 'serif'],
        body:    ['Crimson Pro', 'Georgia', 'serif'],
        ui:      ['DM Sans', 'sans-serif'],
      },
      zIndex: {
        'base':    'var(--z-base)',
        'above':   'var(--z-above)',
        'nav':     'var(--z-nav)',
        'overlay': 'var(--z-overlay)',
        'modal':   'var(--z-modal)',
        'body-fx': 'var(--z-body-fx)',
        'cursor':  'var(--z-cursor)',
      },
      boxShadow: {
        'deep':   '0 20px 60px rgba(0,0,0,0.6)',
        'candle': '0 0 40px rgba(255,180,60,0.08)',
      },
    },
  },
  plugins: [],
}
