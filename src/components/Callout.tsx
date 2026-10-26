import type { CalloutBlock, Locale, ReadBlock } from '~/content/module'
import { BOX } from '~/content/module'

const ACCENT: Record<CalloutBlock['variant'], string> = {
  why: 'var(--color-why)',
  trap: 'var(--color-trap)',
  remediation: 'var(--color-reme)',
  exercise: 'var(--color-exercise)',
}
const ICON: Record<CalloutBlock['variant'], string> = {
  why: '◆',
  trap: '▲',
  remediation: '◈',
  exercise: '◎',
}
const KEY: Record<CalloutBlock['variant'], keyof typeof BOX> = {
  why: 'why',
  trap: 'trap',
  remediation: 'remediation',
  exercise: 'exercise',
}

export function Callout({ block, locale }: { block: CalloutBlock; locale: Locale }) {
  return (
    <div className="callout" style={{ ['--co' as string]: ACCENT[block.variant] }}>
      <p className="callout__label m-0">
        <span aria-hidden>{ICON[block.variant]}</span>
        {BOX[KEY[block.variant]][locale]}
        {block.heading && (
          <span className="font-normal normal-case tracking-normal text-ink-dim">
            — {block.heading[locale]}
          </span>
        )}
      </p>
      <p className="mt-2 mb-0 text-[0.92rem] leading-relaxed text-ink">{block.body[locale]}</p>
    </div>
  )
}

export function ReadBox({ block, locale }: { block: ReadBlock; locale: Locale }) {
  return (
    <div className="callout" style={{ ['--co' as string]: 'var(--color-lavender)' }}>
      <p className="callout__label m-0">
        <span aria-hidden>▸</span>
        {BOX.read[locale]}
      </p>
      <p className="mt-2 mb-0 text-[0.9rem] leading-relaxed text-ink-dim">{block.body[locale]}</p>
    </div>
  )
}
