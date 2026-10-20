import { useState } from 'react'
import { ClientOnly } from '~/components/ClientOnly'
import { BreachTopology } from './BreachTopology'
import { openMapWindow } from '~/lib/broadcast'
import { UI, t, type Locale } from '~/lib/i18n'

/**
 * Collapsible in-page dock for the LiveNetworkMap, with a pop-out button that
 * detaches it to a 2nd-screen window (synced via Broadcast Channel).
 */
export function MapDock({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(true)

  return (
    <aside className="pbn-panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-char-600 px-3 py-2">
        <span className="font-mono text-[0.72rem] uppercase tracking-widest text-neon-cyan">
          Live Network Map
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => openMapWindow(locale)}
            className="pbn-focusable rounded border border-char-600 px-2 py-1 font-mono text-[0.68rem] text-neon-magenta hover:border-neon-magenta"
            title={t(UI.popOutMap, locale)}
          >
            ⧉ {t(UI.popOutMap, locale)}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="pbn-focusable rounded border border-char-600 px-2 py-1 font-mono text-[0.68rem] text-ink-dim hover:border-neon-cyan"
            aria-expanded={open}
          >
            {open ? '—' : '+'}
          </button>
        </div>
      </div>
      {open && (
        <div className="h-[340px] bg-char-950">
          <ClientOnly
            fallback={
              <div className="grid h-full place-items-center font-mono text-xs text-ink-faint">
                booting map…
              </div>
            }
          >
            <BreachTopology />
          </ClientOnly>
        </div>
      )}
      <p className="border-t border-char-600 px-3 py-1.5 font-mono text-[0.66rem] text-ink-faint">
        {t(UI.mapHint, locale)}
      </p>
    </aside>
  )
}
