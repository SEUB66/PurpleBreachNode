import type { Block } from '~/lib/content/types'
import type { Locale } from '~/lib/i18n'
import { t } from '~/lib/i18n'
import { Terminal } from './Terminal'
import { Callout, ReadBox } from './Callout'

/** Renders a module's Block[] into the ApplePunk reader layout. */
export function BlockRenderer({ blocks, locale }: { blocks: Block[]; locale: Locale }) {
  return (
    <div className="prose-pbn">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return (
              <h3 key={i} className="mt-9 mb-3 text-neon-cyan">
                {t(block.text, locale)}
              </h3>
            )
          case 'prose':
            return (
              <p key={i} className="my-4 leading-relaxed text-ink">
                {t(block.body, locale)}
              </p>
            )
          case 'terminal':
            return <Terminal key={i} block={block} />
          case 'read':
            return <ReadBox key={i} block={block} locale={locale} />
          case 'callout':
            return <Callout key={i} block={block} locale={locale} />
          default:
            return null
        }
      })}
    </div>
  )
}
