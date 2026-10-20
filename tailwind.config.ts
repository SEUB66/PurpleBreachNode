import type { Config } from 'tailwindcss'

/**
 * PurpleBreachNode — "ApplePunk" / Synthwave design system.
 *
 * Tailwind v4 reads design tokens from CSS (`@theme` in src/styles/app.css).
 * This JS config is loaded via `@config` for the pieces that are clearer in
 * TS: content globs, the typography plugin, textures (carbon fibre / honeycomb)
 * and keyframes. Colour/font tokens live in app.css as the single source of
 * truth and are usable as `bg-char-900`, `text-neon-cyan`, `font-pixel`, etc.
 *
 * HARD RULE: no white (#fff) and no navy backgrounds anywhere. The darkest
 * surface is charcoal/aubergine (#140826 / #1A053A), never marine blue.
 */
export default {
  darkMode: 'class', // the site is dark-only; this just pins the strategy
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        // Subtle carbon-fibre weave (2px diagonal twill on near-black).
        'carbon':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='8' height='8' fill='%23140826'/%3E%3Cpath d='M0 0h4v4H0zM4 4h4v4H4z' fill='%231d0c33' fill-opacity='0.55'/%3E%3C/svg%3E\")",
        // Honeycomb mesh for hero / panel accents.
        'honeycomb':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='none' stroke='%23ff007f' stroke-opacity='0.06' stroke-width='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15zM14 .5l13 7.5v15'/%3E%3C/g%3E%3C/svg%3E\")",
        // Synthwave sun — radial gradient used behind hero/logo marks.
        'synth-sun':
          'radial-gradient(circle at 50% 120%, #ffd700 0%, #ff8a00 22%, #ff007f 48%, transparent 72%)',
        'grid-floor':
          'linear-gradient(transparent 0%, #140826 90%), repeating-linear-gradient(90deg, rgba(255,0,127,0.18) 0 1px, transparent 1px 48px), repeating-linear-gradient(0deg, rgba(0,255,255,0.12) 0 1px, transparent 1px 48px)',
      },
      boxShadow: {
        'neon-cyan': '0 0 0 1px rgba(0,255,255,0.4), 0 0 16px -2px rgba(0,255,255,0.45)',
        'neon-magenta': '0 0 0 1px rgba(255,0,127,0.45), 0 0 18px -2px rgba(255,0,127,0.5)',
        'neon-gold': '0 0 0 1px rgba(255,215,0,0.45), 0 0 16px -2px rgba(255,215,0,0.45)',
      },
      keyframes: {
        'cursor-blink': { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        'flicker': {
          '0%,19%,21%,23%,25%,54%,56%,100%': { opacity: '1' },
          '20%,24%,55%': { opacity: '0.72' },
        },
        'scan': { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        'pulse-node': {
          '0%,100%': { filter: 'drop-shadow(0 0 2px currentColor)' },
          '50%': { filter: 'drop-shadow(0 0 10px currentColor)' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 1.1s steps(1) infinite',
        flicker: 'flicker 4s linear infinite',
        scan: 'scan 6s linear infinite',
        'pulse-node': 'pulse-node 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
