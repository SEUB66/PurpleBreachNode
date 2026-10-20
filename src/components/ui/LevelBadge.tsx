import type { Level } from '~/lib/content/types'
import { UI, type Locale, t } from '~/lib/i18n'

const COLOR: Record<Level, string> = {
  novice: 'var(--color-lvl-novice)',
  intermediate: 'var(--color-lvl-inter)',
  expert: 'var(--color-lvl-expert)',
  veteran: 'var(--color-lvl-veteran)',
}

const LABEL: Record<Level, keyof typeof UI.level> = {
  novice: 'novice',
  intermediate: 'intermediate',
  expert: 'expert',
  veteran: 'veteran',
}

export function LevelBadge({ level, locale }: { level: Level; locale: Locale }) {
  return (
    <span className="pbn-badge" style={{ color: COLOR[level] }}>
      <span
        aria-hidden
        style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: 9999,
          background: 'currentColor',
          boxShadow: '0 0 8px currentColor',
        }}
      />
      {t(UI.level[LABEL[level]], locale)}
    </span>
  )
}
