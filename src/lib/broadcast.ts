import { useEffect, useRef } from 'react'
import { useBreachStore, type BreachSnapshot } from '~/lib/store/breachStore'

/**
 * Broadcast Channel bridge for the detachable (pop-out) Network Map.
 *
 * The main window and the detached map window run in the SAME origin, so they
 * can talk peer-to-peer over a BroadcastChannel — no server, no websocket.
 * The main window is the source of truth; it publishes a full snapshot on
 * every change. The detached window hydrates from snapshots and can ask for
 * one on open ("sync" request).
 */

const CHANNEL = 'pbn-breach'

type Msg =
  | { kind: 'snapshot'; payload: BreachSnapshot }
  | { kind: 'sync-request' }

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null
  return new BroadcastChannel(CHANNEL)
}

/** Call in the MAIN window: publishes snapshots + answers sync requests. */
export function useBreachPublisher() {
  const chanRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    const chan = getChannel()
    if (!chan) return
    chanRef.current = chan

    const publish = () => {
      chan.postMessage({ kind: 'snapshot', payload: useBreachStore.getState().snapshot() } satisfies Msg)
    }

    chan.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data?.kind === 'sync-request') publish()
    }

    const unsub = useBreachStore.subscribe(publish)
    publish() // initial

    return () => {
      unsub()
      chan.close()
      chanRef.current = null
    }
  }, [])
}

/** Call in the DETACHED window: hydrates local store from snapshots. */
export function useBreachSubscriber() {
  const hydrate = useBreachStore((s) => s.hydrate)

  useEffect(() => {
    const chan = getChannel()
    if (!chan) return

    chan.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data?.kind === 'snapshot') hydrate(e.data.payload)
    }
    chan.postMessage({ kind: 'sync-request' } satisfies Msg) // pull current state

    return () => chan.close()
  }, [hydrate])
}

/** Open the map in a separate window (2nd screen). */
export function openMapWindow(locale: string) {
  if (typeof window === 'undefined') return
  window.open(
    `/map/${locale}`,
    'pbn-network-map',
    'popup,width=1100,height=820,menubar=no,toolbar=no,location=no,status=no',
  )
}
