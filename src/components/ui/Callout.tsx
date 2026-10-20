import type { CalloutBlock, ReadBlock } from '~/lib/content/types'
import { BOX_LABELS, type Locale, t } from '~/lib/i18n'

const ACCENT: Record<CalloutBlock['variant'], string> = {
  why: 'var(--color-why)',
  trap: 'var(--color-trap)',
  remediation: 'var(--color-reme)',
  exercise: 'var(--color-exercise)',
}

const ICON: Record<CalloutBlock['variant'], string> = {
  why: '💡',
  trap: '⚠',
  remediation: '🛡',
  exercise: '🎯',
}

const LABEL: Record<CalloutBlock['variant'], keyof typeof BOX_LABELS> = {
  why: 'why',
  trap: 'trap',
  remediation: 'remediation',
  exercise: 'exercise',
}

export function Callout({ block, locale }: { block: CalloutBlock; locale: Locale }) {
  const accent = ACCENT[block.variant]
  return (
    <div className="pbn-callout my-4" style={{ ['--callout-accent' as string]: accent }}>
      <p className="pbn-callout__title m-0">
        <span aria-hidden className="mr-1.5">
          {ICON[block.variant]}
        </span>
        {t(BOX_LABELS[LABEL[block.variant]], locale)}
        {block.heading && <span className="normal-case tracking-normal"> — {t(block.heading, locale)}</span>}
      </p>
      <p className="mt-1.5 mb-0 text-sm leading-relaxed text-ink">{t(block.body, locale)}</p>
    </div>
  )
}

/** The "READ / LIRE" box — lavender/cyan left rule, interprets machine output. */
export function ReadBox({ block, locale }: { block: ReadBlock; locale: Locale }) {
  return (
    <div
      className="pbn-callout my-4"
      style={{ ['--callout-accent' as string]: 'var(--color-neon-lavender)' }}
    >
      <p className="pbn-callout__title m-0">▸ {t(BOX_LABELS.read, locale)}</p>
      <p className="mt-1.5 mb-0 text-sm leading-relaxed text-ink-dim">{t(block.body, locale)}</p>
    </div>
  )
}
