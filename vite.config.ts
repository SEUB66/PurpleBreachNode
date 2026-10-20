import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// PurpleBreachNode — bleeding-edge TanStack Start + Vite + Tailwind v4.
// SSR/SSG-capable. No legacy CRA/SPA bundler anywhere in this stack.
export default defineConfig({
  server: { port: 3000 },
  plugins: [
    // Resolve the "~/*" path alias from tsconfig.
    tsConfigPaths({ projects: ['./tsconfig.json'] }),
    // Tailwind v4 via its first-party Vite plugin (no PostCSS step needed).
    tailwindcss(),
    // TanStack Start: file-based routing, SSR, server functions, streaming.
    tanstackStart({
      // Pre-render the public manual for SSG-grade performance.
      prerender: { enabled: true, crawlLinks: true },
      // The detached map windows open via window.open (no crawlable <a>),
      // so list them explicitly to get static HTML on a static host.
      pages: [{ path: '/map/fr' }, { path: '/map/en' }],
    }),
    viteReact(),
  ],
})
