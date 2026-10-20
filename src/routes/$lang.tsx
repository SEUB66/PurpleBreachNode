import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_LOCALE, UI, isLocale, t, type Locale } from '~/lib/i18n'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { useBreachPublisher } from '~/lib/broadcast'

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang)) {
      throw redirect({ to: '/$lang', params: { lang: DEFAULT_LOCALE } })
    }
  },
  component: LangLayout,
})

function LangLayout() {
  const { lang } = Route.useParams()
  const locale = lang as Locale
  // Main window: publish breach snapshots to any detached map window.
  useBreachPublisher()

  return (
    <div className="pbn-scanlines relative flex min-h-dvh flex-col">
      <SiteHeader locale={locale} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-char-600 bg-char-950/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 font-mono text-xs text-ink-faint sm:flex-row sm:items-center">
          <img
            src="/assets/brand/seub-logo-128.webp"
            alt=""
            width={28}
            height={28}
            className="rounded-full opacity-80"
          />
          <span className="text-ink-dim">{t(UI.author, locale)}</span>
          <span className="hidden sm:inline">·</span>
          <span>{t(UI.authorRole, locale)}</span>
          <a href="https://seub.net" className="sm:ml-auto text-neon-cyan hover:text-neon-gold">
            seub.net
          </a>
        </div>
      </footer>
    </div>
  )
}
