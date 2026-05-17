/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // dark mode is intentionally not configured — single editorial palette per spec §2.2
  theme: {
    extend: {
      fontFamily: {
        // Display — magazine headlines, hero numerals, wordmark refresh option
        display: ['Fraunces', 'Georgia', 'serif'],
        // Serif — for the IBM Plex Serif role (subheads, certain editorial uses)
        serif: ['"IBM Plex Serif"', 'Georgia', 'serif'],
        // Body — primary reading typeface
        sans: ['"IBM Plex Sans Variable"', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        // Mono — captions, data labels, kickers
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        // Arabic — body and display in AR locale; weight differentiates roles
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 7-token editorial palette — spec §2.2
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        'paper-light': 'rgb(var(--color-paper-light) / <alpha-value>)',
        stone: 'rgb(var(--color-stone) / <alpha-value>)',
        mute: 'rgb(var(--color-mute) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        sienna: 'rgb(var(--color-sienna) / <alpha-value>)',
        field: 'rgb(var(--color-field) / <alpha-value>)',
        signal: 'rgb(var(--color-signal) / <alpha-value>)',
        warn: 'rgb(var(--color-warn) / <alpha-value>)',

        // Product brand-coding tokens — used by ProductBag SVG mockups (per source of truth §1)
        'c-npk':    'rgb(var(--c-npk) / <alpha-value>)',
        'c-mkp':    'rgb(var(--c-mkp) / <alpha-value>)',
        'c-map':    'rgb(var(--c-map) / <alpha-value>)',
        'c-ams':    'rgb(var(--c-ams) / <alpha-value>)',
        'c-nop':    'rgb(var(--c-nop) / <alpha-value>)',
        'c-cn':     'rgb(var(--c-cn) / <alpha-value>)',
        'c-epso':   'rgb(var(--c-epso) / <alpha-value>)',
        'c-ksop':   'rgb(var(--c-ksop) / <alpha-value>)',
        'c-rhodes': 'rgb(var(--c-rhodes) / <alpha-value>)',
        'c-sardi':  'rgb(var(--c-sardi) / <alpha-value>)',
        'c-pesticide': 'rgb(var(--c-pesticide) / <alpha-value>)',
      },
      spacing: {
        // Raw scale — spec §3.1
        'sp-1': '4px',   'sp-2': '8px',   'sp-3': '12px',  'sp-4': '16px',
        'sp-5': '24px',  'sp-6': '32px',  'sp-7': '48px',  'sp-8': '64px',
        'sp-9': '96px',  'sp-10': '144px','sp-11': '200px',
        // Semantic role tokens — spec §3.2
        'section-y':       '144px',
        'section-y-major': '200px',
        'head-to-content': '96px',
        'card-photo-gap':  '32px',
        'card-kicker-gap': '16px',
        'card-head-gap':   '24px',
        'card-summary-gap':'32px',
        'page-x':          'var(--page-margin-x)',
      },
      maxWidth: {
        prose: '60ch',
        stage: '1300px',
      },
      letterSpacing: {
        kicker: '0.22em',
        'kicker-tight': '0.15em',
        'kicker-wide': '0.26em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
