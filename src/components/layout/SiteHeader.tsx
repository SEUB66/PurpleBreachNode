import { Link, useRouterState } from '@tanstack/react-router'
import { UI, otherLocale, t, type Locale } from '~/lib/i18n'

/** Swap the leading /:lang segment while keeping the rest of the path. */
function swapLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split('/')
  // parts[0] = "", parts[1] = lang
  if (parts.length > 1) parts[1] = to
  return parts.join('/') || `/${to}`
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const other = otherLocale(locale)

  return (
    <header className="sticky top-0 z-40 border-b border-char-600 bg-char-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/$lang" params={{ lang: locale }} className="group flex items-center gap-3">
          <img
            src="/assets/brand/seub-logo-128.webp"
            alt="SEUB"
            width={36}
            height={36}
            className="rounded-full ring-1 ring-char-600 transition group-hover:ring-neon-cyan"
          />
          <span className="font-pixel text-[0.7rem] leading-tight text-ink">
            Purple<span className="text-neon-magenta">Breach</span>Node
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 font-mono text-xs">
          <Link
            to="/$lang"
            params={{ lang: locale }}
            hash="modules"
            className="pbn-focusable rounded px-3 py-1.5 text-ink-dim hover:bg-char-700 hover:text-neon-cyan"
          >
            {t(UI.modules, locale)}
          </Link>
          <a
            href={swapLocalePath(pathname, other)}
            className="pbn-focusable ml-1 rounded border border-char-600 px-3 py-1.5 text-neon-gold hover:border-neon-gold"
            aria-label={`Switch language to ${t(UI.langName, other)}`}
          >
            {t(UI.switchTo, locale)}
          </a>
        </nav>
      </div>
    </header>
  )
}
