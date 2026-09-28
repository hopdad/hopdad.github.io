/** @type {import('tailwindcss').Config} */

// Semantic colors are CSS variables holding RGB channels (see global.css), so
// Tailwind opacity modifiers like `bg-page/80` keep working in both themes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Some Outdoors brand palette
        lake: '#1B3A4B',
        moss: '#3D5A3A',
        cream: '#F4EFE3',
        rust: '#C75B30',
        bone: '#FBF8F1',
        topo: '#9A8E76',
        stone: '#445158',
        birch: '#E8E0CD',
        success: '#5C7A3F',
        warning: '#C99634',
        error: '#A33D2A',
        // Theme-aware roles
        page: token('page'),
        'page-alt': token('page-alt'),
        surface: token('surface'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'), // brand rust: lines, marks, and decoration
        'accent-fill': token('accent-fill'), // rust for fills carrying bone text (AA)
        'accent-ink': token('accent-ink'), // rust tuned to pass AA as small text
        'accent-display': token('accent-display'), // rust for large display type
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid typography scale from spec, extended with larger display sizes
        mega: ['clamp(4rem, 15.5vw, 17rem)', { lineHeight: '0.82', letterSpacing: '-0.05em' }],
        'display-2xl': [
          'clamp(2.75rem, 5.7vw, 6.25rem)',
          { lineHeight: '1', letterSpacing: '-0.035em' },
        ],
        'display-xl': [
          'clamp(2.5rem, 5vw, 4.75rem)',
          { lineHeight: '1.02', letterSpacing: '-0.03em' },
        ],
        'display-lg': [
          'clamp(2.25rem, 4.2vw, 3.75rem)',
          { lineHeight: '1.06', letterSpacing: '-0.025em' },
        ],
        'heading-lg': [
          'clamp(1.75rem, 3vw, 2.25rem)',
          { lineHeight: '1.2', letterSpacing: '-0.01em' },
        ],
        'heading-md': ['clamp(1.375rem, 2.5vw, 1.75rem)', { lineHeight: '1.25' }],
        'body-lg': ['clamp(1.125rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
        body: ['clamp(1rem, 1.25vw, 1.0625rem)', { lineHeight: '1.65' }],
        caption: ['clamp(0.75rem, 0.9vw, 0.8125rem)', { lineHeight: '1.5' }],
        eyebrow: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.16em' }],
      },
      maxWidth: {
        content: '64rem', // 1024px
        wide: '80rem', // 1280px
        prose: '42rem',
      },
      borderRadius: {
        card: '8px',
        btn: '4px',
      },
      spacing: {
        section: '5rem', // 80px mobile
        'section-lg': '7.5rem', // 120px desktop
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
