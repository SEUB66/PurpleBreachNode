import { useEffect } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { BOX_LABELS, UI, t, type Locale } from '~/lib/i18n'
import { getModule, roadmap, isAuthored } from '~/lib/content/modules'
import { LevelBadge } from '~/components/ui/LevelBadge'
import { BlockRenderer } from '~/components/ui/BlockRenderer'
import { MapDock } from '~/components/network/MapDock'
import { useBreachStore } from '~/lib/store/breachStore'

export const Route = createFileRoute('/$lang/manual/$moduleId')({
  loader: ({ params }) => {
    const mod = getModule(params.moduleId)
    if (!mod) throw notFound()
    return { moduleId: mod.meta.id }
  },
  component: ModuleReader,
})

function ModuleReader() {
  const { lang, moduleId } = Route.useParams()
  const locale = lang as Locale
  const mod = getModule(moduleId)!
  const revealModule = useBreachStore((s) => s.revealModule)

  // Light up the map for this module when the reader opens.
  useEffect(() => {
    revealModule(mod.meta.id, mod.topology)
  }, [mod.meta.id, mod.topology, revealModule])

  const idx = roadmap.findIndex((m) => m.id === mod.meta.id)
  const prev = idx > 0 ? roadmap[idx - 1] : undefined
  const next = idx < roadmap.length - 1 ? roadmap[idx + 1] : undefined

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <article className="min-w-0">
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-neon-lavender">
          {t(mod.meta.part, locale)}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-pixel text-base text-neon-gold">{mod.meta.id}</span>
          <h1 className="text-xl text-ink">{t(mod.meta.title, locale)}</h1>
          <LevelBadge level={mod.meta.level} locale={locale} />
        </div>

        <div
          className="pbn-callout mt-5"
          style={{ ['--callout-accent' as string]: 'var(--color-neon-cyan)' }}
        >
          <p className="pbn-callout__title m-0">▸ {t(BOX_LABELS.objective, locale)}</p>
          <p className="mt-1.5 mb-0 text-sm leading-relaxed text-ink">
            {t(mod.meta.objective, locale)}
          </p>
        </div>

        <div className="mt-6">
          <BlockRenderer blocks={mod.blocks} locale={locale} />
        </div>

        {/* prev / next */}
        <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-char-600 pt-6">
          {prev && isAuthored(prev.id) ? (
            <Link
              to="/$lang/manual/$moduleId"
              params={{ lang: locale, moduleId: prev.id }}
              className="pbn-focusable pbn-panel px-4 py-3 font-mono text-xs text-ink-dim hover:border-neon-cyan"
            >
              ← {prev.id} · {t(prev.title, locale)}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={isAuthored(next.id) ? '/$lang/manual/$moduleId' : '/$lang'}
              params={isAuthored(next.id) ? { lang: locale, moduleId: next.id } : { lang: locale }}
              className="pbn-focusable pbn-panel ml-auto px-4 py-3 text-right font-mono text-xs text-neon-cyan hover:border-neon-cyan"
            >
              {t(UI.next, locale)}: {next.id} · {t(next.title, locale)} →
            </Link>
          )}
        </nav>
      </article>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <MapDock locale={locale} />
      </div>
    </div>
  )
}
