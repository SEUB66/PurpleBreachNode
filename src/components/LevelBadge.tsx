import { motion } from 'motion/react'
import type { Level, Locale } from '~/content/module'

const COLOR: Record<Level, string> = {
  novice: 'var(--color-why)',
  intermediate: 'var(--color-magenta)',
  expert: 'var(--color-lavender)',
  veteran: 'var(--color-gold)',
}
const LABEL: Record<Level, Record<Locale, string>> = {
  novice: { fr: 'NOVICE', en: 'NOVICE' },
  intermediate: { fr: 'INTERMÉDIAIRE', en: 'INTERMEDIATE' },
  expert: { fr: 'EXPERT', en: 'EXPERT' },
  veteran: { fr: 'VÉTÉRAN', en: 'VETERAN' },
}

export function LevelBadge({ level, locale }: { level: Level; locale: Locale }) {
  return (
    <span className="badge" style={{ ['--bc' as string]: COLOR[level] }}>
      <motion.span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-current"
        animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 8px currentColor' }}
      />
      {LABEL[level][locale]}
    </span>
  )
}
