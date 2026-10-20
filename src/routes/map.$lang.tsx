import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '~/components/ClientOnly'
import { BreachTopology } from '~/components/network/BreachTopology'
import { useBreachSubscriber } from '~/lib/broadcast'
import { useBreachStore } from '~/lib/store/breachStore'

/**
 * Detached (pop-out) Network Map window — 2nd screen command post.
 * Chrome-free; hydrates from the main window over the Broadcast Channel.
 */
export const Route = createFileRoute('/map/$lang')({
  component: DetachedMap,
})

function DetachedMap() {
  useBreachSubscriber()
  const activeModule = useBreachStore((s) => s.activeModule)
  const count = useBreachStore((s) => s.revealed.length)

  return (
    <div className="flex h-dvh flex-col bg-char-950">
      <div className="flex items-center gap-3 border-b border-char-600 bg-char-900 px-4 py-2">
        <span className="font-pixel text-[0.62rem] text-neon-magenta">BREACH TOPOLOGY</span>
        <span className="font-mono text-[0.68rem] text-ink-faint">
          module {activeModule ?? '—'} · {count} revealed
        </span>
        <span className="ml-auto h-2 w-2 animate-pulse-node rounded-full bg-neon-cyan text-neon-cyan" />
      </div>
      <div className="min-h-0 flex-1">
        <ClientOnly
          fallback={
            <div className="grid h-full place-items-center font-mono text-sm text-ink-faint">
              syncing with main window…
            </div>
          }
        >
          <BreachTopology />
        </ClientOnly>
      </div>
    </div>
  )
}
