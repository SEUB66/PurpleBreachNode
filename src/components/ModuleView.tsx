import { useState, type ReactNode } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import type { Block, Locale, ModuleDoc } from '~/content/module'
import { BOX } from '~/content/module'
import { LevelBadge } from './LevelBadge'
import { Callout, ReadBox } from './Callout'
import { Terminal } from './Terminal'

const EASE = [0.22, 1, 0.36, 1] as const

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  switch (block.type) {
    case 'heading':
      return (
        <Reveal>
          <h3 className="mt-12 mb-1 text-lg glow-cyan">{block.text[locale]}</h3>
          <div className="mb-2 h-px w-16 bg-gradient-to-r from-cyan to-transparent" />
        </Reveal>
      )
    case 'prose':
      return (
        <Reveal>
          <p className="my-4 leading-relaxed text-ink-dim">{block.body[locale]}</p>
        </Reveal>
      )
    case 'terminal':
      return <Terminal block={block} />
    case 'read':
      return (
        <Reveal>
          <ReadBox block={block} locale={locale} />
        </Reveal>
      )
    case 'callout':
      return (
        <Reveal>
          <Callout block={block} locale={locale} />
        </Reveal>
      )
    default:
      return null
  }
}

export function ModuleView({ doc }: { doc: ModuleDoc }) {
  const [locale, setLocale] = useState<Locale>('fr')
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <div className="relative min-h-dvh">
      {/* scroll progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(90deg, var(--color-cyan), var(--color-magenta), var(--color-gold))',
          boxShadow: '0 0 12px rgba(255,45,149,0.6)',
        }}
      />

      {/* nav */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="sticky top-0 z-40"
      >
        <div className="glass mx-auto mt-4 flex max-w-5xl items-center gap-3 rounded-2xl px-4 py-2.5 sm:px-5">
          <img
            src="/assets/brand/logo-128.webp"
            alt="SEUB"
            width={34}
            height={34}
            className="rounded-full ring-1 ring-white/15"
          />
          <span className="font-display text-sm font-semibold tracking-tight">
            Purple<span className="glow-magenta">Breach</span>Node
          </span>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle locale={locale} onChange={setLocale} />
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-3xl px-5 pb-28 pt-10">
        {/* module hero */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
          className="font-mono text-xs uppercase tracking-[0.28em] text-lavender"
        >
          {doc.part[locale]}
        </motion.p>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
            className="font-display text-5xl font-bold glow-gold"
          >
            {doc.id}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.18 }}
            className="text-3xl sm:text-4xl"
          >
            {doc.title[locale]}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.28 }}
          >
            <LevelBadge level={doc.level} locale={locale} />
          </motion.div>
        </div>

        {/* objective */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.32 }}
          className="glass glass-accent mt-7 overflow-hidden rounded-2xl p-5"
        >
          <p className="callout__label m-0" style={{ ['--co' as string]: 'var(--color-cyan)' }}>
            <span aria-hidden>▸</span> {BOX.objective[locale]}
          </p>
          <p className="mt-2 mb-0 leading-relaxed text-ink">{doc.objective[locale]}</p>
        </motion.div>

        {/* body */}
        <div className="prose-pbn mt-4 max-w-none">
          {doc.blocks.map((block, i) => (
            <BlockView key={i} block={block} locale={locale} />
          ))}
        </div>

        {/* footer cta */}
        <Reveal>
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <button className="btn-neon group">
              {locale === 'fr' ? 'Module suivant' : 'Next module'}
              <motion.span
                aria-hidden
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </button>
            <p className="font-mono text-xs text-ink-faint">
              Sébastien Germain — SEUB ·{' '}
              <a href="https://seub.net" className="text-cyan hover:text-gold">
                seub.net
              </a>
            </p>
          </div>
        </Reveal>
      </main>
    </div>
  )
}

function LangToggle({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="relative flex rounded-full border border-white/12 bg-white/5 p-0.5 font-mono text-xs">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className="relative z-10 rounded-full px-3 py-1 uppercase transition-colors"
          style={{ color: locale === l ? '#0c0518' : 'var(--color-ink-dim)' }}
        >
          {l === 'fr' ? 'FR' : 'EN'}
          {locale === l && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 -z-10 rounded-full"
              style={{ background: 'linear-gradient(120deg, var(--color-cyan), var(--color-magenta))' }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
