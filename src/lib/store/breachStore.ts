import { create } from 'zustand'
import type { TopoEdge, TopoMutation, TopoNode } from '~/lib/content/types'

/**
 * Global breach state (Zustand).
 *
 * The LiveNetworkMap is a pure projection of "which modules have been
 * revealed". We store the set of revealed module ids plus the accumulated
 * nodes/edges, and expose `applyMutations` so a module page can push its
 * topology when the reader opens it. State changes are mirrored to any
 * detached map window through the Broadcast Channel bridge (see broadcast.ts).
 */

export interface BreachState {
  revealed: string[] // module ids, in reveal order
  activeModule: string | null
  nodes: Record<string, TopoNode>
  edges: Record<string, TopoEdge>
  highlighted: string[] // edge ids on the "shortest path to DA"

  revealModule: (moduleId: string, mutations?: TopoMutation[]) => void
  applyMutations: (mutations: TopoMutation[]) => void
  reset: () => void
  /** Replace entire snapshot — used by the detached window when it syncs. */
  hydrate: (snapshot: BreachSnapshot) => void
  snapshot: () => BreachSnapshot
}

export interface BreachSnapshot {
  revealed: string[]
  activeModule: string | null
  nodes: Record<string, TopoNode>
  edges: Record<string, TopoEdge>
  highlighted: string[]
}

function applyOne(state: BreachState, m: TopoMutation) {
  switch (m.op) {
    case 'addNode':
      state.nodes[m.node.id] = { ...state.nodes[m.node.id], ...m.node }
      break
    case 'addEdge':
      state.edges[m.edge.id] = { ...state.edges[m.edge.id], ...m.edge }
      break
    case 'compromise': {
      const n = state.nodes[m.nodeId]
      if (n) n.owned = true
      break
    }
    case 'highlightPath':
      state.highlighted = Array.from(new Set([...state.highlighted, ...m.edgeIds]))
      break
  }
}

const EMPTY: BreachSnapshot = {
  revealed: [],
  activeModule: null,
  nodes: {},
  edges: {},
  highlighted: [],
}

export const useBreachStore = create<BreachState>((set, get) => ({
  ...structuredCloneSafe(EMPTY),

  revealModule: (moduleId, mutations) =>
    set((s) => {
      const next: BreachState = {
        ...s,
        nodes: { ...s.nodes },
        edges: { ...s.edges },
        highlighted: [...s.highlighted],
        activeModule: moduleId,
        revealed: s.revealed.includes(moduleId) ? s.revealed : [...s.revealed, moduleId],
      }
      if (mutations && !s.revealed.includes(moduleId)) {
        for (const m of mutations) applyOne(next, m)
      }
      return next
    }),

  applyMutations: (mutations) =>
    set((s) => {
      const next: BreachState = {
        ...s,
        nodes: { ...s.nodes },
        edges: { ...s.edges },
        highlighted: [...s.highlighted],
      }
      for (const m of mutations) applyOne(next, m)
      return next
    }),

  reset: () => set(() => structuredCloneSafe(EMPTY)),

  hydrate: (snapshot) => set(() => structuredCloneSafe(snapshot)),

  snapshot: () => {
    const { revealed, activeModule, nodes, edges, highlighted } = get()
    return structuredCloneSafe({ revealed, activeModule, nodes, edges, highlighted })
  },
}))

function structuredCloneSafe<T>(v: T): T {
  if (typeof structuredClone === 'function') return structuredClone(v)
  return JSON.parse(JSON.stringify(v)) as T
}
