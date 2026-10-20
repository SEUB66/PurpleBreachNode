# PurpleBreachNode — The Offensive Security Field Manual

Bilingual (fr-CA / en) web platform for the Kali Linux offensive-security field
manual. Pragmatic, terminal-veteran tone. Understand, test, **and defend** —
every offensive technique ships with its `REMEDIATION`.

> **Golden rule.** You only test systems you own, or for which you hold the
> owner's written, explicit, prior authorization. No authorization = no test.

## Stack (bleeding-edge only)

- **[TanStack Start](https://tanstack.com/start)** (Router + Query-ready) on
  **Vite 6** + **TypeScript** — SSR/SSG, file-based routing, streaming. No
  legacy CRA/SPA bundler anywhere.
- **Tailwind CSS v4** (CSS-first `@theme`, first-party Vite plugin).
- **React 19**.
- **[@xyflow/react](https://reactflow.dev)** for the `LiveNetworkMap`.
- **Zustand** + **Broadcast Channel API** for the detachable 2nd-screen map.

## Design system — "ApplePunk" / Synthwave

Charcoal / aubergine surfaces (`#140826` / `#1A053A`), neon cyan / magenta /
lavender / Dijon-gold accents, carbon-fibre + honeycomb textures, CRT
scanlines. **No white, no navy.** Pixel type (`Press Start 2P`, `VT323`) for
titles/logos; technical mono (`Share Tech Mono`, `Orbitron`) for body + code.
Tokens live in `src/styles/app.css` (`@theme`); textures/keyframes in
`tailwind.config.ts`.

## Killer feature — `<LiveNetworkMap/>` / `<BreachTopology/>`

An interactive network topology that grows as the reader advances: IPs appear
during recon, a cyan reverse-shell line lights up at exploitation, targets turn
magenta on compromise, and the Active Directory "shortest path to Domain Admin"
glows red. It **pops out to a second screen** (`openMapWindow`) and stays in
real-time sync with the main window over the Broadcast Channel API — a purple-
team command post, not just a book.

## Project layout

```
public/assets/brand/      optimized WebP logo / card / banner (from seub.net)
src/
  routes/                 TanStack file-based routes
    __root.tsx            html shell, fonts, meta
    index.tsx             / → default locale
    $lang.tsx             locale layout (header, footer, map publisher)
    $lang/index.tsx       landing (hero, golden rule, 27-module roadmap)
    $lang/manual/$moduleId.tsx   module reader + MapDock
    map.$lang.tsx         detached pop-out map window
  components/
    ui/                   Terminal, LevelBadge, Callout, ReadBox, BlockRenderer
    network/              BreachTopology, MapDock
    layout/               SiteHeader
  lib/
    i18n/                 locales, box labels (WHY/TRAP/REMEDIATION/READ), lexicon rule
    content/              content model (types) + modules/ registry
    store/                breachStore (Zustand)
    broadcast.ts          Broadcast Channel bridge + pop-out
  styles/app.css          root stylesheet (design tokens)
```

## Content model

Modules are authored as typed `ModuleDoc` objects (`src/lib/content/types.ts`)
with bilingual `Bi` strings. Native tooling/command names (`handshake`,
`pass-the-hash`, `phishing`, `payload`, `reverse shell`, `nmap`, …) stay in
English in **both** locales — only prose and box labels are translated. Each
module may carry `topology` mutations that drive the LiveNetworkMap.

Module 01 (`Survie sous Linux` / `Linux survival`) is fully authored as the
reference implementation; the remaining 26 are declared in the roadmap and get
translated module-by-module.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000  (routeTree.gen.ts is generated here)
pnpm typecheck
pnpm build
```

---

Sébastien Germain — SEUB · [seub.net](https://seub.net)
