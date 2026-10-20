import { Link, createFileRoute } from '@tanstack/react-router'
import { UI, t, type Locale } from '~/lib/i18n'
import { roadmap, isAuthored } from '~/lib/content/modules'
import { LevelBadge } from '~/components/ui/LevelBadge'

export const Route = createFileRoute('/$lang/')({
  component: Landing,
})

function Landing() {
  const { lang } = Route.useParams()
  const locale = lang as Locale

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="pbn-scanlines relative overflow-hidden rounded-2xl border border-char-600 bg-char-800 bg-honeycomb px-6 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 -z-0 h-80 w-80 -translate-x-1/2 rounded-full bg-synth-sun opacity-60 blur-[2px]"
        />
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-cyan">
            Kali Linux · Édition 1 · fr-CA / en
          </p>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-2xl leading-relaxed text-ink sm:text-3xl">
            Purple<span className="text-neon-magenta">Breach</span>Node
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-ink-dim">
            {t(UI.tagline, locale)}
          </p>
          <p className="mx-auto mt-2 max-w-xl font-mono text-sm text-ink-faint">
            {t(UI.subtitle, locale)}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <LevelBadge level="novice" locale={locale} />
            <LevelBadge level="intermediate" locale={locale} />
            <LevelBadge level="expert" locale={locale} />
            <LevelBadge level="veteran" locale={locale} />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/$lang/manual/$moduleId"
              params={{ lang: locale, moduleId: '01' }}
              className="pbn-focusable rounded-lg border border-neon-cyan px-5 py-2.5 font-mono text-sm text-neon-cyan shadow-neon-cyan transition hover:bg-neon-cyan hover:text-char-950"
            >
              {t(UI.startPath, locale)} →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Golden rule (legal) ---- */}
      <section
        className="pbn-callout mt-8"
        style={{ ['--callout-accent' as string]: 'var(--color-trap)' }}
      >
        <p className="pbn-callout__title m-0">⚠ {t(UI.legalTitle, locale)}</p>
        <p className="mt-1.5 mb-0 text-sm leading-relaxed text-ink">
          {locale === 'fr'
            ? "On ne teste que des systèmes que l’on possède, ou pour lesquels on détient une autorisation écrite, explicite et préalable du propriétaire. Pas d’autorisation = pas de test. Jamais « juste pour voir »."
            : 'You only test systems you own, or for which you hold the owner’s written, explicit, prior authorization. No authorization = no test. Never "just to see".'}
        </p>
      </section>

      {/* ---- Roadmap ---- */}
      <section id="modules" className="mt-12 scroll-mt-20">
        <h2 className="text-base text-ink">{t(UI.modules, locale)}</h2>
        <p className="mt-1 font-mono text-xs text-ink-faint">
          {locale === 'fr'
            ? '27 modules. Fais le drill de chacun avant de passer au suivant.'
            : '27 modules. Drill each one before moving to the next.'}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roadmap.map((m) => {
            const authored = isAuthored(m.id)
            const card = (
              <div
                className={[
                  'pbn-panel h-full px-4 py-3 transition',
                  authored
                    ? 'hover:border-neon-cyan hover:shadow-neon-cyan'
                    : 'opacity-55',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-[0.7rem] text-neon-gold">{m.id}</span>
                  <LevelBadge level={m.level} locale={locale} />
                </div>
                <p className="mt-2 text-sm text-ink">{t(m.title, locale)}</p>
                <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-wider text-ink-faint">
                  {t(m.part, locale)}
                </p>
                {!authored && (
                  <p className="mt-2 font-mono text-[0.64rem] text-neon-lavender">
                    {locale === 'fr' ? 'bientôt' : 'soon'}
                  </p>
                )}
              </div>
            )
            return authored ? (
              <Link
                key={m.id}
                to="/$lang/manual/$moduleId"
                params={{ lang: locale, moduleId: m.id }}
                className="pbn-focusable block"
              >
                {card}
              </Link>
            ) : (
              <div key={m.id}>{card}</div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
